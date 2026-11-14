import type { LinkDescriptor } from 'react-router'
import { HERO_SIZES, HERO_SRC, HERO_SRCSET } from '@/features/nosotros/hero-image'
import { NosotrosPage } from '@/pages/NosotrosPage'

/** La foto del hero es la imagen principal: se precarga con los mismos srcset y sizes que el <img> (una sola descarga). */
export const links = (): LinkDescriptor[] => [
  // fetchPriority no figura en el tipo del descriptor, pero React lo escribe en el <link>.
  {
    rel: 'preload',
    as: 'image',
    href: HERO_SRC,
    imageSrcSet: HERO_SRCSET,
    imageSizes: HERO_SIZES,
    fetchPriority: 'high',
  } as LinkDescriptor,
]

/** Módulo de ruta: se registra una vez por idioma (el idioma lo determina la URL). */
export default function NosotrosRoute() {
  return <NosotrosPage />
}
