import { isHomePath } from '@/shared/i18n/routes'
import { prefersReducedMotion } from '@/shared/lib/reduced-motion'
import { useLocation } from 'react-router'
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'

/** active: intro visible · leaving: veil dissolves + logo travels · reveal: hero items enter in order · done */
export type Phase = 'active' | 'leaving' | 'reveal' | 'done'

export const SEEN_KEY = 'ecoyai-intro-seen'
const MIN_MS = 2500
/** Tope del velo, contado desde el primer pintado (lo garantiza el script de <head>; ver boot-script.ts). */
export const MAX_MS = 4000
/** Duración de la disolución del velo y de la entrada escalonada del hero (deben coincidir con el CSS). */
export const LEAVE_MS = 500
export const REVEAL_MS = 1500
/** Con estas conexiones, o con ahorro de datos, no hay intro (mismas condiciones en el script de <head>). */
export const SLOW_CONNECTION_TYPES = ['slow-2g', '2g', '3g']

type NetworkInfo = { saveData?: boolean; effectiveType?: string }
const saveDataOrSlow = () => {
  const c = (navigator as unknown as { connection?: NetworkInfo }).connection
  return !!c && (!!c.saveData || SLOW_CONNECTION_TYPES.includes(c.effectiveType ?? ''))
}

const seen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}
/** Marca el intro como visto en esta sesión (también si la sesión empieza fuera de la portada). */
const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* storage unavailable */
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
  // Solo cuenta la página con la que EMPIEZA la sesión: la URL del primer render del cliente.
  const startPath = useLocation().pathname

  // Una sola vez, en el cliente y antes de pintar: ¿hay intro? (visitante nuevo y sin movimiento reducido)
  useLayoutEffect(() => {
    // Decisión solo de cliente, tras hidratar: el servidor no tiene sessionStorage ni matchMedia.
    /* eslint-disable react-hooks/set-state-in-effect */
    const current = document.documentElement.dataset.intro
    if (!isHomePath(startPath)) markSeen()
    // El script de <head> ya agotó el tope de 4 s antes de hidratar: se continúa desde su fase, sin volver a mostrarlo.
    else if (current === 'leaving' || current === 'reveal') setPhase(current)
    else if (!seen() && !prefersReducedMotion() && !saveDataOrSlow()) setPhase('active')
    setReady(true)
    /* eslint-enable react-hooks/set-state-in-effect */
    ;(window as unknown as { __introReady?: boolean }).__introReady = true
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo la URL de entrada (primer render)
  }, [])

  useLayoutEffect(() => {
    // Hasta que el cliente decide, data-intro lo gobierna el script de <head>: no se toca.
    if (ready) document.documentElement.dataset.intro = phase
  }, [phase, ready])

  const leave = useCallback(() => {
    markSeen()
    setPhase((p) => (p === 'active' ? 'leaving' : p))
  }, [])
  const reportVideo = useCallback(() => setVideoOk(true), [])

  // Minimum 2.5 s on screen; if the video has not reported by 4 s the intro ends anyway (poster stays).
  useEffect(() => {
    if (phase !== 'active') return
    const a = setTimeout(() => setMinDone(true), MIN_MS)
    // El tope cuenta desde el primer pintado (window.__introT0, puesto por el script de <head>), no desde hidratar.
    const t0 = (window as unknown as { __introT0?: number }).__introT0
    const left = t0 === undefined ? MAX_MS : Math.max(0, MAX_MS - (performance.now() - t0))
    const b = setTimeout(() => {
      setMinDone(true)
      setVideoOk(true)
    }, left)
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
      const id = setTimeout(() => setPhase('reveal'), reduced ? 200 : LEAVE_MS)
      return () => clearTimeout(id)
    }
    if (phase === 'reveal') {
      const id = setTimeout(() => setPhase('done'), reduced ? 0 : REVEAL_MS)
      return () => clearTimeout(id)
    }
  }, [phase])

  return <IntroContext.Provider value={{ phase, ready, skip: leave, reportVideo }}>{children}</IntroContext.Provider>
}
