import { useEffect, useRef } from 'react'
import { preload } from 'react-dom'

export type VideoSource = { src: string; type: string }

/**
 * Video de fondo decorativo (sin sonido, en bucle, `aria-hidden`) que rellena su contenedor. `onReady` avisa cuando ya
 * puede reproducirse (o cuando falla: no hay que esperarlo más); la portada lo usa para cerrar el intro.
 */
export function BackgroundVideo({
  sources,
  poster,
  onReady,
}: {
  /** En orden de preferencia: el navegador usa el primero que sepa reproducir. */
  sources: VideoSource[]
  poster: string
  onReady?: () => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  // El póster es lo primero que se ve: prioridad alta (también en el <head> prerenderizado).
  preload(poster, { as: 'image', fetchPriority: 'high' })
  // Si el video ya estaba listo antes de hidratar, el evento canplay se perdió: se comprueba al montar.
  useEffect(() => {
    if (ref.current && ref.current.readyState >= 3) onReady?.()
  }, [onReady])

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      poster={poster}
      preload="auto"
      autoPlay
      loop
      muted
      playsInline
      onCanPlay={onReady}
      aria-hidden
    >
      {sources.map((s, i) => (
        // Con <source>, el fallo de carga llega al último elemento, no al <video>.
        <source key={s.src} src={s.src} type={s.type} onError={i === sources.length - 1 ? onReady : undefined} />
      ))}
    </video>
  )
}
