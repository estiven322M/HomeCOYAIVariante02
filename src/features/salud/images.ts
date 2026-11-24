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

const tall = (base: string): ImageSpec => ({ available: true, base, widths: [480, 900], width: 900, height: 1125 })

export const IMAGES: Record<SaludImageId, ImageSpec> = {
  // El original mide 1280×960 y, enderezado, quedan 1260×936: no se amplía.
  hero: { available: true, base: '/salud/hero', widths: [960, 1260], width: 1260, height: 936 },
  llamado: tall('/salud/llamado'),
  practica1: tall('/salud/practica-1-yage'),
  practica2: tall('/salud/practica-2-purgas-banos'),
  practica3: tall('/salud/practica-3-botanica'),
  practica4: tall('/salud/practica-4-saberes'),
}

export const PRACTICE_IMAGES = ['practica1', 'practica2', 'practica3', 'practica4'] as const satisfies SaludImageId[]

/** Imagen del hero para `PageHero`, o `null` mientras no exista (marcador). */
export function heroImage() {
  const image = pageHeroImage(IMAGES.hero)
  // En pantallas estrechas se ve la parte izquierda de la foto (la orilla, con el río detrás del texto).
  // De 1024 a 1279 px el final del título cae sobre el cielo, donde el velo casi no cubre: se encuadra abajo y se
  // atenúa un poco la foto para cumplir contraste AA.
  return (
    image && {
      ...image,
      position: 'object-[20%_center] md:object-center lg:max-xl:object-[center_bottom] lg:max-xl:brightness-90',
    }
  )
}
