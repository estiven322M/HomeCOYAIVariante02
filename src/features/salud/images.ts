/**
 * Imágenes de Salud (derivados de `pnpm images` en `public/salud/`, originales en `assets-src/salud/`).
 * Las 6 están activas. Si alguna falta (`available: false`) la página muestra un marcador de la paleta, sin texto.
 * El hero es decorativo (`alt=""`); el resto lleva su texto en `content/{es,en}/salud.ts` (`imageAlt`, `imageAlts`).
 * Al añadir una imagen: copia el original a `assets-src/salud/`, ejecuta `pnpm images salud`, pon `available: true` y
 * añade su texto alternativo en `content/{es,en}/salud.ts` (las imágenes decorativas llevan `alt=""`).
 */
import type { ImageSpec } from '@/shared/ui/FillImage'
import { pageHeroImage } from '@/shared/ui/PageHero'

export type SaludImageId = 'hero' | 'llamado' | 'practica1' | 'practica2' | 'practica3' | 'practica4'

const wide = (base: string): ImageSpec => ({
  available: true,
  base,
  widths: [960, 1280, 1920],
  width: 1920,
  height: 1080,
})
const tall = (base: string): ImageSpec => ({ available: true, base, widths: [480, 900], width: 900, height: 1125 })

export const IMAGES: Record<SaludImageId, ImageSpec> = {
  hero: wide('/salud/hero'),
  llamado: tall('/salud/llamado'),
  practica1: tall('/salud/practica-1-yage'),
  practica2: tall('/salud/practica-2-purgas-banos'),
  practica3: tall('/salud/practica-3-botanica'),
  practica4: tall('/salud/practica-4-saberes'),
}

export const PRACTICE_IMAGES = ['practica1', 'practica2', 'practica3', 'practica4'] as const satisfies SaludImageId[]

/** Imagen del hero para `PageHero`, o `null` mientras no exista (marcador). */
export function heroImage() {
  return pageHeroImage(IMAGES.hero)
}
