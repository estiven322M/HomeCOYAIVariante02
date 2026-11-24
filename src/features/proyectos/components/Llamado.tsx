import type { Proyecto } from '@/content/es/proyectos'
import { IMAGES } from '@/features/proyectos/images'
import { usePathFor } from '@/shared/i18n'
import { Button } from '@/shared/ui/Button'
import { FillImage } from '@/shared/ui/FillImage'
import { SubTitle } from '@/shared/ui/SubTitle'

/**
 * Llamado a la acción: foto de fondo decorativa (`alt=""`; marcador sin texto mientras falte) con los velos del hero
 * para el contraste, y un botón a la página de Donaciones / Alianzas (ruta `colaborar`, según el idioma).
 */
export function Llamado({ data }: { data: Proyecto['cta'] }) {
  const pathFor = usePathFor()
  return (
    <section className="relative overflow-hidden bg-noche text-calido">
      <FillImage spec={IMAGES.llamado} tone="oscuro" sizes="100vw" />
      <div aria-hidden className="page-hero-velo-h absolute inset-0" />
      <div aria-hidden className="page-hero-velo-v absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
        <SubTitle label={data.label} light />
        <h2 className="mt-8 max-w-2xl font-serif text-title-sm font-light md:text-title">{data.title}</h2>
        <div className="mt-10">
          <Button href={pathFor('colaborar')}>{data.button}</Button>
        </div>
      </div>
    </section>
  )
}
