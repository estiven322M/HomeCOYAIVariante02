import { useEffect, useState } from 'react'

/**
 * Alto de la ventana. Seguro para prerender: durante el render (servidor y primer render del cliente) devuelve
 * `initial`; el valor real se lee en un efecto y se mantiene al redimensionar.
 */
export function useViewportHeight(initial = 800) {
  const [height, setHeight] = useState(initial)
  useEffect(() => {
    const on = () => setHeight(window.innerHeight)
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return height
}
