// Extremo a extremo del pie global, en todas las páginas y anchos. Sirve build/client con scripts/preview.mjs.
// El contraste y el resto de reglas WCAG del pie los cubre la prueba de axe de site.e2e.test.ts (todas las páginas).
// Uso: pnpm run build && pnpm run test:e2e
import { spawn, type ChildProcess } from 'node:child_process'
import { chromium, type Browser, type Page } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { dict } from '@/content'
import { LANGS, NAV_KEYS, PRIVACIDAD_EN_PIE, ROUTES, pathFor, type RouteKey } from '@/shared/i18n/routes'

const PORT = 4198
const BASE = `http://localhost:${PORT}`
const ANCHOS = [320, 390, 768, 1024, 1440, 1920]
/** Tokens de color tal como los calcula el navegador. */
const OCRE = 'rgb(217, 162, 27)'
const TIERRA_SUAVE = 'rgb(216, 200, 172)'

const paginas = (lang: 'es' | 'en') => [
  ...(Object.keys(ROUTES) as RouteKey[]).map((key) => pathFor(key, lang)),
  lang === 'es' ? '/no-existe/' : '/en/no-existe/',
]

let server: ChildProcess
let browser: Browser

beforeAll(async () => {
  server = spawn(process.execPath, ['scripts/preview.mjs'], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  })
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(BASE)).ok) break
    } catch {
      /* aún no escucha */
    }
    if (i === 50) throw new Error('El servidor de preview no arrancó (¿ejecutaste pnpm run build?)')
    await new Promise((r) => setTimeout(r, 200))
  }
  browser = await chromium.launch()
}, 30_000)

afterAll(async () => {
  await browser?.close()
  server?.kill()
})

/** Contexto con el intro ya visto y movimiento reducido (nada a medio animar al medir). */
async function abrir(width = 1280, javaScriptEnabled = true) {
  const ctx = await browser.newContext({
    viewport: { width, height: 800 },
    reducedMotion: 'reduce',
    javaScriptEnabled,
  })
  if (javaScriptEnabled) await ctx.addInitScript(() => sessionStorage.setItem('ecoyai-intro-seen', '1'))
  return ctx.newPage()
}

/** Medidas del pie en el ancho actual. */
const medir = (page: Page) =>
  page.evaluate(() => {
    const ancho = document.documentElement.clientWidth
    const footer = document.querySelector('footer')!
    const paisaje = footer.firstElementChild!
    const caja = (el: Element) => el.getBoundingClientRect()
    const visible = (el: Element) => getComputedStyle(el).display !== 'none'
    const figuras = [...paisaje.querySelectorAll('svg[viewBox]')].filter(visible)
    const anchoDe = (viewBox: string) => Math.round(caja(paisaje.querySelector(`svg[viewBox="${viewBox}"]`)!).width)
    // Primera línea de cada enlace de «Explora»: desde md las dos columnas van a la par.
    const lineas = [...footer.querySelectorAll('nav a')].map((a) => {
      const rango = document.createRange()
      rango.selectNodeContents(a)
      return Math.round(rango.getClientRects()[0]!.top)
    })
    const minimo = ancho < 1024 ? 44 : 40
    return {
      // Del pie, no de la página: lo que mida de más su contenido (el paisaje recorta lo suyo con overflow-hidden).
      desborde: footer.scrollWidth - footer.clientWidth,
      altoPaisaje: Math.round(caja(paisaje).height),
      figurasFuera: figuras
        .filter((f) => caja(f).left < -0.5 || caja(f).right > ancho + 0.5)
        .map((f) => f.getAttribute('viewBox')),
      sol: anchoDe('0 0 68 68'),
      ceiba: anchoDe('0 -8 220 172'),
      maloca: anchoDe('0 -8 170 124'),
      // Las tres capas del dosel llegan de borde a borde.
      doselCorto: [...paisaje.querySelectorAll('rect')].filter((r) => caja(r).left > 0.5 || caja(r).right < ancho - 0.5)
        .length,
      areasPequenas: [...footer.querySelectorAll('a')]
        .filter((a) => caja(a).height < minimo - 0.5 || caja(a).width < 43.5)
        .map((a) => `${a.textContent} ${Math.round(caja(a).width)}x${Math.round(caja(a).height)}`),
      desfaseColumnas: ancho < 768 ? [] : [0, 1, 2].map((i) => lineas[i + 4]! - lineas[i]!),
    }
  })

describe.each(LANGS)('pie en todas las páginas · %s', (lang) => {
  const t = dict[lang].common

  it('es uno solo e idéntico en todas, pegado al contenido y con su propio cielo', async () => {
    const page = await abrir()
    const pies = new Map<string, string>()
    for (const path of paginas(lang)) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' })
      expect(await page.getByRole('contentinfo').count(), path).toBe(1)
      const pie = await page.evaluate(() => {
        const footer = document.querySelector('footer')!
        const paisaje = footer.firstElementChild!
        return {
          hueco: footer.getBoundingClientRect().top - document.querySelector('main')!.getBoundingClientRect().bottom,
          oculto: paisaje.getAttribute('aria-hidden'),
          cielo: getComputedStyle(paisaje).backgroundColor,
          texto: footer.innerText,
          alto: Math.round(footer.getBoundingClientRect().height),
          rotulos: [...footer.querySelectorAll('h2')].map((h) => h.textContent),
          nav: [...footer.querySelectorAll('nav a')].map((a) => a.getAttribute('href')),
          hrefs: [...footer.querySelectorAll('a')].map((a) => a.getAttribute('href')),
        }
      })
      expect(Math.abs(pie.hueco), path).toBeLessThan(1)
      expect(pie.oculto, path).toBe('true')
      expect(pie.cielo, path).toBe(TIERRA_SUAVE)
      expect(pie.nav, path).toEqual(NAV_KEYS.map((key) => pathFor(key, lang)))
      expect(pie.hrefs.includes(pathFor('privacidad', lang)), path).toBe(PRIVACIDAD_EN_PIE)
      expect(pie.rotulos, path).toEqual(expect.arrayContaining([t.footer.explore, t.footer.language]))
      pies.set(path, JSON.stringify([pie.texto, pie.alto, pie.rotulos]))
    }
    const [primero] = pies.values()
    for (const [path, pie] of pies) expect(pie, path).toBe(primero)
    await page.context().close()
  }, 90_000)

  it(`a ${ANCHOS.join(', ')} px: alto reservado, nada desborda ni se deforma y las áreas táctiles bastan`, async () => {
    const page = await abrir()
    const problemas: string[] = []
    for (const path of paginas(lang)) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)
      for (const width of ANCHOS) {
        await page.setViewportSize({ width, height: 800 })
        const m = await medir(page)
        const movil = width < 768
        const esperado = {
          desborde: 0,
          altoPaisaje: movil ? 120 : 200,
          figurasFuera: [],
          // El sol y las figuras no crecen con la pantalla: solo hay dos tamaños.
          sol: movil ? 34 : 68,
          ceiba: movil ? 108 : 220,
          maloca: movil ? 102 : 170,
          doselCorto: 0,
          areasPequenas: [],
          desfaseColumnas: movil ? [] : [0, 0, 0],
        }
        if (JSON.stringify(m) !== JSON.stringify(esperado)) problemas.push(`${path} @${width}: ${JSON.stringify(m)}`)
      }
    }
    expect(problemas).toEqual([])
    await page.context().close()
  }, 120_000)
})

describe('pie: teclado', () => {
  it.each([390, 1280])(
    'a %i px el tabulador recorre sus enlaces en orden, todos con foco ocre visible',
    async (width) => {
      const page = await abrir(width)
      await page.goto(BASE + pathFor('eventos', 'es'), { waitUntil: 'networkidle' })
      const enlaces = page.locator('footer a')
      const total = await enlaces.count()
      expect(total).toBe(NAV_KEYS.length + 2) // logotipo, «Explora» y el otro idioma
      // Tras una pulsación de teclado, el foco puesto por código cuenta como foco de teclado (:focus-visible).
      await page.keyboard.press('Tab')
      await enlaces.first().focus()
      for (let i = 0; i < total; i++) {
        if (i > 0) await page.keyboard.press('Tab')
        // El color del contorno entra con la transición de color del enlace: se espera a que termine.
        const foco = () =>
          page.evaluate(() => {
            const el = document.activeElement as HTMLElement
            const estilo = getComputedStyle(el)
            const r = el.getBoundingClientRect()
            return {
              indice: [...document.querySelectorAll('footer a')].indexOf(el),
              contorno: `${estilo.outlineStyle} ${estilo.outlineWidth} ${estilo.outlineColor}`,
              enPantalla: r.top > -1 && r.bottom < window.innerHeight + 1,
            }
          })
        await expect.poll(foco).toEqual({ indice: i, contorno: `solid 2px ${OCRE}`, enPantalla: true })
      }
      await page.context().close()
    },
  )
})

describe('pie: idioma', () => {
  it('navega sin recargar, abre arriba y deja el foco en el título', async () => {
    const page = await abrir()
    await page.goto(BASE + pathFor('eventos', 'es'), { waitUntil: 'networkidle' })
    await page.evaluate(() => Object.assign(window, { sinRecargar: true }))
    await page.getByRole('contentinfo').getByRole('link', { name: 'English' }).click()
    await page.waitForURL(BASE + pathFor('eventos', 'en'))
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('H1')
    expect(await page.evaluate(() => 'sinRecargar' in window)).toBe(true)
    expect(await page.getByRole('contentinfo').locator('[aria-current="true"]').innerText()).toBe('English')
    await page.context().close()
  })

  it('conserva el ancla y abre en ella', async () => {
    const page = await abrir()
    await page.goto(`${BASE}${pathFor('nosotros', 'es')}#equipo`, { waitUntil: 'networkidle' })
    await page.getByRole('contentinfo').getByRole('link', { name: 'English' }).click()
    await page.waitForURL(`${BASE}${pathFor('nosotros', 'en')}#equipo`)
    await expect
      .poll(() => page.evaluate(() => Math.abs(document.getElementById('equipo')!.getBoundingClientRect().top) < 200))
      .toBe(true)
    await page.context().close()
  })
})

describe('pie sin JavaScript', () => {
  it.each([
    [390, 120],
    [1280, 200],
  ])('a %i px está completo, con el paisaje dibujado, y sus enlaces funcionan', async (width, alto) => {
    const page = await abrir(width, false)
    await page.goto(BASE + pathFor('eventos', 'es'))
    const footer = page.getByRole('contentinfo')
    await expect.poll(() => footer.isVisible()).toBe(true)
    const m = await medir(page)
    expect([m.altoPaisaje, m.desborde, m.doselCorto, m.figurasFuera]).toEqual([alto, 0, 0, []])
    for (const item of dict.es.common.nav)
      expect(await footer.getByRole('link', { name: item.label, exact: true }).isVisible()).toBe(true)
    await footer.getByRole('link', { name: 'English' }).click()
    await page.waitForURL(BASE + pathFor('eventos', 'en'))
    await page.getByRole('contentinfo').getByRole('link', { name: dict.en.common.nav[0]!.label, exact: true }).click()
    await page.waitForURL(BASE + pathFor('nosotros', 'en'))
    await page.context().close()
  })
})
