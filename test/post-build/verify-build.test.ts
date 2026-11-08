// Verificación POSTERIOR AL BUILD: comprueba el HTML estático realmente generado en build/client.
// Se ejecuta con `pnpm run verify:build` (después de `pnpm run build`); no forma parte de `pnpm test`.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { dict } from '@/content'
import { LANGS, NOT_FOUND, ROUTES, pathFor, type RouteKey } from '@/shared/i18n/routes'

const BUILD = join(import.meta.dirname, '..', '..', 'build', 'client')

/** `/` → index.html · `/en/` → en/index.html (la URL que sirve Netlify, con barra final). */
const fileFor = (urlPath: string) => join(BUILD, urlPath, 'index.html')
const parse = (file: string) => new DOMParser().parseFromString(readFileSync(file, 'utf8'), 'text/html')
const read = (urlPath: string) => parse(fileFor(urlPath))

const pages = (Object.keys(ROUTES) as RouteKey[]).flatMap((key) => LANGS.map((lang) => ({ key, lang })))

/** Texto que debe contener el h1 de cada página. */
const h1Of = (key: RouteKey, lang: 'es' | 'en') => {
  const t = dict[lang]
  return {
    home: t.home.hero.title,
    nosotros: t.common.nav[0]?.label,
    proyectos: t.home.proyecto.title,
    transparencia: t.common.nav[2]?.label,
    colaborar: t.home.colaborar.title,
    contacto: t.common.nav[4]?.label,
  }[key]
}

describe('build/client', () => {
  it('existe el build (ejecuta pnpm run build antes)', () => {
    expect(existsSync(BUILD)).toBe(true)
  })

  it('genera una página por ruta e idioma y nunca /es', () => {
    for (const { key, lang } of pages) expect(existsSync(fileFor(pathFor(key, lang))), `${key} ${lang}`).toBe(true)
    expect(existsSync(join(BUILD, 'es'))).toBe(false)
  })

  describe.each(pages)('$key · $lang', ({ key, lang }) => {
    const urlPath = pathFor(key, lang)
    const c = dict[lang]
    const doc = read(urlPath)
    const attr = (selector: string, name: string) => doc.querySelector(selector)?.getAttribute(name)

    it('<html lang> correcto', () => {
      expect(doc.documentElement.getAttribute('lang')).toBe(lang)
    })

    it('título y descripción del idioma (descripción ≤ 160 caracteres)', () => {
      expect(doc.title).toBe(c.meta.pages[key].title)
      const description = attr('meta[name="description"]', 'content') ?? ''
      expect(description).toBe(c.meta.pages[key].description)
      expect(description.length).toBeGreaterThan(0)
      expect(description.length).toBeLessThanOrEqual(160)
    })

    it('un solo h1, el de la página', () => {
      expect(doc.querySelectorAll('h1')).toHaveLength(1)
      expect(doc.querySelector('h1')?.textContent).toContain(h1Of(key, lang))
    })

    it('canonical y hreflang usan exactamente la URL que se sirve', () => {
      expect(attr('link[rel="canonical"]', 'href')).toBe(urlPath)
      for (const l of LANGS) expect(attr(`link[rel="alternate"][hreflang="${l}"]`, 'href')).toBe(pathFor(key, l))
      expect(attr('link[rel="alternate"][hreflang="x-default"]', 'href')).toBe(pathFor(key, 'es'))
      expect(attr('meta[property="og:locale"]', 'content')).toBe(c.meta.ogLocale)
    })

    it('una sola <main id="contenido"> (destino del salto de contenido) y un pie con la navegación', () => {
      expect(doc.querySelectorAll('main')).toHaveLength(1)
      expect(doc.querySelector('main')?.getAttribute('id')).toBe('contenido')
      const footerLinks = [...doc.querySelectorAll('footer nav a')].map((a) => a.getAttribute('href'))
      for (const k of ['nosotros', 'proyectos', 'transparencia', 'colaborar', 'contacto'] as const) {
        expect(footerLinks).toContain(pathFor(k, lang))
      }
    })

    it('el contenido no sale inert ni aria-hidden (usable sin JavaScript)', () => {
      expect(doc.querySelector('main')?.closest('[inert], [aria-hidden="true"]')).toBeNull()
    })

    it('el overlay del intro viene en el HTML y el script de arranque está en <head>', () => {
      expect(doc.querySelector('.intro-root')).not.toBeNull()
      expect(doc.head.querySelector('script:not([src]):not([type])')?.textContent).toContain('data-intro')
    })

    it('no precarga las diapositivas diferidas del carrusel', () => {
      const sliderPreloads = [...doc.head.querySelectorAll('link[rel="preload"][as="image"]')].filter((l) =>
        l.getAttribute('href')?.includes('/slider/'),
      )
      expect(sliderPreloads.length).toBeLessThanOrEqual(1)
      expect(doc.head.querySelectorAll('link[rel="preload"][as="image"]').length).toBeLessThanOrEqual(6)
    })
  })

  describe.each(LANGS)('404 · %s', (lang) => {
    // 404.html y en/404.html (la regla de Netlify /en/* → en/404.html las sirve con estado 404).
    const file = join(BUILD, lang === 'es' ? '404.html' : 'en/404.html')
    const doc = existsSync(file) ? parse(file) : null
    const c = dict[lang]

    it('existe como archivo 404.html y no como carpeta (la URL /404/ no debe responder 200)', () => {
      expect(existsSync(file)).toBe(true)
      expect(existsSync(join(BUILD, NOT_FOUND[lang], 'index.html'))).toBe(false)
    })

    it('tiene idioma, título, h1 y noindex; sin canonical ni hreflang', () => {
      expect(doc?.documentElement.getAttribute('lang')).toBe(lang)
      expect(doc?.title).toBe(c.meta.notFound.title)
      expect(doc?.querySelectorAll('h1')).toHaveLength(1)
      expect(doc?.querySelector('h1')?.textContent).toBe(c.common.notFound.title)
      expect(doc?.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex')
      expect(doc?.querySelector('link[rel="canonical"]')).toBeNull()
      expect(doc?.querySelector('link[hreflang]')).toBeNull()
    })

    it('enlaza a la portada, a las páginas principales y a la versión en el otro idioma', () => {
      const hrefs = [...(doc?.querySelectorAll('main a') ?? [])].map((a) => a.getAttribute('href'))
      const other = lang === 'es' ? 'en' : 'es'
      expect(hrefs).toContain(pathFor('home', lang))
      expect(hrefs).toContain(pathFor('nosotros', lang))
      expect(hrefs).toContain(NOT_FOUND[other])
    })
  })

  it('robots.txt y la meta robots siguen el mismo interruptor', () => {
    const robotsTxt = existsSync(join(BUILD, 'robots.txt')) ? readFileSync(join(BUILD, 'robots.txt'), 'utf8') : ''
    const blocked = robotsTxt.includes('Disallow: /')
    for (const { key, lang } of pages) {
      const hasNoindex = read(pathFor(key, lang)).querySelector('meta[name="robots"]') !== null
      expect(hasNoindex).toBe(blocked)
    }
  })
})
