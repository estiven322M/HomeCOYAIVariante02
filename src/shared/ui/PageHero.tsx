import type { ReactNode } from 'react'

import { srcSetOf, type ImageSpec } from './FillImage'
import { ImagePlaceholder } from './ImagePlaceholder'

export type PageHeroImage = { src: string; srcSet: string; sizes: string; width: number; height: number }

/** Imagen de hero (1280 px por defecto, con su srcset) a partir de un `ImageSpec`, o `null` mientras no exista (marcador). */
export function pageHeroImage(spec: ImageSpec): PageHeroImage | null {
  if (!spec.available) return null
  return {
    src: `${spec.base}-1280.webp`,
    srcSet: srcSetOf(spec),
    sizes: '(min-width: 1138px) 100vw, 1138px',
    width: spec.width,
    height: spec.height,
  }
}

/**
 * Hero de las páginas interiores: foto a pantalla completa (imagen principal: prioridad alta, sin lazy), velos que
 * mantienen el contraste AA del texto, eyebrow, h1 y subtítulo. Lo usan Nosotros y Salud.
 * Sin `image` (aún no existe) se ve un marcador de la paleta, sin texto.
 * `size="long"` rebaja el tamaño del h1 para títulos largos. `aside` es un rótulo decorativo (aria-hidden) en la
 * esquina inferior derecha (desde `sm`).
 */
export function PageHero({
  image,
  eyebrow,
  title,
  subtitle,
  aside,
  size = 'display',
}: {
  image: PageHeroImage | null
  eyebrow: string
  title: string
  subtitle: string
  aside?: ReactNode
  size?: 'display' | 'long'
}) {
  const titleSize = size === 'long' ? 'max-w-3xl text-title-sm md:text-title-xl' : 'text-display-sm md:text-display'
  return (
    <section className="relative h-[34rem] overflow-hidden bg-(--color-noche) md:h-[40rem]">
      {image ? (
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.sizes}
          width={image.width}
          height={image.height}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[55%_center] md:object-center"
        />
      ) : (
        <ImagePlaceholder tone="oscuro" />
      )}
      <div aria-hidden className="page-hero-velo-h absolute inset-0" />
      <div aria-hidden className="page-hero-velo-v absolute inset-0" />
      <div aria-hidden className="page-hero-velo-esquina absolute inset-0 hidden sm:block" />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-16 md:pb-24">
        <p className="hero-eyebrow text-caption uppercase tracking-[0.3em]">{eyebrow}</p>
        <h1 className={`hero-title mt-6 font-serif font-light tracking-tight ${titleSize}`}>{title}</h1>
        <p className="hero-text mt-6 max-w-[30rem] text-balance font-serif text-lead font-light italic lg:max-w-[42rem]">
          {subtitle}
        </p>
      </div>
      {aside && (
        <p
          aria-hidden
          className="hero-meta absolute bottom-10 right-6 hidden text-right text-caption leading-5 uppercase tracking-[0.3em] sm:block"
        >
          {aside}
        </p>
      )}
    </section>
  )
}
