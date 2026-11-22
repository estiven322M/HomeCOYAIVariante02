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

/** @type {{ name: string, src: string, out: string, widths: number[], quality?: number, rotate?: number, crop?: { left: number, top: number, width: number, height: number } }[]} */
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
  // Retrato 4:3 recortado alrededor del Taita (cara y busto) para la tarjeta de la junta directiva.
  {
    name: 'taita-junta',
    src: 'public/taita/taita_victoriano.webp',
    out: 'public/nosotros/taita-junta',
    widths: [256, 512],
    quality: 80,
    crop: { left: 256, top: 0, width: 768, height: 576 },
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
    if (job.crop) img = img.extract(job.crop) // recorte (píxeles del original ya orientado) antes de escalar
    img = img.resize({ width, withoutEnlargement: true }).webp({ quality: job.quality ?? 78, effort: 5 })
    const info = await img.toFile(file)
    console.log(`${file}  ${info.width}×${info.height}  ${await kb(file)}  (origen ${meta.width}×${meta.height})`)
  }
}
