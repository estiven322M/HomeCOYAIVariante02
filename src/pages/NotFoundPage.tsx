import { Link, useLocation } from 'react-router'
import { useLang, useNav, usePathFor } from '@/shared/i18n'
import { alternatePath } from '@/shared/i18n/routes'
import { PageIntro } from '@/shared/ui/PageIntro'
import { TextLink } from '@/shared/ui/TextLink'

/** 404: se prerenderiza en /404/ y /en/404/ (el build las publica como 404.html) y sale en cualquier URL desconocida. */
export function NotFoundPage() {
  const { lang, t } = useLang()
  const n = t.common.notFound
  const { pathname } = useLocation()
  const NAV = useNav()
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
      <nav aria-label={n.pages} className="mt-16">
        <p className="text-[11px] uppercase tracking-[0.3em] text-calido/60">{n.pages}</p>
        <ul className="mt-4 space-y-2 text-[17px]">
          {NAV.map((i) => (
            <li key={i.key}>
              <Link to={i.href} className="text-calido/85 hover:text-calido">
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PageIntro>
  )
}
