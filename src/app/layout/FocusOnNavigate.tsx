import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * Accesibilidad al navegar dentro del sitio (el navegador no recarga la página, así que no mueve el foco solo):
 * el foco pasa al <h1> de la nueva página —los lectores de pantalla lo anuncian— o, si la URL trae #ancla, a
 * ese elemento. El desplazamiento lo hace ScrollRestoration (arriba, o hasta el ancla); aquí nunca se desplaza
 * (`preventScroll`), para no pelear con él ni con `preventScrollReset` del selector de idioma.
 * No actúa en la carga inicial: ahí el navegador ya se encarga.
 */
export function FocusOnNavigate() {
  const { key, hash } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    const el = target ?? document.querySelector<HTMLElement>('#contenido h1')
    if (!el) return
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.style.outline = 'none'
    el.focus({ preventScroll: true })
  }, [key, hash])

  return null
}
