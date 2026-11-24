/**
 * Imágenes de Proyectos (derivados de `pnpm images` en `public/proyectos/`, originales en `assets-src/proyectos/`).
 * Mientras un original no exista (`available: false`) la página muestra un marcador de la paleta, sin texto.
 * Hero y llamado son decorativas (`alt=""`); el retrato y las tres tarjetas llevan su texto alternativo en
 * `content/{es,en}/proyectos.ts` (`retratoAlt`, `frentes[].imageAlt`), que se redacta con la foto delante.
 * Al llegar una imagen: copia el original a `assets-src/proyectos/` con el nombre de abajo, ejecuta
 * `pnpm images proyectos`, pon `available: true` y escribe su texto alternativo (las decorativas, `alt=""`).
 *
 * Archivos esperados (proporción · mínimo · grado de color):
 *   hero.webp · 16:9 · 1920×1080 · selva        retrato.webp · 4:5 · 900×1125 · serie
 *   frente-1-corpus.webp, frente-2-ia.webp, frente-3-formacion.webp · 4:3 · 960×720 · serie
 *   llamado.webp · 16:9 · 1920×1080 · selva
 */
import type { ImageSpec } from '@/shared/ui/FillImage'
import { pageHeroImage } from '@/shared/ui/PageHero'

const wide = (base: string): ImageSpec => ({
  available: false,
  base,
  widths: [960, 1280, 1920],
  width: 1920,
  height: 1080,
})
const card = (base: string): ImageSpec => ({ available: false, base, widths: [480, 960], width: 960, height: 720 })

export const IMAGES = {
  hero: wide('/proyectos/hero'),
  retrato: { available: false, base: '/proyectos/retrato', widths: [480, 900], width: 900, height: 1125 } as ImageSpec,
  frentes: [
    card('/proyectos/frente-1-corpus'),
    card('/proyectos/frente-2-ia'),
    card('/proyectos/frente-3-formacion'),
  ] as const,
  llamado: wide('/proyectos/llamado'),
}

/** Imagen del hero para `PageHero`, o `null` mientras no exista (marcador). */
export const heroImage = () => pageHeroImage(IMAGES.hero)
