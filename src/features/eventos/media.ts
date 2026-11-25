import type { VideoSource } from '@/shared/ui/BackgroundVideo'

/**
 * Medios del hero de Eventos (derivados de `pnpm video`). Interruptores, como `available` en las imágenes:
 * - `video: false` apaga el video (no sale en el HTML ni se descarga) sin tocar nada más.
 * - `poster`: con el video apagado, muestra el póster; si también es `false`, queda un fondo huito con degradado.
 *   Sirve por si hubiera que retirar las imágenes de personas: apagar los dos y borrar los tres archivos.
 */
export type HeroMedia = { video: boolean; poster: boolean; sources: VideoSource[]; posterSrc: string }

export const HERO_MEDIA: HeroMedia = {
  video: true,
  poster: true,
  // En orden de preferencia: webm y, para quien no lo reproduzca, mp4.
  sources: [
    { src: '/video/eventos-hero.webm', type: 'video/webm' },
    { src: '/video/eventos-hero.mp4', type: 'video/mp4' },
  ],
  posterSrc: '/video/eventos-poster.jpg',
}

/**
 * Marca de agua del tigre en el panel de texto del hero (desde 1440 px). Es una versión monocroma y recortada de la
 * marca, PENDIENTE DE APROBACIÓN de la organización (ver docs/known-issues.md). Con `false` desaparece (y no se
 * descarga) sin tocar los rombos.
 */
export const MARCA_TIGRE: boolean = true
