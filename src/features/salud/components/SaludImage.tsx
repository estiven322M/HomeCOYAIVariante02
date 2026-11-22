import { ImagePlaceholder } from '@/shared/ui/ImagePlaceholder'
import { IMAGES, srcSetOf, type SaludImageId } from '@/features/salud/images'

/**
 * Imagen de Salud que rellena su contenedor (`absolute inset-0`): la real si ya existe o un marcador sin texto.
 * Decorativa (`alt=""`) hasta que se entreguen las fotos y su texto alternativo (ver `images.ts`).
 */
export function SaludImage({
  id,
  sizes,
  tone = 'claro',
  alt = '',
}: {
  id: SaludImageId
  sizes: string
  tone?: 'oscuro' | 'claro' | 'huito'
  alt?: string
}) {
  const spec = IMAGES[id]
  if (!spec.available) return <ImagePlaceholder tone={tone} />
  return (
    <img
      src={`${spec.base}-${spec.widths[spec.widths.length - 1]}.webp`}
      srcSet={srcSetOf(id)}
      sizes={sizes}
      width={spec.width}
      height={spec.height}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}
