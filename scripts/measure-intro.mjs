// Mide la duración del intro de la portada (no es una prueba): cuánto está el velo en pantalla y cuánto tarda la
// entrada del hero. Sirve build/client como Netlify. Uso: pnpm run build && node scripts/measure-intro.mjs [--runs 5]
//
// Fases (src/shared/intro/intro-context.tsx), reflejadas en <html data-intro>:
//   active  → el velo está en pantalla (mínimo 2,5 s; máximo 4 s DESDE EL PRIMER PINTADO, lo garantiza el script de <head>)
//   leaving → el velo se disuelve y el logo viaja (0,5 s)
//   reveal  → entran los elementos del hero escalonados (1,5 s)
//   done    → intro terminado
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const runs = Number(process.argv[process.argv.indexOf('--runs') + 1]) || 3
const PORT = 4197
const server = spawn(process.execPath, ['scripts/preview.mjs'], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: 'ignore',
})
await new Promise((r) => setTimeout(r, 1500))

/** Perfiles de red: sin límite (local) y una conexión móvil lenta, para ver el video cargando "con normalidad". */
const PROFILES = {
  'local (sin límite)': null,
  '4G (9 Mbps, 170 ms)': {
    latency: 170,
    downloadThroughput: (9 * 1024 * 1024) / 8,
    uploadThroughput: (3 * 1024 * 1024) / 8,
  },
  'Slow 4G (1,6 Mbps, 150 ms)': {
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  },
}

const browser = await chromium.launch()
const fmt = (ms) => (ms / 1000).toFixed(2) + ' s'

// --profile <texto>: solo los perfiles cuyo nombre lo contenga (p. ej. «local», «4G (», «Slow»).
const only = process.argv.includes('--profile') ? process.argv[process.argv.indexOf('--profile') + 1] : ''
for (const [name, net] of Object.entries(PROFILES)) {
  if (only && !name.includes(only)) continue
  const rows = []
  for (let i = 0; i < runs; i++) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    if (net) {
      const cdp = await ctx.newCDPSession(page)
      await cdp.send('Network.emulateNetworkConditions', { offline: false, ...net })
    }
    // Se fuerza effectiveType «4g»: aquí se mide el intro, no la decisión de saltarlo con conexiones lentas.
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', {
        value: { effectiveType: '4g', saveData: false },
        configurable: true,
      })
      window.__t = {}
      const mark = () => {
        const v = document.documentElement.dataset.intro
        if (v && !(v in window.__t)) window.__t[v] = Math.round(performance.now())
      }
      new MutationObserver(mark).observe(document, { attributes: true, subtree: true, attributeFilter: ['data-intro'] })
      document.addEventListener('DOMContentLoaded', mark)
    })
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'commit' })
    await page.waitForFunction(() => window.__t && window.__t.done, null, { timeout: 60_000 })
    const t = await page.evaluate(() => window.__t)
    // Cuándo se vio el primer pintado con el velo (aproximado por el atributo del script de <head>).
    rows.push(t)
    await ctx.close()
  }
  console.log(`\n${name}`)
  let worst = 0
  for (const t of rows) {
    worst = Math.max(worst, t.leaving - t.active)
    console.log(
      `  velo ${fmt(t.leaving - t.active)} · disolución ${fmt(t.reveal - t.leaving)} · entrada del hero ${fmt(t.done - t.reveal)} · total ${fmt(t.done - t.active)} (activo desde ${fmt(t.active)})`,
    )
  }
  console.log(`  → velo máximo ${fmt(worst)}: ${worst <= 4150 ? 'CUMPLE el tope de 4 s' : 'EXCEDE el tope de 4 s'}`)
}

await browser.close()
server.kill()
