import { env } from '@/env'
import { useLang, usePathFor } from '@/shared/i18n'
import { IMAGES } from '@/features/salud/images'
import { Button } from '@/shared/ui/Button'
import { FillImage } from '@/shared/ui/FillImage'
import { SubTitle } from '@/shared/ui/SubTitle'
import { SolicitudForm } from './SolicitudForm'

/**
 * Solicitar información sobre próximos encuentros (llamado a la acción). Con `VITE_FORMS_ENABLED` el formulario
 * (Netlify Forms); sin él, el mismo título y un botón a Contacto (el formulario no sale ni en el HTML).
 */
export function Solicitar() {
  const { t } = useLang()
  const pathFor = usePathFor()
  const s = t.salud.solicitar
  return (
    <section className="relative overflow-hidden bg-(--color-noche) px-6 py-28 text-arena-clara">
      <FillImage spec={IMAGES.solicitar} tone="oscuro" sizes="100vw" />
      <div aria-hidden className="absolute inset-0 bg-(--color-noche)/60" />
      <div className="relative mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-[5fr_7fr] md:gap-16">
        <div>
          <SubTitle label={s.label} light />
          <h2 className="mt-8 font-serif text-title-sm font-light md:text-title">{s.title}</h2>
        </div>
        {env.FORMS_ENABLED ? (
          <SolicitudForm />
        ) : (
          <div>
            <p className="text-body text-arena-clara/85">{s.off.text}</p>
            <div className="mt-8">
              <Button href={pathFor('contacto')}>{s.off.cta}</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
