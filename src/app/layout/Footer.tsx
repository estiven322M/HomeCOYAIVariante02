import { Link } from 'react-router'
import { useLang, useNav } from '@/shared/i18n'
import { Logo } from '@/shared/ui/Logo'

/**
 * Pie global. Sus enlaces son reales (<a href>), así que sin JavaScript basta para recorrer el sitio.
 * Aviso legal y Política de privacidad no se muestran hasta que exista su contenido; las redes, hasta que haya
 * URL reales (ver docs/known-issues.md).
 */
export function Footer() {
  const f = useLang().t.common.footer
  const NAV = useNav()
  const hasSocial = f.socials.length > 0
  return (
    <footer className="bg-selva px-6 pb-10 pt-20 text-calido/70">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-5 max-w-xs font-serif text-lg font-light italic text-calido/60">{f.tagline}</p>
        </div>
        <nav aria-label={f.navAria}>
          <ul className="space-y-3 text-sm">
            {NAV.map((i) => (
              <li key={i.key}>
                <Link to={i.href} className="hover:text-calido">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {hasSocial && (
          <div className="space-y-3 text-sm">
            <p className="text-[11px] uppercase tracking-[0.3em] text-calido/45">{f.social}</p>
            <ul className="space-y-3">
              {f.socials.map((s) => (
                <li key={s.name}>
                  <a href={s.url} rel="noopener noreferrer" className="hover:text-calido">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mx-auto mt-16 flex max-w-6xl flex-col justify-between gap-4 border-t border-calido/10 pt-6 text-xs text-calido/45 md:flex-row">
        {/* suppressHydrationWarning: el año se calcula al construir y de nuevo en el navegador; difiere cada 1 de enero. */}
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} ÉCOYAI. {f.rights}
        </p>
      </div>
    </footer>
  )
}
