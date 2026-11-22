// Genera los derivados optimizados de las imágenes (`pnpm images`). Sharp, devDependency.
//
// Cada trabajo toma un original (`assets-src/` o una imagen ya publicada en `public/`) y escribe uno o varios
// `<salida>-<ancho>.webp` en `public/`. Se auto-orienta con EXIF (`rotate()`), nunca se amplía (`withoutEnlargement`)
// y se descartan los metadatos. Para añadir imágenes (retratos, proyectos…): copia el original a `assets-src/<pagina>/`
// y añade una entrada a JOBS. Los derivados se versionan (Git LFS, como el resto de `.webp`).
//
// Uso: pnpm images            (todo)
//      pnpm images hero       (solo los trabajos cuyo nombre contenga «hero»)
import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { stat } from 'node:fs/promises'
import sharp from 'sharp'

/** @type {{ name: string, src: string, out: string, widths: number[], quality?: number, rotate?: number, optional?: boolean, crop?: { left: number, top: number, width: number, height: number } }[]} */
const JOBS = [
  {
    name: 'hero-selva',
    src: 'assets-src/nosotros/hero-selva.webp',
    out: 'public/nosotros/hero-selva',
    widths: [960, 1280, 1920],
    quality: 76,
  },
  {
    name: 'rio-putumayo',
    src: 'assets-src/nosotros/rio-putumayo.webp',
    out: 'public/nosotros/rio-putumayo',
    widths: [640, 1280],
    quality: 78,
  },
  {
    name: 'taita',
    src: 'public/taita/taita_victoriano.webp',
    out: 'public/nosotros/taita',
    widths: [640, 960],
    quality: 78,
  },
  // Salud (originales que entrega la organización en assets-src/salud/; se omiten mientras falten: `optional`).
  // Tras generarlos, `available: true` en src/features/salud/images.ts. La extensión del original puede ser .webp/.jpg/.png.
  {
    name: 'salud-hero',
    src: 'assets-src/salud/hero',
    out: 'public/salud/hero',
    widths: [960, 1280, 1920],
    quality: 76,
    optional: true,
  },
  {
    name: 'salud-llamado',
    src: 'assets-src/salud/llamado',
    out: 'public/salud/llamado',
    widths: [480, 960],
    quality: 78,
    optional: true,
  },
  {
    name: 'salud-practica-1',
    src: 'assets-src/salud/practica-1-yage',
    out: 'public/salud/practica-1-yage',
    widths: [480, 960],
    quality: 78,
    optional: true,
  },
  {
    name: 'salud-practica-2',
    src: 'assets-src/salud/practica-2-purgas-banos',
    out: 'public/salud/practica-2-purgas-banos',
    widths: [480, 960],
    quality: 78,
    optional: true,
  },
  {
    name: 'salud-practica-3',
    src: 'assets-src/salud/practica-3-botanica',
    out: 'public/salud/practica-3-botanica',
    widths: [480, 960],
    quality: 78,
    optional: true,
  },
  {
    name: 'salud-practica-4',
    src: 'assets-src/salud/practica-4-saberes',
    out: 'public/salud/practica-4-saberes',
    widths: [480, 960],
    quality: 78,
    optional: true,
  },
  {
    name: 'salud-solicitar',
    src: 'assets-src/salud/solicitar',
    out: 'public/salud/solicitar',
    widths: [960, 1280, 1920],
    quality: 76,
    optional: true,
  },
]

/** El original tal cual o con una de las extensiones habituales (para los trabajos que dan solo el nombre base). */
const resolveSource = (src) =>
  [src, ...['.webp', '.jpg', '.jpeg', '.png'].map((e) => src + e)].find((f) => existsSync(f))

const only = process.argv[2]
const kb = async (f) => `${Math.round((await stat(f)).size / 1024)} KB`

for (const job of JOBS.filter((j) => !only || j.name.includes(only))) {
  const source = resolveSource(job.src)
  if (!source) {
    if (job.optional) {
      console.log(`(omitido) ${job.name}: falta ${job.src}.{webp,jpg,png}`)
      continue
    }
    throw new Error(`No existe el original de ${job.name}: ${job.src}`)
  }
  job.src = source
  const meta = await sharp(job.src).metadata()
  for (const width of job.widths) {
    const file = `${job.out}-${width}.webp`
    mkdirSync(dirname(file), { recursive: true })
    let img = sharp(job.src).rotate(job.rotate) // sin argumento: según EXIF; con `rotate`: grados explícitos
    if (job.crop) img = img.extract(job.crop) // recorte (píxeles del original ya orientado) antes de escalar
    img = img.resize({ width, withoutEnlargement: true }).webp({ quality: job.quality ?? 78, effort: 5 })
    const info = await img.toFile(file)
    console.log(`${file}  ${info.width}×${info.height}  ${await kb(file)}  (origen ${meta.width}×${meta.height})`)
  }
}
