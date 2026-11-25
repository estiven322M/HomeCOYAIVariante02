import { useEffect, useRef, useState } from 'react'
import { saveDataOrSlow } from '@/shared/lib/network'
import { prefersReducedMotion } from '@/shared/lib/reduced-motion'

/**
 * Estado de un video de fondo (shared/ui/BackgroundVideo) y de su botón (shared/ui/VideoToggle).
 *
 * En el servidor y en el primer render no hay video: solo el póster. Tras hidratar, el video se carga y se reproduce
 * solo, salvo con movimiento reducido, ahorro de datos o conexión lenta; entonces no se descarga hasta que el visitante
 * pulsa «Reproducir». `playing` sale de los eventos del propio video, así que refleja también un `play()` rechazado o
 * una pausa decidida por el navegador.
 */
export function useBackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  /** null: sin decidir (servidor y primer render) · false: solo póster, sin descargar · true: cargar el video. */
  const [load, setLoad] = useState<boolean | null>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    // Decisión solo de cliente, tras hidratar: el servidor no tiene matchMedia ni navigator.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoad(!prefersReducedMotion() && !saveDataOrSlow())
  }, [])

  // Con las fuentes ya en el DOM se pide la reproducción. Si el navegador la rechaza, queda el botón «Reproducir».
  useEffect(() => {
    if (load) ref.current?.play()?.catch(() => setPlaying(false))
  }, [load])

  const toggle = () => {
    const video = ref.current
    if (!load) setLoad(true)
    else if (video?.paused) video.play()?.catch(() => setPlaying(false))
    else video?.pause()
  }

  return { ref, load, playing, failed, setPlaying, setFailed, toggle }
}

export type BackgroundVideoState = ReturnType<typeof useBackgroundVideo>
