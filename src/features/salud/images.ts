/**
 * Imágenes de Salud (derivados de `pnpm images` en `public/salud/`, originales en `assets-src/salud/`).
 * Las 7 están activas. Si alguna falta (`available: false`) la página muestra un marcador de la paleta, sin texto.
 * Hero y solicitar son decorativas (`alt=""`); el resto lleva su texto en `content/{es,en}/salud.ts` (`imageAlt`, `imageAlts`).
 * Al añadir una imagen: copia el original a `assets-src/salud/`, ejecuta `pnpm images salud`, pon `available: true` y
 * añade su texto alternativo en `content/{es,en}/salud.ts` (las imágenes decorativas llevan `alt=""`).
 */
export type SaludImageId = 'hero' | 'llamado' | 'practica1' | 'practica2' | 'practica3' | 'practica4' | 'solicitar'

type Spec = { available: boolean; base: string; widths: number[]; width: number; height: number }

const wide = (base: string): Spec => ({ available: true, base, widths: [960, 1280, 1920], width: 1920, height: 1080 })
const tall = (base: string): Spec => ({ available: true, base, widths: [480, 900], width: 900, height: 1125 })

export const IMAGES: Record<SaludImageId, Spec> = {
  hero: wide('/salud/hero'),
  llamado: tall('/salud/llamado'),
  practica1: tall('/salud/practica-1-yage'),
  practica2: tall('/salud/practica-2-purgas-banos'),
  practica3: tall('/salud/practica-3-botanica'),
  practica4: tall('/salud/practica-4-saberes'),
  // Recorte 16:9 de 1200 px (el original es de 1280×960): no se amplía.
  solicitar: { ...wide('/salud/solicitar'), widths: [960, 1200], width: 1200, height: 675 },
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
