// Captura de página completa para comparar visualmente dos builds (no es una suite de pruebas).
// Uso: node scripts/capture.mjs --label base --es http://localhost:4173/ --en http://localhost:4173/
// Guarda .baseline/<label>/{es,en}-{1440,390}.png (carpeta ignorada por git).
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
)
const { label = 'base', es, en } = args
if (!es || !en) throw new Error('Faltan --es y --en (URLs de la página en cada idioma)')

const out = `.baseline/${label}`
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
for (const [lang, url] of [
  ['es', es],
  ['en', en],
]) {
  for (const width of [1440, 390]) {
    const ctx = await browser.newContext({
      viewport: { width, height: width === 1440 ? 900 : 844 },
      reducedMotion: 'reduce', // carrusel quieto y sin intro: captura determinista
      deviceScaleFactor: 1,
    })
    // Intro ya visto e idioma de la versión anterior (la nueva lo toma de la URL e ignora esto).
    await ctx.addInitScript((l) => {
      try {
        sessionStorage.setItem('ecoyai-intro-seen', '1')
        localStorage.setItem('ecoyai-lang', l)
      } catch {
        /* storage no disponible */
      }
    }, lang)
    const page = await ctx.newPage()
    await page.goto(url, { waitUntil: 'networkidle' })
    // Estado final de las animaciones de aparición y video detenido en el primer fotograma.
    await page.addStyleTag({
      content: `.reveal{opacity:1!important;transform:none!important;transition:none!important}
        *,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important}
        html{scroll-behavior:auto!important}`,
    })
    await page.evaluate(async () => {
      document.querySelectorAll('video').forEach((v) => {
        v.pause()
        v.currentTime = 0
      })
      await document.fonts.ready
      await Promise.all(
        [...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))),
      )
    })
    await page.waitForTimeout(500)
    const file = `${out}/${lang}-${width}.png`
    await page.screenshot({ path: file, fullPage: true })
    console.log(file, await page.evaluate(() => document.documentElement.lang))
    await ctx.close()
  }
}
await browser.close()
