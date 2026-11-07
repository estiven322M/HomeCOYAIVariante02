// Verificación POSTERIOR AL BUILD: comprueba el HTML estático realmente generado en build/client.
// Se ejecuta con `pnpm run verify:build` (después de `pnpm run build`); no forma parte de `pnpm test`.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { dict } from '@/content'
import { ALL_PATHS, LANGS, ROUTES, pathFor, type RouteKey } from '@/shared/i18n/routes'

const BUILD = join(import.meta.dirname, '..', '..', 'build', 'client')

/** `/` → index.html · `/en/` → en/index.html (la URL que sirve Netlify, con barra final). */
const fileFor = (urlPath: string) => join(BUILD, urlPath, 'index.html')
const read = (urlPath: string) => new DOMParser().parseFromString(readFileSync(fileFor(urlPath), 'utf8'), 'text/html')

const pages = (Object.keys(ROUTES) as RouteKey[]).flatMap((key) => LANGS.map((lang) => ({ key, lang })))

describe('build/client', () => {
  it('existe el build (ejecuta pnpm run build antes)', () => {
    expect(existsSync(BUILD)).toBe(true)
  })

  it('genera exactamente las rutas de la tabla y nunca /es', () => {
    for (const path of ALL_PATHS) expect(existsSync(fileFor(path)), path).toBe(true)
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

    it('título y descripción del idioma', () => {
      expect(doc.title).toBe(c.meta.pages[key].title)
      expect(attr('meta[name="description"]', 'content')).toBe(c.meta.pages[key].description)
    })

    it('h1 del hero', () => {
      expect(doc.querySelectorAll('h1')).toHaveLength(1)
      expect(doc.querySelector('h1')?.textContent).toContain(c.hero.title)
    })

    it('canonical y hreflang usan exactamente la URL que se sirve', () => {
      expect(attr('link[rel="canonical"]', 'href')).toBe(urlPath)
      for (const l of LANGS) expect(attr(`link[rel="alternate"][hreflang="${l}"]`, 'href')).toBe(pathFor(key, l))
      expect(attr('link[rel="alternate"][hreflang="x-default"]', 'href')).toBe(pathFor(key, 'es'))
      expect(attr('meta[property="og:locale"]', 'content')).toBe(c.meta.ogLocale)
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

  it('robots.txt y la meta robots siguen el mismo interruptor', () => {
    const robotsTxt = existsSync(join(BUILD, 'robots.txt')) ? readFileSync(join(BUILD, 'robots.txt'), 'utf8') : ''
    const blocked = robotsTxt.includes('Disallow: /')
    for (const { key, lang } of pages) {
      const hasNoindex = read(pathFor(key, lang)).querySelector('meta[name="robots"]') !== null
      expect(hasNoindex).toBe(blocked)
    }
  })
})
