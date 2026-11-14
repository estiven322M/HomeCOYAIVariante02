// Genera los derivados optimizados de las imágenes (`pnpm images`). Sharp, devDependency.
//
// Cada trabajo toma un original (`assets-src/` o una imagen ya publicada en `public/`) y escribe uno o varios
// `<salida>-<ancho>.webp` en `public/`. Se auto-orienta con EXIF (`rotate()`), nunca se amplía (`withoutEnlargement`)
// y se descartan los metadatos. Para añadir imágenes (retratos, proyectos…): copia el original a `assets-src/<pagina>/`
// y añade una entrada a JOBS. Los derivados se versionan (Git LFS, como el resto de `.webp`).
//
// Uso: pnpm images            (todo)
//      pnpm images hero       (solo los trabajos cuyo nombre contenga «hero»)
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { stat } from 'node:fs/promises'
import sharp from 'sharp'

/** @type {{ name: string, src: string, out: string, widths: number[], quality?: number, rotate?: number }[]} */
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
  // Miniaturas de rombo (128 px, 2x = 256 px) a partir de imágenes ya publicadas en el carrusel de la portada.
  { name: 'mision', src: 'public/slider/slider4.webp', out: 'public/nosotros/mision', widths: [256], quality: 80 },
  { name: 'vision', src: 'public/slider/slider5.webp', out: 'public/nosotros/vision', widths: [256], quality: 80 },
  {
    name: 'valores',
    src: 'public/slider/slider9.webp',
    out: 'public/nosotros/valores',
    widths: [480, 960],
    quality: 78,
  },
  {
    name: 'taita',
    src: 'public/taita/taita_victoriano.webp',
    out: 'public/nosotros/taita',
    widths: [640, 960],
    quality: 78,
  },
]

const only = process.argv[2]
const kb = async (f) => `${Math.round((await stat(f)).size / 1024)} KB`

for (const job of JOBS.filter((j) => !only || j.name.includes(only))) {
  const meta = await sharp(job.src).metadata()
  for (const width of job.widths) {
    const file = `${job.out}-${width}.webp`
    mkdirSync(dirname(file), { recursive: true })
    let img = sharp(job.src).rotate(job.rotate) // sin argumento: según EXIF; con `rotate`: grados explícitos
    img = img.resize({ width, withoutEnlargement: true }).webp({ quality: job.quality ?? 78, effort: 5 })
    const info = await img.toFile(file)
    console.log(`${file}  ${info.width}×${info.height}  ${await kb(file)}  (origen ${meta.width}×${meta.height})`)
  }
}
