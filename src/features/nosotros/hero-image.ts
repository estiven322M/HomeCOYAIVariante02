/** Imagen del hero de Nosotros (derivados de `pnpm images`). La usan el <img> y el preload de la ruta: deben coincidir. */
export const HERO_SRCSET = [960, 1280, 1920].map((w) => `/nosotros/hero-selva-${w}.webp ${w}w`).join(', ')
/** El hero cubre su caja: en pantallas estrechas la imagen se escala por la altura (544–640 px), no por el ancho. */
export const HERO_SIZES = '(min-width: 1138px) 100vw, 1138px'
export const HERO_SRC = '/nosotros/hero-selva-1280.webp'
export const HERO_W = 1920
export const HERO_H = 1081
