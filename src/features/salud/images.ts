/**
 * Imágenes de Salud (derivados de `pnpm images` en `public/salud/`, originales en `assets-src/salud/`).
 * Mientras un original no exista (`available: false`) la página muestra un marcador de la paleta, sin texto.
 * Al añadir una imagen: copia el original a `assets-src/salud/`, ejecuta `pnpm images salud`, pon `available: true` y
 * añade su texto alternativo en `content/{es,en}/salud.ts` (las imágenes decorativas llevan `alt=""`).
 */
export type SaludImageId = 'hero' | 'llamado' | 'practica1' | 'practica2' | 'practica3' | 'practica4' | 'solicitar'

type Spec = { available: boolean; base: string; widths: number[]; width: number; height: number }

const wide = (base: string): Spec => ({ available: false, base, widths: [960, 1280, 1920], width: 1920, height: 1081 })
const tall = (base: string): Spec => ({ available: false, base, widths: [480, 960], width: 960, height: 1200 })

export const IMAGES: Record<SaludImageId, Spec> = {
  hero: wide('/salud/hero'),
  llamado: tall('/salud/llamado'),
  practica1: tall('/salud/practica-1-yage'),
  practica2: tall('/salud/practica-2-purgas-banos'),
  practica3: tall('/salud/practica-3-botanica'),
  practica4: tall('/salud/practica-4-saberes'),
  solicitar: wide('/salud/solicitar'),
}

export const PRACTICE_IMAGES = ['practica1', 'practica2', 'practica3', 'practica4'] as const satisfies SaludImageId[]

export function srcSetOf(id: SaludImageId) {
  const s = IMAGES[id]
  return s.widths.map((w) => `${s.base}-${w}.webp ${w}w`).join(', ')
}

/** Imagen del hero para `PageHero`, o `null` mientras no exista (marcador). */
export function heroImage() {
  const s = IMAGES.hero
  if (!s.available) return null
  return {
    src: `${s.base}-1280.webp`,
    srcSet: srcSetOf('hero'),
    sizes: '(min-width: 1138px) 100vw, 1138px',
    width: s.width,
    height: s.height,
  }
}
