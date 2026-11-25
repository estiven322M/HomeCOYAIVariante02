// Genera la marca de agua del tigre del hero de Eventos (src/shared/styles/tigre-marca.svg) a partir de
// public/favicon.svg, la versión vectorial del tigre del intro. Monocromo: ocre en la cabeza, los colmillos y los
// detalles de los ojos; huito (el color del fondo) en trazos y manchas, que así se leen como huecos.
// Optimiza: quita el marco que no se ve sobre huito, redondea las coordenadas y recorta el viewBox a la cabeza.
// Uso: node scripts/tigre-marca.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const OCRE = '#d9a21b'
const HUITO = '#1c2233'
const ANCHO = 2705
const ALTO = 2752

const origen = readFileSync('public/favicon.svg', 'utf8')
let paths = [...origen.matchAll(/<path\b[^>]*?\bd="([^"]+)"[^>]*?\bfill="(#[0-9A-Fa-f]{6})"[^>]*\/>/g)]
  .map(([, d, fill]) => ({ d, fill: fill.toUpperCase() }))
  // Los dos trazados de triángulos de las esquinas del marco.
  .filter((p) => p.fill !== '#4E6B3A' && p.fill !== '#9E3B22')
  .map((p) => ({
    d: p.d.replace(/-?\d*\.\d+/g, (n) => String(Math.round(Number(n)))),
    fill: p.fill === '#1C2233' ? HUITO : OCRE,
  }))

const svg = (lista, viewBox) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${lista
    .map((p) => `<path fill="${p.fill}" d="${p.d}"/>`)
    .join('')}</svg>`
/** Cómo se ve sobre el fondo huito, a un tamaño mayor que el que tendrá en pantalla. */
const render = (lista) =>
  sharp(Buffer.from(svg(lista, `0 0 ${ANCHO} ${ALTO}`)))
    .resize({ width: 1100 })
    .flatten({ background: HUITO })
    .raw()
    .toBuffer()

const referencia = await render(paths)
const visiblesDistintos = (a, b) => {
  let n = 0
  for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 8) n++
  return n
}
// Un trazado huito sobra si sin él no cambia ningún píxel (está sobre el propio fondo).
for (let i = paths.length - 1; i >= 0; i--) {
  if (paths[i].fill !== HUITO) continue
  const sin = paths.filter((_, j) => j !== i)
  if (visiblesDistintos(referencia, await render(sin)) === 0) paths = sin
}

// Recorte a lo que se ve: la caja de los píxeles ocre.
const { data, info } = await sharp(Buffer.from(svg(paths, `0 0 ${ANCHO} ${ALTO}`)))
  .flatten({ background: HUITO })
  .raw()
  .toBuffer({ resolveWithObject: true })
let [x0, y0, x1, y1] = [info.width, info.height, 0, 0]
for (let y = 0; y < info.height; y++)
  for (let x = 0; x < info.width; x++)
    if (data[(y * info.width + x) * info.channels] > 120) {
      x0 = Math.min(x0, x)
      y0 = Math.min(y0, y)
      x1 = Math.max(x1, x + 1)
      y1 = Math.max(y1, y + 1)
    }

const salida = svg(paths, `${x0} ${y0} ${x1 - x0} ${y1 - y0}`) + '\n'
writeFileSync('src/shared/styles/tigre-marca.svg', salida)
const pct = (n) => +((100 * n) / ALTO).toFixed(2)
console.log(
  `${paths.length} trazados · ${salida.length} bytes · viewBox ${x0} ${y0} ${x1 - x0} ${y1 - y0} · ancho en el dibujo original: termina al ${((100 * x1) / ANCHO).toFixed(1)} % ·`,
  `alto = ${pct(y1 - y0)} % y desde el ${pct(y0)} % del dibujo`,
)
