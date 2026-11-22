// Pruebas de extremo a extremo (Playwright + Vitest). Sirven build/client con scripts/preview.mjs, que imita a Netlify
// (404 real, sin fallback SPA). Uso: pnpm run build && pnpm run test:e2e
import { spawn, type ChildProcess } from 'node:child_process'
import AxeBuilder from '@axe-core/playwright'
import { chromium, type Browser, type BrowserContext } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { dict } from '@/content'
import { LANGS, NAV_KEYS, NOT_FOUND, ROUTES, pathFor, type RouteKey } from '@/shared/i18n/routes'

const PORT = 4199
const BASE = `http://localhost:${PORT}`
const SEEN = 'ecoyai-intro-seen'

let server: ChildProcess
let browser: Browser

async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(BASE)).ok) return
    } catch {
      /* aún no escucha */
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error('El servidor de preview no arrancó (¿ejecutaste pnpm run build?)')
}

beforeAll(async () => {
  server = spawn(process.execPath, ['scripts/preview.mjs'], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  })
  await waitForServer()
  browser = await chromium.launch()
}, 30_000)

afterAll(async () => {
  await browser?.close()
  server?.kill()
})

/** Contexto con el intro ya visto (salvo que se pida lo contrario) para que las pruebas no esperen la animación. */
async function context(opts: { seen?: boolean } = {}): Promise<BrowserContext> {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  if (opts.seen ?? true) await ctx.addInitScript((k) => sessionStorage.setItem(k, '1'), SEEN)
  return ctx
}

const T = { es: dict.es, en: dict.en }

describe.each(['es', 'en'] as const)('menú · %s', (lang) => {
  it('recorre todas las páginas del menú, con aria-current y foco en el h1', async () => {
    const page = await (await context()).newPage()
    await page.goto(BASE + pathFor('home', lang))
    for (const [i, key] of NAV_KEYS.entries()) {
      await page.getByRole('button', { name: T[lang].common.sideNav.menu }).click()
      const link = page.getByRole('navigation', { name: T[lang].common.sideNav.aria }).getByRole('link').nth(i)
      await link.click()
      await page.waitForURL(BASE + pathFor(key, lang))
      // Navegación en cliente: el documento no se recargó, y el foco quedó en el h1 de la nueva página.
      await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('H1')
      expect(await page.evaluate(() => document.documentElement.lang)).toBe(lang)
      await page.getByRole('button', { name: T[lang].common.sideNav.menu }).click()
      expect(
        await page
          .getByRole('navigation', { name: T[lang].common.sideNav.aria })
          .locator('[aria-current="page"]')
          .count(),
      ).toBe(1)
      await page.keyboard.press('Escape')
    }
    await page.context().close()
  }, 60_000)
})

describe('selector de idioma', () => {
  it('lleva a la misma página en el otro idioma y conserva el hash', async () => {
    const page = await (await context()).newPage()
    await page.goto(`${BASE}${pathFor('nosotros', 'es')}#equipo`)
    await page.getByRole('link', { name: T.es.common.switchLabel }).click()
    await page.waitForURL(`${BASE}${pathFor('nosotros', 'en')}#equipo`)
    await expect.poll(() => page.locator('h1').innerText()).toBe(T.en.common.nav[0]?.label)
    await page.getByRole('link', { name: T.en.common.switchLabel }).click()
    await page.waitForURL(`${BASE}${pathFor('nosotros', 'es')}#equipo`)
    await page.context().close()
  })

  it('Atrás y Adelante recorren el historial', async () => {
    const page = await (await context()).newPage()
    await page.goto(BASE + '/')
    await page.locator('footer nav a').first().click()
    await page.waitForURL(BASE + pathFor('nosotros', 'es'))
    await page.goBack()
    await page.waitForURL(BASE + '/')
    await page.goForward()
    await page.waitForURL(BASE + pathFor('nosotros', 'es'))
    await page.context().close()
  })
})

describe('404', () => {
  it.each([
    ['/no-existe/', 'es'],
    ['/nosotros/no-existe/', 'es'],
    [NOT_FOUND.es, 'es'],
    ['/en/no-existe/', 'en'],
    [NOT_FOUND.en, 'en'],
  ] as const)('%s responde 404 con la página «no encontrada» en %s', async (path, lang) => {
    const page = await (await context()).newPage()
    const res = await page.goto(BASE + path)
    expect(res?.status()).toBe(404)
    expect(await page.locator('h1').innerText()).toBe(T[lang].common.notFound.title)
    expect(await page.evaluate(() => document.documentElement.lang)).toBe(lang)
    // Enlaces a la portada y a la versión en el otro idioma.
    expect(await page.locator('main a[href="' + pathFor('home', lang) + '"]').count()).toBe(1)
    await page.context().close()
  })

  it('las páginas que existen responden 200 y /en sin barra redirige a /en/', async () => {
    const ok = await fetch(BASE + pathFor('contacto', 'en'))
    expect(ok.status).toBe(200)
    const redirect = await fetch(BASE + '/en', { redirect: 'manual' })
    expect(redirect.status).toBe(301)
    expect(redirect.headers.get('location')).toBe('/en/')
  })

  it('en la 404, el enlace al otro idioma y el selector ES/EN llevan a la portada del otro idioma', async () => {
    const page = await (await context()).newPage()
    await page.goto(BASE + '/no-existe/')
    await page.getByRole('link', { name: T.es.common.notFound.otherLang }).click()
    await page.waitForURL(BASE + '/en/')
    await page.goto(BASE + '/no-existe/')
    await page.getByRole('link', { name: T.es.common.switchLabel }).click()
    await page.waitForURL(BASE + '/en/')
    await page.goto(BASE + '/en/no-existe/')
    await page.getByRole('link', { name: T.en.common.switchLabel }).click()
    await page.waitForURL(BASE + '/')
    await page.context().close()
  })

  it('desde una 404 se llega a la portada (cliente)', async () => {
    const page = await (await context()).newPage()
    await page.goto(BASE + '/no-existe/')
    await page.locator('main a[href="/"]').click()
    await page.waitForURL(BASE + '/')
    await expect.poll(() => page.locator('h1').innerText()).toContain(T.es.home.hero.title)
    await page.context().close()
  })
})

describe('intro: solo si la sesión empieza en la portada', () => {
  const overlayVisible = (page: import('playwright').Page) =>
    page.evaluate(() => {
      const el = document.querySelector('.intro-root')
      return el ? getComputedStyle(el).display !== 'none' : false
    })

  it('empezar en la portada lo muestra', async () => {
    const page = await (await context({ seen: false })).newPage()
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
    expect(await page.evaluate(() => document.documentElement.dataset.intro)).toBe('active')
    expect(await overlayVisible(page)).toBe(true)
    await page.context().close()
  })

  it('empezar en /nosotros/ no lo muestra, ni al ir luego a la portada', async () => {
    const page = await (await context({ seen: false })).newPage()
    await page.goto(BASE + pathFor('nosotros', 'es'), { waitUntil: 'domcontentloaded' })
    expect(await page.evaluate(() => document.documentElement.dataset.intro)).not.toBe('active')
    expect(await overlayVisible(page)).toBe(false)
    // Ir a la portada: navegación en cliente y también recarga completa (sessionStorage).
    await page.locator('header a[aria-label]').first().click()
    await page.waitForURL(BASE + '/')
    expect(await overlayVisible(page)).toBe(false)
    await page.reload({ waitUntil: 'domcontentloaded' })
    expect(await page.evaluate(() => document.documentElement.dataset.intro)).not.toBe('active')
    expect(await overlayVisible(page)).toBe(false)
    await page.context().close()
  })

  /** Marca en qué instante (performance.now) cada fase de <html data-intro> aparece por primera vez. */
  const trackIntro = (ctx: BrowserContext) =>
    ctx.addInitScript(() => {
      const w = window as unknown as { __t: Record<string, number> }
      w.__t = {}
      const mark = () => {
        const v = document.documentElement.dataset.intro
        if (v && !(v in w.__t)) w.__t[v] = Math.round(performance.now())
      }
      new MutationObserver(mark).observe(document, { attributes: true, subtree: true, attributeFilter: ['data-intro'] })
      document.addEventListener('DOMContentLoaded', mark)
    })
  const phases = (page: import('playwright').Page) =>
    page.evaluate(() => (window as unknown as { __t: Record<string, number> }).__t)

  // El velo no puede pasar de 4 s desde el primer pintado, ni con la red limitada (tolerancia de 150 ms por los
  // temporizadores del navegador). Se fuerza effectiveType «4g» para que la conexión simulada no desactive el intro.
  const LIMIT_MS = 4000 + 150
  const connection4g = (ctx: BrowserContext) =>
    ctx.addInitScript(() =>
      Object.defineProperty(navigator, 'connection', {
        value: { effectiveType: '4g', saveData: false },
        configurable: true,
      }),
    )

  it('con Slow 4G (1,6 Mbps, 150 ms) el velo dura como máximo 4 s desde el primer pintado', async () => {
    const ctx = await context({ seen: false })
    await connection4g(ctx)
    await trackIntro(ctx)
    const page = await ctx.newPage()
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    })
    await page.goto(BASE + '/', { waitUntil: 'commit' })
    await page.waitForFunction(() => (window as unknown as { __t?: Record<string, number> }).__t?.done, null, {
      timeout: 40_000,
    })
    const t = await phases(page)
    expect(t.leaving! - t.active!).toBeLessThanOrEqual(LIMIT_MS)
    expect(await page.evaluate(() => sessionStorage.getItem('ecoyai-intro-seen'))).toBe('1')
    await ctx.close()
  }, 60_000)

  it('si el JavaScript tarda en llegar (React no hidrata), el script de <head> cierra el intro a los 4 s sin parpadeos', async () => {
    const ctx = await context({ seen: false })
    await trackIntro(ctx)
    const page = await ctx.newPage()
    // Los scripts del bundle se retienen 9 s: durante ese tiempo solo trabaja el script de <head>.
    await page.route(/\/assets\/.*\.js$/, async (route) => {
      await new Promise((r) => setTimeout(r, 9000))
      await route.continue()
    })
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => (window as unknown as { __t?: Record<string, number> }).__t?.done, null, {
      timeout: 20_000,
    })
    const t = await phases(page)
    expect(t.leaving! - t.active!).toBeLessThanOrEqual(LIMIT_MS)
    expect(t.done! - t.leaving!).toBeGreaterThanOrEqual(1900) // leaving 0,5 s + reveal 1,5 s
    // Tras hidratar (llegan los scripts retenidos) no vuelve a aparecer: el estado final es «done».
    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset.intro), { timeout: 20_000 })
      .toBe('done')
    await page.waitForTimeout(1500)
    const after = await phases(page)
    expect(Object.keys(after)).toEqual(['active', 'leaving', 'reveal', 'done'])
    expect(await overlayVisible(page)).toBe(false)
    await ctx.close()
  }, 60_000)

  it.each([
    ['ahorro de datos', { saveData: true, effectiveType: '4g' }],
    ['conexión 3g', { saveData: false, effectiveType: '3g' }],
    ['conexión 2g', { saveData: false, effectiveType: '2g' }],
  ])('con %s no hay intro', async (_name, conn) => {
    const ctx = await context({ seen: false })
    await ctx.addInitScript(
      (c) => Object.defineProperty(navigator, 'connection', { value: c, configurable: true }),
      conn,
    )
    const page = await ctx.newPage()
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
    expect(await page.evaluate(() => document.documentElement.dataset.intro)).not.toBe('active')
    expect(await overlayVisible(page)).toBe(false)
    await ctx.close()
  })

  it('empezar en una 404 tampoco lo muestra', async () => {
    const page = await (await context({ seen: false })).newPage()
    await page.goto(BASE + '/no-existe/', { waitUntil: 'domcontentloaded' })
    expect(await overlayVisible(page)).toBe(false)
    await page.context().close()
  })
})

describe('encabezado y anclas', () => {
  it('transparente sobre el hero de la portada y sólido en las demás páginas', async () => {
    const page = await (await context()).newPage()
    await page.goto(BASE + '/')
    const bg = () =>
      page
        .locator('header')
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(await bg()).toMatch(/rgba\(0, 0, 0, 0\)|transparent/)
    await page.goto(BASE + pathFor('contacto', 'es'))
    expect(await bg()).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/)
    await page.context().close()
  })

  it('un enlace con #ancla deja el destino por debajo del encabezado fijo', async () => {
    const page = await (await context()).newPage()
    await page.goto(BASE + '/')
    await page.locator('#origen').scrollIntoViewIfNeeded()
    await page.goto(BASE + pathFor('nosotros', 'es') + '#equipo')
    // El desplazamiento es suave (scroll-behavior) y el diseño se asienta tras cargar: se espera a que el destino
    // quede justo bajo el encabezado fijo (ni tapado por él ni demasiado abajo).
    const measure = () =>
      page.evaluate(() => ({
        top: document.getElementById('equipo')?.getBoundingClientRect().top ?? -1,
        // Encabezado fijo + barra interna de Nosotros (también fija desde md).
        header:
          (document.querySelector('header')?.getBoundingClientRect().height ?? 0) +
          (document.querySelector('main nav')?.getBoundingClientRect().height ?? 0),
      }))
    await expect
      .poll(
        async () => {
          const { top, header } = await measure()
          return top >= header - 1 && top < header + 120
        },
        { timeout: 8000 },
      )
      .toBe(true)
    await page.context().close()
  })

  it('el salto de contenido lleva a <main id="contenido"> en todas las páginas', async () => {
    const page = await (await context()).newPage()
    for (const key of NAV_KEYS) {
      await page.goto(BASE + pathFor(key, 'es'))
      expect(await page.locator('main#contenido').count()).toBe(1)
    }
    await page.context().close()
  })
})

describe('Nosotros', () => {
  const T = dict

  it.each(['es', 'en'] as const)(
    'hero (%s): imagen principal con prioridad, sin lazy y descargada una sola vez',
    async (lang) => {
      const page = await (await context()).newPage()
      const downloads: string[] = []
      page.on('request', (r) => r.url().includes('hero-selva') && downloads.push(r.url()))
      await page.goto(BASE + pathFor('nosotros', lang), { waitUntil: 'networkidle' })
      const img = page.locator('main section img').first()
      expect(await img.getAttribute('fetchpriority')).toBe('high')
      expect(await img.getAttribute('loading')).toBeNull()
      expect(await img.getAttribute('alt')).toBe('')
      expect(await page.locator('head link[rel="preload"][imagesrcset*="hero-selva"]').count()).toBe(1)
      expect(downloads).toHaveLength(1)
      await page.context().close()
    },
  )

  it.each(['es', 'en'] as const)('a 390 px no hay scroll horizontal (%s)', async (lang) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    await ctx.addInitScript((k) => sessionStorage.setItem(k, '1'), SEEN)
    const page = await ctx.newPage()
    await page.goto(BASE + pathFor('nosotros', lang), { waitUntil: 'networkidle' })
    const { scroll, inner } = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      inner: window.innerWidth,
    }))
    expect(scroll).toBeLessThanOrEqual(inner)
    await ctx.close()
  })

  it('la barra interna marca la sección actual con aria-current al desplazarse', async () => {
    const page = await (await context()).newPage()
    await page.goto(BASE + pathFor('nosotros', 'es'))
    const nav = page.getByRole('navigation', { name: T.es.nosotros.navAria })
    expect(await nav.locator('[aria-current]').count()).toBe(0)
    await nav.getByRole('link', { name: T.es.nosotros.mision.label }).click()
    await expect
      .poll(() => nav.locator('[aria-current="location"]').innerText(), { timeout: 8000 })
      .toContain(T.es.nosotros.mision.label)
    expect(await nav.locator('[aria-current]').count()).toBe(1)
    await page.context().close()
  })

  it('en móvil la barra interna se desliza y el velo del borde derecho se apaga al llegar al final', async () => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    await ctx.addInitScript((k) => sessionStorage.setItem(k, '1'), SEEN)
    const page = await ctx.newPage()
    await page.goto(BASE + pathFor('nosotros', 'es'), { waitUntil: 'networkidle' })
    const nav = page.getByRole('navigation', { name: T.es.nosotros.navAria })
    const veil = nav.locator('span[aria-hidden]')
    const scrollable = await nav.locator('ul').evaluate((ul) => ul.scrollWidth > ul.clientWidth)
    expect(scrollable).toBe(true)
    await expect.poll(() => veil.evaluate((v) => getComputedStyle(v).opacity)).toBe('1')
    expect(await veil.evaluate((v) => getComputedStyle(v).pointerEvents)).toBe('none')
    await nav.locator('ul').evaluate((ul) => ul.scrollTo({ left: ul.scrollWidth }))
    await expect.poll(() => veil.evaluate((v) => getComputedStyle(v).opacity)).toBe('0')
    // No es fija en móvil: queda en el flujo.
    expect(await nav.evaluate((n) => getComputedStyle(n).position)).toBe('relative')
    await ctx.close()
  })
})

// Patrón lateral (shared/ui/PatternZone): solo en zonas claras, desde 1280 px, sin tapar nada.
describe('patrón lateral', () => {
  /** Páginas con al menos una zona clara (la 404 es toda oscura y no lleva patrón). */
  const WITH_PATTERN: RouteKey[] = [
    'home',
    'nosotros',
    'proyectos',
    'salud',
    'eventos',
    'galeria',
    'colaborar',
    'contacto',
  ]
  const PAGES = [
    ...WITH_PATTERN.flatMap((key) =>
      LANGS.map((lang) => ({ name: `${key} ${lang}`, path: pathFor(key, lang), has: true })),
    ),
    ...LANGS.map((lang) => ({
      name: `404 ${lang}`,
      path: lang === 'es' ? '/no-existe/' : '/en/no-existe/',
      has: false,
    })),
  ]

  it('no aparece por debajo de 1280 px', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1279, height: 800 } })
    await ctx.addInitScript((k) => sessionStorage.setItem(k, '1'), SEEN)
    const page = await ctx.newPage()
    for (const { path } of PAGES) {
      await page.goto(BASE + path)
      const shown = await page
        .locator('.patron-lateral')
        .evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().width > 0).length)
      expect(shown, path).toBe(0)
    }
    await ctx.close()
  })

  it.each([1280, 1440, 1920])(
    'a %i px va solo sobre fondos claros, cubre cada zona entera y no tapa contenido, foco ni la barra fija',
    async (width) => {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
      await ctx.addInitScript((k) => sessionStorage.setItem(k, '1'), SEEN)
      const page = await ctx.newPage()
      const problems: string[] = []
      for (const { name, path, has } of PAGES) {
        await page.goto(BASE + path, { waitUntil: 'networkidle' })
        const r = await page.evaluate(() => {
          const lum = (c: number[]) => {
            const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
            return 0.2126 * f(c[0] ?? 0) + 0.7152 * f(c[1] ?? 0) + 0.0722 * f(c[2] ?? 0)
          }
          // Chrome devuelve algunos fondos con alfa como oklab(…): se pasan a RGBA por un canvas de 1×1.
          const canvas = document.createElement('canvas')
          canvas.width = canvas.height = 1
          const g = canvas.getContext('2d', { willReadFrequently: true })
          const rgba = (el: Element): number[] => {
            if (!g) return [0, 0, 0, 0]
            g.clearRect(0, 0, 1, 1)
            g.fillStyle = getComputedStyle(el).backgroundColor
            g.fillRect(0, 0, 1, 1)
            const d = g.getImageData(0, 0, 1, 1).data
            return [d[0] ?? 0, d[1] ?? 0, d[2] ?? 0, (d[3] ?? 0) / 255]
          }
          /** Primer fondo con opacidad suficiente subiendo por los ancestros (el del <body> si no hay otro). */
          const bgOf = (el: Element | null): number[] => {
            for (let e = el; e; e = e.parentElement) {
              const c = rgba(e)
              if ((c[3] ?? 1) >= 0.5) return c
            }
            return [255, 255, 255]
          }
          const strips = [...document.querySelectorAll('.patron-lateral')]
            .map((e) => ({ el: e, box: e.getBoundingClientRect() }))
            .filter((s) => s.box.width > 0)
          const out = {
            strips: strips.length,
            dark: [] as string[],
            short: [] as string[],
            covered: [] as string[],
            navCovered: false,
          }
          for (const { el, box } of strips) {
            const zone = el.parentElement?.parentElement as HTMLElement
            const zb = zone.getBoundingClientRect()
            // Cubre la zona entera (sin fundido): misma altura que su contenedor.
            if (Math.abs(box.height - zb.height) > 1 || Math.abs(box.top - zb.top) > 1)
              out.short.push(zone.className.slice(0, 40))
            // Fondo claro: el de la zona o, si no tiene, el de cada hijo directo (secciones consecutivas con fondos distintos).
            const own = rgba(zone)
            const bgs =
              (own[3] ?? 1) >= 0.3
                ? [own]
                : [...zone.children].filter((c) => !c.hasAttribute('aria-hidden')).map((c) => bgOf(c))
            for (const bg of bgs) if (lum(bg) < 0.6) out.dark.push(zone.className.slice(0, 40) + ' ' + bg.join(','))
          }
          const strip = (r: DOMRect) =>
            strips.some(
              (s) =>
                r.left < s.box.right + 6 &&
                r.right > s.box.left - 6 &&
                r.top < s.box.bottom + 6 &&
                r.bottom > s.box.top - 6,
            )
          for (const el of document.querySelectorAll(
            'main a[href], main button, main input, main [tabindex]:not([tabindex="-1"]), footer a[href]',
          )) {
            const r = el.getBoundingClientRect()
            if (r.width > 0 && strip(r)) out.covered.push((el.textContent ?? '').trim().slice(0, 30) || el.tagName)
          }
          return out
        })
        if (r.dark.length) problems.push(`${name}: sobre fondo oscuro ${r.dark.join(' | ')}`)
        if (r.short.length) problems.push(`${name}: no cubre la zona entera ${r.short.join(' | ')}`)
        if (r.covered.length) problems.push(`${name}: tapa ${r.covered.join(', ')}`)
        if (has !== r.strips > 0) problems.push(`${name}: franjas ${r.strips} (esperadas: ${has})`)
      }
      // Barra interna fija de Nosotros: con una zona clara pasando por debajo, el patrón no la tapa.
      await page.goto(BASE + pathFor('nosotros', 'es'), { waitUntil: 'networkidle' })
      await page.evaluate(() => document.getElementById('valores')?.scrollIntoView())
      await page.waitForTimeout(400)
      const navOnTop = await page.evaluate(() => {
        const nav = document.querySelector('main nav')?.getBoundingClientRect()
        if (!nav) return false
        const y = nav.top + nav.height / 2
        return [10, 20, 30, window.innerWidth - 20].every(
          (x) => document.elementFromPoint(x, y)?.closest('nav') !== null,
        )
      })
      if (!navOnTop) problems.push('la barra interna queda bajo el patrón')
      await ctx.close()
      expect(problems).toEqual([])
    },
    180_000,
  )
})

// Accesibilidad automática (axe-core): todas las páginas en es y en, a 1280 y 390 px, con el intro ya visto y movimiento
// reducido (las animaciones de aparición no dejan texto a medias). Reglas WCAG 2.0/2.1 A y AA, incluido el contraste.
//
// La lista KNOWN recoge infracciones que YA existían en otras páginas, el encabezado y el pie y que no se corrigen en la
// Fase 3 (están en docs/known-issues.md, «Accesibilidad detectada por axe»). Cualquier otra infracción hace fallar la
// prueba, y Nosotros no tiene ninguna propia. Al corregir una, quítala de aquí.
type Known = { rule: string; page?: RouteKey | 'notFound'; html?: RegExp }
const KNOWN: Known[] = [
  { rule: 'label-content-name-mismatch', html: /hreflang=/ }, // selector de idioma del encabezado (aria-label sin el texto visible)
  { rule: 'color-contrast', html: /©/ }, // texto de derechos del pie (3,9:1)
  { rule: 'color-contrast', page: 'home', html: /text-carbon\/60|text-\[11px\]/ }, // eyebrow y descripciones de «Explora»
  { rule: 'list', page: 'home' }, // la lista de «Explora» contiene <div> (Reveal) entre <ul> y <li>
  { rule: 'listitem', page: 'home' },
]

const AXE_PAGES = [
  ...(Object.keys(ROUTES) as RouteKey[]).flatMap((key) =>
    LANGS.map((lang) => ({ key: key as RouteKey | 'notFound', lang, path: pathFor(key, lang) })),
  ),
  ...LANGS.map((lang) => ({ key: 'notFound' as const, lang, path: lang === 'es' ? '/no-existe/' : '/en/no-existe/' })),
]

describe('accesibilidad (axe, WCAG A/AA)', () => {
  it.each([1280, 390])(
    'ninguna página tiene infracciones nuevas a %i px',
    async (width) => {
      const ctx = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: 'reduce' })
      await ctx.addInitScript((k) => sessionStorage.setItem(k, '1'), SEEN)
      const failures: string[] = []
      for (const { key, lang, path } of AXE_PAGES) {
        const page = await ctx.newPage()
        await page.goto(BASE + path, { waitUntil: 'networkidle' })
        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze()
        for (const v of violations)
          for (const node of v.nodes) {
            const known = KNOWN.some(
              (k) => k.rule === v.id && (!k.page || k.page === key) && (!k.html || k.html.test(node.html)),
            )
            if (!known) failures.push(`${lang} ${path} · ${v.id}: ${node.target.join(' ')}`)
          }
        await page.close()
      }
      await ctx.close()
      expect(failures).toEqual([])
    },
    180_000,
  )
})
