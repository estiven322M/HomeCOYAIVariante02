import { ImagePlaceholder } from './ImagePlaceholder'

/**
 * Descripción de una imagen derivada por `pnpm images`: `<base>-<ancho>.webp` por cada ancho de `widths`; `width` y
 * `height` son las dimensiones intrínsecas del mayor (evitan el salto de maquetación). `available: false` = aún no existe.
 */
export type ImageSpec = { available: boolean; base: string; widths: number[]; width: number; height: number }

/** Atributo `srcset` de una imagen derivada. */
export function srcSetOf(spec: ImageSpec) {
  return spec.widths.map((w) => `${spec.base}-${w}.webp ${w}w`).join(', ')
}

/**
 * Imagen que rellena su contenedor (`absolute inset-0`): la real si ya existe o un marcador sin texto.
 * Decorativa (`alt=""`) salvo que se le pase su texto alternativo. Cada feature declara sus `ImageSpec` en su `images.ts`.
 */
export function FillImage({
  spec,
  sizes,
  tone = 'claro',
  alt = '',
  priority = false,
}: {
  spec: ImageSpec
  sizes: string
  tone?: 'oscuro' | 'claro' | 'huito'
  alt?: string
  /** Imagen principal de la página (sin carga diferida). */
  priority?: boolean
}) {
  if (!spec.available) return <ImagePlaceholder tone={tone} />
  return (
    <img
      src={`${spec.base}-${spec.widths[spec.widths.length - 1]}.webp`}
      srcSet={srcSetOf(spec)}
      sizes={sizes}
      width={spec.width}
      height={spec.height}
      alt={alt}
      loading={priority ? undefined : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}
