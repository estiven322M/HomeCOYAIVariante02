import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'


/** active: intro visible · leaving: veil dissolves + logo travels · reveal: hero items enter in order · done */
export type Phase = 'active' | 'leaving' | 'reveal' | 'done'

const SEEN_KEY = 'ecoyai-intro-seen'
const MIN_MS = 2500
const MAX_MS = 4000

const seen = () => {
  try { return sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}
export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

