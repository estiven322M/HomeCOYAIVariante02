import { Link, useLocation } from 'react-router'
import { useLang, usePathFor } from '@/shared/i18n'
import { alternatePath } from '@/shared/i18n/routes'
import { PageIntro } from '@/shared/ui/PageIntro'
import { TextLink } from '@/shared/ui/TextLink'

/**
 * 404: se prerenderiza en /404/ y /en/404/ (el build las publica como 404.html) y sale en cualquier URL desconocida.
 * No lista las páginas: el pie, justo debajo, ya lleva esa navegación («Explora»).
 */
export function NotFoundPage() {
  const { lang, t } = useLang()
  const n = t.common.notFound
  const { pathname } = useLocation()
  const pathFor = usePathFor()
  const other = lang === 'es' ? 'en' : 'es'
  return (
    <PageIntro title={n.title} lead={n.text}>
      <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
        <TextLink href={pathFor('home')} light>
          {t.common.backHome}
        </TextLink>
        <Link
          to={alternatePath(pathname, other)}
          lang={other}
          hrefLang={other}
          className="border-b border-calido/40 pb-1 text-sm tracking-wide text-calido transition-colors duration-500 hover:border-calido"
        >
          {n.otherLang}
        </Link>
      </div>
    </PageIntro>
  )
}
