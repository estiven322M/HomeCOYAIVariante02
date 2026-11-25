import { useEffect } from 'react'
import { preload } from 'react-dom'
import type { BackgroundVideoState } from '@/shared/hooks/useBackgroundVideo'

export type VideoSource = { src: string; type: string }

/**
 * Video de fondo decorativo (sin sonido, en bucle, `aria-hidden`) que rellena su contenedor. El estado viene de
 * `useBackgroundVideo`; el botón de pausa (`VideoToggle`) va aparte porque debe quedar por encima de los velos.
 * Mientras no hay que cargarlo (también en el HTML prerenderizado y sin JavaScript) no tiene fuentes: se ve el póster.
 * `onReady` avisa cuando ya puede reproducirse, o cuando no hay que esperarlo (falla o no se carga); la portada lo usa
 * para cerrar el intro.
 */
export function BackgroundVideo({
  video,
  sources,
  poster,
  onReady,
}: {
  video: Pick<BackgroundVideoState, 'ref' | 'load' | 'setPlaying' | 'setFailed'>
  /** En orden de preferencia: el navegador usa el primero que sepa reproducir. */
  sources: VideoSource[]
  poster: string
  onReady?: () => void
}) {
  const { ref, load, setPlaying, setFailed } = video
  // El póster es lo primero que se ve: prioridad alta (también en el <head> prerenderizado).
  preload(poster, { as: 'image', fetchPriority: 'high' })
  useEffect(() => {
    if (load === false) onReady?.()
  }, [load, onReady])

  const fail = () => {
    setFailed(true)
    onReady?.()
  }

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      poster={poster}
      preload={load ? 'auto' : 'none'}
      loop
      muted
      playsInline
      onCanPlay={onReady}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      aria-hidden
    >
      {load &&
        sources.map((s, i) => (
          // Con <source>, el fallo de carga llega al último elemento, no al <video>.
          <source key={s.src} src={s.src} type={s.type} onError={i === sources.length - 1 ? fail : undefined} />
        ))}
    </video>
  )
}
