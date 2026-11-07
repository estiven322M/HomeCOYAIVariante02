import { prefersReducedMotion } from '@/shared/lib/reduced-motion'
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'

/** active: intro visible · leaving: veil dissolves + logo travels · reveal: hero items enter in order · done */
export type Phase = 'active' | 'leaving' | 'reveal' | 'done'

export const SEEN_KEY = 'ecoyai-intro-seen'
const MIN_MS = 2500
const MAX_MS = 4000

const seen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}
type Ctx = {
  phase: Phase
  /** false hasta que el cliente decide si hay intro (en el servidor y en el primer render siempre es false). */
  ready: boolean
  skip: () => void
  reportVideo: () => void
}
const IntroContext = createContext<Ctx | null>(null)

export function useIntro() {
  const ctx = useContext(IntroContext)
  if (!ctx) throw new Error('useIntro must be used inside <IntroProvider>')
  return ctx
}

/**
 * Conduce la línea de tiempo del intro y la refleja en <html data-intro="…"> para que el CSS escalone el hero.
 *
 * Es seguro para prerender: en el servidor y en el primer render del cliente la fase es «done» (la página se
 * ve completa y sin `inert`). Un script mínimo en <head> (ver boot-script.ts) marca data-intro="active" antes del
 * primer pintado para los visitantes nuevos; aquí, tras hidratar, se confirma la misma decisión.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('done')
  const [ready, setReady] = useState(false)
  const [minDone, setMinDone] = useState(false)
  const [videoOk, setVideoOk] = useState(false)

  // Una sola vez, en el cliente y antes de pintar: ¿hay intro? (visitante nuevo y sin movimiento reducido)
  useLayoutEffect(() => {
    // Decisión solo de cliente, tras hidratar: el servidor no tiene sessionStorage ni matchMedia.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!seen() && !prefersReducedMotion()) setPhase('active')
    setReady(true)
    /* eslint-enable react-hooks/set-state-in-effect */
    ;(window as unknown as { __introReady?: boolean }).__introReady = true
  }, [])

  useLayoutEffect(() => {
    // Hasta que el cliente decide, data-intro lo gobierna el script de <head>: no se toca.
    if (ready) document.documentElement.dataset.intro = phase
  }, [phase, ready])

  const leave = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* storage unavailable */
    }
    setPhase((p) => (p === 'active' ? 'leaving' : p))
  }, [])
  const reportVideo = useCallback(() => setVideoOk(true), [])

  // Minimum 2.5 s on screen; if the video has not reported by 4 s the intro ends anyway (poster stays).
  useEffect(() => {
    if (phase !== 'active') return
    const a = setTimeout(() => setMinDone(true), MIN_MS)
    const b = setTimeout(() => {
      setMinDone(true)
      setVideoOk(true)
    }, MAX_MS)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'active' && minDone && videoOk) leave()
  }, [phase, minDone, videoOk, leave])

  useEffect(() => {
    const reduced = prefersReducedMotion()
    if (phase === 'leaving') {
      const id = setTimeout(() => setPhase('reveal'), reduced ? 200 : 500)
      return () => clearTimeout(id)
    }
    if (phase === 'reveal') {
      const id = setTimeout(() => setPhase('done'), reduced ? 0 : 1500)
      return () => clearTimeout(id)
    }
  }, [phase])

  return <IntroContext.Provider value={{ phase, ready, skip: leave, reportVideo }}>{children}</IntroContext.Provider>
}
