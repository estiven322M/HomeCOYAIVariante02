import { useLang, usePathFor } from '@/shared/i18n'
import { TextLink } from './TextLink'

/** Aviso de las secciones sin contenido propio todavía, con el camino de vuelta a la portada. */
export function SoonNotice() {
  const { t } = useLang()
  const pathFor = usePathFor()
  return (
    <section className="bg-crema px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <p role="status" className="font-serif text-3xl font-light leading-snug lg:text-4xl">
          {t.common.soon}
        </p>
        <div className="mt-10">
          <TextLink href={pathFor('home')}>{t.common.backHome}</TextLink>
        </div>
      </div>
    </section>
  )
}
