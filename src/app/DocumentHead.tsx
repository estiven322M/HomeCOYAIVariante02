import { dict } from '@/content'
import { env } from '@/env'
import { LANGS, langFromPath, pathFor, resolveRoute } from '@/shared/i18n/routes'

/**
 * Metadatos del documento de cada ruta: <title>, descripción, robots, canonical, hreflang y Open Graph.
 * Se renderiza dentro de <head> (React 19 admite <title>/<meta>/<link> nativos) y sale tanto en el HTML
 * prerenderizado como en la navegación del cliente. Los textos vienen de `content` por idioma.
 *
 * canonical, hreflang y og:url usan exactamente la URL que se sirve (con barra final, ver routes.ts).
 */
export function DocumentHead({ pathname }: { pathname: string }) {
  const lang = langFromPath(pathname)
  const route = resolveRoute(pathname)
  const c = dict[lang].meta
  const page = route ? c.pages[route.key] : null
  const title = page?.title ?? c.siteName
  const description = page?.description
  const abs = (path: string) => `${env.SITE_URL}${path}`
  const otherLang = LANGS.find((l) => l !== lang) ?? lang

  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {!env.SITE_INDEXABLE && <meta name="robots" content="noindex, nofollow" />}
      <link rel="icon" href="/favicon.svg" />
      {route && (
        <>
          <link rel="canonical" href={abs(pathFor(route.key, lang))} />
          {LANGS.map((l) => (
            <link key={l} rel="alternate" hrefLang={l} href={abs(pathFor(route.key, l))} />
          ))}
          <link rel="alternate" hrefLang="x-default" href={abs(pathFor(route.key, 'es'))} />
          <meta property="og:url" content={abs(pathFor(route.key, lang))} />
        </>
      )}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={c.siteName} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:locale" content={c.ogLocale} />
      <meta property="og:locale:alternate" content={dict[otherLang].meta.ogLocale} />
    </>
  )
}
