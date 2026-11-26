import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { CONTACTO, type Contacto, type RedSocial } from '@/content/contacto'
import { LANG_NAMES, useLang, useLangLinks, useNav, usePathFor } from '@/shared/i18n'
import { PRIVACIDAD_EN_PIE, resolveRoute } from '@/shared/i18n/routes'
import { Diamond } from '@/shared/ui/Diamond'
import { Logo } from '@/shared/ui/Logo'
import { FooterPaisaje } from './FooterPaisaje'

const REDES: Record<RedSocial, { nombre: string; icono: ReactNode }> = {
  instagram: {
    nombre: 'Instagram',
    icono: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17 7h.01" />
      </>
    ),
  },
  youtube: {
    nombre: 'YouTube',
    icono: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="m10.5 9.500 4.500 2.500-4.500 2.500Z" />
      </>
    ),
  },
  facebook: { nombre: 'Facebook', icono: <path d="M16 3h-2.500A3.500 3.500 0 0 0 10 6.500V21M7 12h8" /> },
}

/** Rótulo de columna: es el <h2> de su bloque (el pie va fuera de <main>, a la altura de sus secciones). */
const ROTULO = 'text-caption font-medium uppercase tracking-[0.3em] text-ocre'
/** Enlace suelto: área táctil de 44 px. */
const ENLACE = 'inline-flex min-h-11 items-center transition-colors duration-300 hover:text-calido'

/**
 * Pie global, el mismo en todas las páginas: el paisaje (que incluye su propio cielo, así que no depende de la sección
 * que tenga encima), marca, «Explora», contacto, redes e idioma. Sus enlaces son reales (<a href>): sin JavaScript
 * bastan para recorrer el sitio. Contacto y redes solo salen si hay datos (content/contacto.ts); el enlace a la
 * política de privacidad, solo con `PRIVACIDAD_EN_PIE` (ver docs/known-issues.md). `contacto` y `conPrivacidad`
 * permiten probarlos.
 */
export function Footer({
  contacto = CONTACTO,
  conPrivacidad = PRIVACIDAD_EN_PIE,
}: {
  contacto?: Contacto
  conPrivacidad?: boolean
}) {
  const { t } = useLang()
  const f = t.common.footer
  const NAV = useNav()
  const pathFor = usePathFor()
  const idiomas = useLangLinks()
  const actual = resolveRoute(useLocation().pathname)?.key

  const { correo, whatsapp } = contacto
  const redes = (Object.keys(REDES) as RedSocial[]).flatMap((red) => {
    const url = contacto.redes?.[red]
    return url ? [{ ...REDES[red], url }] : []
  })

  return (
    <footer className="sobre-huito bg-huito text-calido">
      <FooterPaisaje />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-12 pt-10 md:grid-cols-[3fr_2fr] md:gap-x-12 md:pt-16 lg:grid-cols-[1.7fr_1.37fr_1fr]">
        <div className="md:col-span-2 lg:col-span-1">
          <Logo className="inline-flex min-h-11 items-center text-[1.75rem] md:text-[2rem]" />
          <p className="mt-2 max-w-xs font-serif text-lead-sm font-light italic text-calido/80">{f.tagline}</p>
          <p className="mt-5 flex items-center gap-3 text-ui text-calido/85">
            <Diamond className="size-2 bg-ocre" />
            {t.common.sideNav.place}
          </p>
        </div>

        <nav aria-label={f.navAria}>
          <h2 className={ROTULO}>{f.explore}</h2>
          {/* Desde md se llena por columnas (4 filas): el orden que se ve es el del DOM y el del tabulador. Cada fila mide
              lo que pida su texto más largo y los textos se alinean arriba, aunque uno ocupe dos líneas. */}
          <ul className="mt-3 divide-y divide-calido/15 md:grid md:grid-flow-col md:grid-cols-2 md:grid-rows-[repeat(4,auto)] md:gap-x-6 md:divide-y-0">
            {NAV.map((i) => (
              <li key={i.key}>
                <Link
                  to={i.href}
                  aria-current={i.key === actual ? 'page' : undefined}
                  className="flex min-h-12 items-center py-1 text-body-sm leading-snug text-calido/85 transition-colors duration-300 hover:text-calido md:min-h-11 md:items-start md:py-3 lg:min-h-10 lg:py-2.5"
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          {(correo || whatsapp) && (
            <div>
              <h2 className={ROTULO}>{f.contact}</h2>
              <ul className="mt-2 text-ui text-calido/85">
                {correo && (
                  <li>
                    <a href={`mailto:${correo}`} className={`${ENLACE} break-all`}>
                      {correo}
                    </a>
                  </li>
                )}
                {whatsapp && (
                  <li>
                    <a
                      href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                      rel="noopener noreferrer"
                      className={ENLACE}
                    >
                      WhatsApp {whatsapp}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
          {redes.length > 0 && (
            <div>
              <h2 className={ROTULO}>{f.social}</h2>
              <ul className="mt-4 flex gap-3">
                {redes.map((r) => (
                  <li key={r.nombre}>
                    <a
                      href={r.url}
                      rel="noopener noreferrer"
                      aria-label={r.nombre}
                      className="flex size-11 items-center justify-center border border-calido/40 text-calido transition-colors duration-300 hover:border-calido hover:bg-calido/10"
                    >
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        className="size-5 fill-none stroke-current"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {r.icono}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2 className={ROTULO}>{f.language}</h2>
            {/* Misma lógica que el selector del encabezado. Desde aquí la página destino abre arriba (o en el ancla):
                conservar la posición dejaría el foco, que pasa al <h1>, fuera de la pantalla. */}
            <ul className="mt-2 flex items-center text-ui">
              {idiomas.map((l, i) => (
                <li key={l.lang} className="flex items-center">
                  {i > 0 && (
                    <span aria-hidden className="px-3 text-calido/70">
                      ·
                    </span>
                  )}
                  {l.current ? (
                    <span
                      lang={l.lang}
                      aria-current="true"
                      className="inline-flex min-h-11 items-center font-medium underline underline-offset-[6px]"
                    >
                      {LANG_NAMES[l.lang]}
                    </span>
                  ) : (
                    <Link to={l.href} lang={l.lang} hrefLang={l.lang} className={`${ENLACE} text-calido/85`}>
                      {LANG_NAMES[l.lang]}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-calido/15">
        {/* En móvil, Privacidad va encima del ©; desde md, a la derecha. Sin el enlace, el © queda a la izquierda. */}
        <div className="mx-auto flex max-w-6xl flex-col px-6 py-4 text-ui text-calido/70 md:flex-row md:items-center md:gap-6">
          {conPrivacidad && (
            <Link
              to={pathFor('privacidad')}
              aria-current={actual === 'privacidad' ? 'page' : undefined}
              className={`${ENLACE} self-start underline underline-offset-4 md:order-last md:ml-auto md:self-auto`}
            >
              {t.common.privacy.title}
            </Link>
          )}
          {/* suppressHydrationWarning: el año se calcula al construir y de nuevo en el navegador; difiere cada 1 de enero. */}
          <p suppressHydrationWarning className="flex min-h-11 items-center">
            © {new Date().getFullYear()} ÉCOYAI. {f.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
