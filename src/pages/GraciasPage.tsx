import { useLang, usePathFor } from '@/shared/i18n'
import { PageIntro } from '@/shared/ui/PageIntro'
import { PatternZone } from '@/shared/ui/PatternZone'
import { TextLink } from '@/shared/ui/TextLink'

/** /gracias/ — destino del envío del formulario sin JavaScript. Fuera del menú y siempre noindex. */
export function GraciasPage() {
  const { t } = useLang()
  const pathFor = usePathFor()
  const g = t.salud.solicitar.gracias
  return (
    <>
      <PageIntro title={g.title} lead={g.text} />
      <PatternZone as="section" className="bg-crema px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <TextLink href={pathFor('home')}>{t.common.backHome}</TextLink>
        </div>
      </PatternZone>
    </>
  )
}
