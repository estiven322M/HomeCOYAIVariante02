import { NosotrosPage } from '@/pages/NosotrosPage'

/**
 * Módulo de ruta: se registra una vez por idioma (el idioma lo determina la URL).
 * El preload de la foto del hero no se declara aquí: React lo emite en el <head> a partir del propio <img> del hero
 * (`fetchPriority="high"` + `srcSet` + `sizes`), así que el preload y la imagen no pueden diverger.
 */
export default function NosotrosRoute() {
  return <NosotrosPage />
}
