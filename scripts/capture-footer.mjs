// Capturas y medidas del pie para revisarlo. Usa el build que haya en build/client y no es una suite de pruebas.
// Uso: node scripts/capture-footer.mjs --label sin-datos
// Para verlo con contacto y redes (datos ficticios, solo en local), construir antes con FOOTER_DEMO=1 o =parcial.
// Guarda .baseline/footer/3-contacto/<label>-<es|en>-<ancho>.png (carpeta ignorada por git).
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { chromium } from 'playwright'

const label = process.argv[process.argv.indexOf('--label') + 1]
if (!process.argv.includes('--label') || !label) throw new Error('Falta --label (p. ej. sin-datos)')

const OUT = '.baseline/footer/3-contacto'
const PORT = 4177
const BASE = `http://localhost:${PORT}`
const PAGES = { es: '/eventos/', en: '/en/events/' }
mkdirSync(OUT, { recursive: true })

const server = spawn(process.execPath, ['scripts/preview.mjs'], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: 'ignore',
})
try {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(BASE)).ok) break
    } catch {
      /* aún no escucha */
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  const browser = await chromium.launch()
  for (const [lang, path] of Object.entries(PAGES)) {
    for (const width of [320, 390, 768, 1024, 1440]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
      await ctx.addInitScript(() => sessionStorage.setItem('ecoyai-intro-seen', '1'))
      const page = await ctx.newPage()
      await page.goto(BASE + path, { waitUntil: 'networkidle' })
      await page.addStyleTag({ content: 'header{display:none!important}' })
      await page.evaluate(() => document.fonts.ready)
      const footer = page.locator('footer')
      await footer.screenshot({ path: `${OUT}/${label}-${lang}-${width}.png` })
      const medidas = await footer.evaluate((f) => {
        const links = [...f.querySelectorAll('a')]
        const minimo = innerWidth < 1024 ? 44 : 40
        return {
          alto: Math.round(f.getBoundingClientRect().height),
          desborde: document.documentElement.scrollWidth - innerWidth,
          pequenos: links
            .map((a) => ({ a, r: a.getBoundingClientRect() }))
            .filter(({ r }) => r.height < minimo || r.width < 44)
            .map(({ a, r }) => `${a.textContent || a.ariaLabel} ${Math.round(r.width)}x${Math.round(r.height)}`),
          // Un enlace de texto partido en dos líneas o más ancho que su columna.
          partidos: [...f.querySelectorAll('a[href^="mailto:"], a[href^="https://wa.me"]')]
            .filter((a) => a.getBoundingClientRect().height > 46)
            .map((a) => a.textContent),
          rotulos: [...f.querySelectorAll('h2')].map((h) => h.textContent).join(' / '),
        }
      })
      const { violations } = await new AxeBuilder({ page })
        .include('footer')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
      console.log(label, lang, width, JSON.stringify({ ...medidas, axe: violations.map((v) => v.id) }))
      await ctx.close()
    }
  }
  await browser.close()
} finally {
  server.kill()
}
