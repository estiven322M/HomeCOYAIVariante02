// Tabla de rutas: UNA sola fuente de verdad para las URLs de cada página en cada idioma.
// La usan el registro de rutas (app/routes.ts), el prerender (react-router.config.ts), el selector de idioma y
// la cabecera del documento (canonical y hreflang). Sin dependencias de runtime: la carga también Node al construir.
import type { Lang } from '@/content'

export const LANGS = ['es', 'en'] as const satisfies readonly Lang[]
export const DEFAULT_LANG: Lang = 'es'

/** Prefijo del idioma que NO es el predeterminado. El español no lleva prefijo; nunca se sirve `/es`. */
export const EN_PREFIX = '/en/'

/**
 * Política de URLs: TODAS terminan en barra final (`/en/`, `/nosotros/`). Es la URL que se sirve
 * (`ruta/index.html` en Netlify) y la que usan canonical, hreflang y los enlaces internos.
 * Un slug por idioma. Hoy solo se registra `home`; la Fase 2B añade las demás.
 */
export const ROUTES = {
  home: { es: '/', en: '/en/' },
} as const satisfies Record<string, Record<Lang, string>>

export type RouteKey = keyof typeof ROUTES

/** Todas las rutas registradas, para el prerender. */
export const ALL_PATHS: string[] = Object.values(ROUTES).flatMap((p) => LANGS.map((l) => p[l]))

const withSlash = (pathname: string) => (pathname.endsWith('/') ? pathname : `${pathname}/`)

/** El idioma sale SOLO de la URL. */
export function langFromPath(pathname: string): Lang {
  return withSlash(pathname).startsWith(EN_PREFIX) ? 'en' : DEFAULT_LANG
}

export function pathFor(key: RouteKey, lang: Lang): string {
  return ROUTES[key][lang]
}

/** Qué página es (y en qué idioma). `null` si la URL no corresponde a ninguna ruta registrada. */
export function resolveRoute(pathname: string): { key: RouteKey; lang: Lang } | null {
  const path = withSlash(pathname)
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    for (const lang of LANGS) {
      if (ROUTES[key][lang] === path) return { key, lang }
    }
  }
  return null
}

/** URL de la misma página en otro idioma; si la URL actual no es una ruta conocida, la portada de ese idioma. */
export function alternatePath(pathname: string, lang: Lang): string {
  const route = resolveRoute(pathname)
  return pathFor(route?.key ?? 'home', lang)
}
