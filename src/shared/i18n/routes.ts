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
 * Un slug por idioma.
 */
export const ROUTES = {
  home: { es: '/', en: '/en/' },
  nosotros: { es: '/nosotros/', en: '/en/about/' },
  proyectos: { es: '/proyectos/', en: '/en/projects/' },
  transparencia: { es: '/transparencia/', en: '/en/transparency/' },
  colaborar: { es: '/colaborar/', en: '/en/collaborate/' },
  contacto: { es: '/contacto/', en: '/en/contact/' },
} as const satisfies Record<string, Record<Lang, string>>

export type RouteKey = keyof typeof ROUTES

/**
 * Páginas del menú, del bloque «Explora» y del pie, en este orden. Coincide por posición con `common.nav` (textos);
 * un test lo comprueba. «Colaborar» cubre «Donaciones / Alianzas».
 */
export const NAV_KEYS = [
  'nosotros',
  'proyectos',
  'transparencia',
  'colaborar',
  'contacto',
] as const satisfies readonly RouteKey[]

/**
 * Página 404. No está en `ROUTES` (no es una página del sitio: no lleva canonical ni hreflang y es noindex).
 * Se prerenderiza en estas URL y el build la copia a `404.html` / `en/404.html`, que Netlify sirve con estado 404.
 * La ruta comodín `*` de app/routes.ts la muestra también para cualquier URL desconocida.
 */
export const NOT_FOUND = { es: '/404/', en: '/en/404/' } as const satisfies Record<Lang, string>

/** Todas las rutas registradas, para el prerender. */
export const ALL_PATHS: string[] = [
  ...Object.values(ROUTES).flatMap((p) => LANGS.map((l) => p[l])),
  ...LANGS.map((l) => NOT_FOUND[l]),
]

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

/** La portada (en cualquier idioma). Decide el intro y el estilo del encabezado. */
export function isHomePath(pathname: string): boolean {
  return resolveRoute(pathname)?.key === 'home'
}

/**
 * URL de la misma página en otro idioma, conservando el hash. Si la URL actual no es una ruta del sitio (404),
 * la portada del otro idioma (sin hash): la 404 del otro idioma no le sirve a nadie.
 */
export function alternatePath(pathname: string, lang: Lang, hash = ''): string {
  const route = resolveRoute(pathname)
  return route ? pathFor(route.key, lang) + hash : pathFor('home', lang)
}
