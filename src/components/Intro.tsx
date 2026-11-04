import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useLang } from '../i18n'

/** active: intro visible · leaving: veil dissolves + logo travels · reveal: hero items enter in order · done */
type Phase = 'active' | 'leaving' | 'reveal' | 'done'

const SEEN_KEY = 'ecoyai-intro-seen'
const MIN_MS = 2500
const MAX_MS = 4000

const seen = () => {
  try { return sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Ctx = { phase: Phase; skip: () => void; reportVideo: () => void }
const IntroContext = createContext<Ctx | null>(null)

export function useIntro() {
  const ctx = useContext(IntroContext)
  if (!ctx) throw new Error('useIntro must be used inside <IntroProvider>')
  return ctx
}

/** Drives the intro timeline and mirrors it on <html data-intro="…"> so CSS can stage the hero. */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>(() => (seen() ? 'done' : 'active'))
  const [minDone, setMinDone] = useState(false)
  const [videoOk, setVideoOk] = useState(false)

  useLayoutEffect(() => { document.documentElement.dataset.intro = phase }, [phase])

  const leave = useCallback(() => {
    try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* storage unavailable */ }
    setPhase((p) => (p === 'active' ? 'leaving' : p))
  }, [])
  const reportVideo = useCallback(() => setVideoOk(true), [])

  // Minimum 2.5 s on screen; if the video has not reported by 4 s the intro ends anyway (poster stays).
  useEffect(() => {
    if (phase !== 'active') return
    const a = setTimeout(() => setMinDone(true), MIN_MS)
    const b = setTimeout(() => { setMinDone(true); setVideoOk(true) }, MAX_MS)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [phase])

  useEffect(() => { if (phase === 'active' && minDone && videoOk) leave() }, [phase, minDone, videoOk, leave])

  useEffect(() => {
    const reduced = reducedMotion()
    if (phase === 'leaving') {
      const id = setTimeout(() => setPhase('reveal'), reduced ? 200 : 500)
      return () => clearTimeout(id)
    }
    if (phase === 'reveal') {
      const id = setTimeout(() => setPhase('done'), reduced ? 0 : 1500)
      return () => clearTimeout(id)
    }
  }, [phase])

  return <IntroContext.Provider value={{ phase, skip: leave, reportVideo }}>{children}</IntroContext.Provider>
}

/** Brand screen over the (already loading) hero video. Only transform/opacity are animated. */
export function Intro() {
  const { phase, skip } = useIntro()
  const { t } = useLang()
  const i = t.intro
  const logoRef = useRef<HTMLImageElement>(null)
  const leaving = phase === 'leaving'

  // Fly the wordmark to the header logo: measured delta, applied as a single transform.
  useLayoutEffect(() => {
    if (!leaving || reducedMotion()) return
    const from = logoRef.current
    const to = document.getElementById('header-logo')
    if (!from || !to) return
    const a = from.getBoundingClientRect()
    const b = to.getBoundingClientRect()
    const s = b.width / a.width
    from.style.transform = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(${s})`
  }, [leaving])

  if (phase !== 'active' && phase !== 'leaving') return null
  return (
    <div role="region" aria-label={i.aria} className="intro-root fixed inset-0 z-[100] flex flex-col items-center justify-center px-6">
      <div className="intro-veil absolute inset-0" data-leaving={leaving} aria-hidden />

      <button type="button" onClick={skip} data-leaving={leaving}
        className="intro-skip intro-fade absolute right-5 top-5 z-10 px-2 py-1 text-[11px] uppercase tracking-[0.25em] underline-offset-4 hover:underline lg:right-8 lg:top-6">
        {i.skip}
      </button>

      <div className="relative flex flex-col items-center">
        <img src="/branding/tigre.png" alt={i.tigerAlt} data-leaving={leaving} className="intro-fade h-[140px] w-auto" />
        <img ref={logoRef} src="/branding/ecoyai_titulo.svg" alt="ÉCOYAI" data-leaving={leaving}
          className="intro-logo-travel mt-8 w-[280px] max-w-[70vw]" />
        <p data-leaving={leaving} className="intro-phrase intro-fade mt-6 text-center font-serif text-lg font-light italic" style={{ textAlign: 'center' }}>
          {i.phrase}
        </p>
      </div>

      <div data-leaving={leaving} className="intro-fade absolute inset-x-0 bottom-10 flex flex-col items-center gap-3">
        <div className="intro-bar h-0.5 w-40 overflow-hidden" role="progressbar" aria-label={i.loading}><span className="block h-full w-full" /></div>
        <p className="intro-label text-[10px] uppercase tracking-[0.3em]" style={{ textAlign: 'center' }}>{i.loading}</p>
      </div>
    </div>
  )
}
