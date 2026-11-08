// Pruebas de extremo a extremo (Playwright + Vitest). Sirven build/client con scripts/preview.mjs, que imita a Netlify
// (404 real, sin fallback SPA). Uso: pnpm run build && pnpm run test:e2e
import { spawn, type ChildProcess } from 'node:child_process'
import { chromium, type Browser, type BrowserContext } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { dict } from '@/content'
import { NOT_FOUND, pathFor } from '@/shared/i18n/routes'

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
const NAV_KEYS = ['nosotros', 'proyectos', 'transparencia', 'colaborar', 'contacto'] as const

describe.each(['es', 'en'] as const)('menú · %s', (lang) => {
  it('recorre las cinco páginas desde el menú, con aria-current y foco en el h1', async () => {
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
        header: document.querySelector('header')?.getBoundingClientRect().height ?? 0,
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
