import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { dict, type Content, type Lang } from '@/content'
import { alternatePath, langFromPath, LANGS, NAV_KEYS, pathFor, type RouteKey } from './routes'

export type { Lang }

type Ctx = { lang: Lang; t: Content }
const LangContext = createContext<Ctx | null>(null)

/** El idioma llega como dato (sale de la URL). Sin estado, sin localStorage, sin navigator. */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo<Ctx>(() => ({ lang, t: dict[lang] }), [lang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

/** Provee el idioma según la ruta actual (`/en/…` → inglés; el resto, español). */
export function LangFromUrl({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return <LangProvider lang={langFromPath(pathname)}>{children}</LangProvider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}

/** URL de una página en el idioma actual (siempre sale de la tabla de rutas). */
export function usePathFor() {
  const { lang } = useLang()
  return (key: RouteKey) => pathFor(key, lang)
}

/** Páginas del menú, de «Explora» y del pie: clave, URL en el idioma actual y textos. */
export function useNav() {
  const { lang, t } = useLang()
  return NAV_KEYS.map((key, i) => ({ key, href: pathFor(key, lang), ...t.common.nav[i] }))
}

/** Nombre de cada idioma en su propio idioma: no se traduce. */
export const LANG_NAMES: Record<Lang, string> = { es: 'Español', en: 'English' }

/**
 * La página actual en cada idioma, conservando el #ancla, y cuál es el activo. Es la lógica de todo selector de
 * idioma (encabezado y pie). En la 404 el destino es la portada de cada idioma (ver `alternatePath`).
 */
export function useLangLinks() {
  const { lang } = useLang()
  const { pathname, hash } = useLocation()
  return LANGS.map((code) => ({ lang: code, current: code === lang, href: alternatePath(pathname, code, hash) }))
}

/**
 * Selector de idioma del encabezado: un enlace (<a>) a la misma página en el otro idioma. Visualmente sigue siendo el interruptor
 * ES | EN (la ficha se desliza al navegar porque el componente no se remonta). `preventScrollReset` conserva el
 * punto de lectura, como hacía el botón anterior.
 */
export function LangSwitch({ className = 'relative inline-flex' }: { className?: string }) {
  const { lang, t } = useLang()
  const other = useLangLinks().find((l) => !l.current)!
  const isEn = lang === 'en'
  return (
    <Link
      to={other.href}
      lang={other.lang}
      hrefLang={other.lang}
      preventScrollReset
      aria-label={t.common.switchLabel}
      className={`h-8 w-[4.5rem] shrink-0 items-center rounded-full border border-calido/40 bg-selva/50 text-[11px] font-medium tracking-[0.15em] backdrop-blur-[6px] transition-colors duration-500 hover:border-calido ${className}`}
    >
      <span
        aria-hidden
        className={`absolute left-0.5 top-0.5 h-6 w-8 rounded-full bg-(color:--ambar) transition-transform duration-500 ${isEn ? 'translate-x-[2.25rem]' : ''}`}
      />
      <span
        aria-hidden
        className={`relative z-10 w-1/2 text-center transition-colors duration-500 ${isEn ? 'text-(color:--niebla)' : 'text-(color:--color-noche)'}`}
      >
        ES
      </span>
      <span
        aria-hidden
        className={`relative z-10 w-1/2 text-center transition-colors duration-500 ${isEn ? 'text-(color:--color-noche)' : 'text-(color:--niebla)'}`}
      >
        EN
      </span>
    </Link>
  )
}
