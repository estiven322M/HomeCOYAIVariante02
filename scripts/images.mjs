// Genera los derivados optimizados de las imágenes (`pnpm images`). Sharp, devDependency.
//
// Cada trabajo toma un original (`assets-src/` o una imagen ya publicada en `public/`) y escribe uno o varios
// `<salida>-<ancho>.webp` en `public/`. Se auto-orienta con EXIF (`rotate()`), nunca se amplía (`withoutEnlargement`)
// y se descartan los metadatos. Para añadir imágenes (retratos, proyectos…): copia el original a `assets-src/<pagina>/`
// y añade una entrada a JOBS. Los derivados se versionan (Git LFS, como el resto de `.webp`).
//
// Grado de color (`grade`): ver GRADES más abajo (parámetros documentados y reutilizables para futuras imágenes).
//
// Uso: pnpm images            (todo)
//      pnpm images hero       (solo los trabajos cuyo nombre contenga «hero»)
import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { stat } from 'node:fs/promises'
import sharp from 'sharp'

/**
 * Grados de color. No tocan el original: se aplican al derivado, ya escalado, en este orden:
 *   1. brightness / saturation (`modulate`; 1 = sin cambio).
 *   2. warm: multiplicadores de los canales [R, G, B] (`recomb`); [1.04, 1, 0.94] calienta ligeramente.
 *   3. contrast: pendiente lineal alrededor del gris medio (1 = sin cambio).
 *   4. vignette: oscurecimiento de los bordes, 0 (nada) a 1 (negro); `vignetteStart` es el radio (0-1, desde el centro) donde empieza.
 *   5. vignetteRight: oscurecimiento extra del lado derecho (0 a 1), con degradado desde el centro; sirve para bajar zonas claras de ese lado.
 *
 * - `selva`: para imágenes de FONDO (hero, llamado a la acción) con velo encima: baja luminosidad y saturación, tonos
 *   cálidos, algo más de contraste y viñeta suave, para parecerse al hero de Nosotros. Úsalo en futuras imágenes de fondo.
 * - `serie`: ajuste leve y uniforme para retratos y fotos de contenido: conserva el color natural y las deja como una serie.
 * @type {Record<string, { brightness: number, saturation: number, warm: [number, number, number], contrast: number, vignette: number, vignetteStart: number, vignetteRight?: number }>}
 */
const GRADES = {
  selva: {
    brightness: 0.58,
    saturation: 0.75,
    warm: [1.03, 0.97, 0.95],
    contrast: 1.15,
    vignette: 0.5,
    vignetteStart: 0.5,
    vignetteRight: 0.5,
  },
  serie: { brightness: 1, saturation: 0.93, warm: [1.015, 1, 0.97], contrast: 1, vignette: 0, vignetteStart: 0.6 },
}

/** Aplica un grado de color a un `sharp` ya escalado a (width × height). */
async function applyGrade(img, gradeName, width, height) {
  const g = GRADES[gradeName]
  if (!g) throw new Error(`Grado desconocido: ${gradeName}`)
  img = img.modulate({ brightness: g.brightness, saturation: g.saturation })
  img = img.recomb([
    [g.warm[0], 0, 0],
    [0, g.warm[1], 0],
    [0, 0, g.warm[2]],
  ])
  if (g.contrast !== 1) img = img.linear(g.contrast, -128 * (g.contrast - 1))
  if (g.vignette > 0 || g.vignetteRight) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><radialGradient id="v" cx="50%" cy="50%" r="75%"><stop offset="${Math.round(g.vignetteStart * 100)}%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${g.vignette}"/></radialGradient><linearGradient id="r" x1="0" x2="1" y1="0" y2="0"><stop offset="35%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${g.vignetteRight ?? 0}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#v)"/><rect width="100%" height="100%" fill="url(#r)"/></svg>`
    img = sharp(await img.toBuffer()).composite([{ input: Buffer.from(svg) }])
  }
  return img
}

/**
 * @type {{ name: string, src: string, out: string, widths: number[], quality?: number, rotate?: number, tilt?: number, denoise?: number, optional?: boolean, grade?: string,
 *   crop?: { left: number, top: number, width: number, height: number } }[]}
 * `denoise`: tamaño de la ventana del filtro de mediana (3 = suave) tras escalar; para fotos con mucho ruido (teléfono) que, si no, pesan demasiado.
 * `tilt`: grados para enderezar (positivo = giro horario); la imagen se gira y `crop` se expresa sobre el lienzo ya girado.
 */
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
    quality: 72,
    optional: true,
    grade: 'selva',
  },
  {
    name: 'salud-llamado',
    src: 'assets-src/salud/llamado',
    out: 'public/salud/llamado',
    widths: [480, 900],
    quality: 66,
    optional: true,
    grade: 'serie',
    crop: { left: 140, top: 0, width: 970, height: 1212 }, // 4:5, desplazado a la derecha: deja fuera el hombro de otra persona del borde izquierdo
  },
  {
    name: 'salud-practica-1',
    src: 'assets-src/salud/practica-1-yage',
    out: 'public/salud/practica-1-yage',
    widths: [480, 900],
    quality: 66,
    optional: true,
    grade: 'serie',
  },
  {
    name: 'salud-practica-2',
    src: 'assets-src/salud/practica-2-purgas-banos',
    out: 'public/salud/practica-2-purgas-banos',
    widths: [480, 900],
    quality: 58,
    optional: true,
    grade: 'serie',
  },
  {
    name: 'salud-practica-3',
    src: 'assets-src/salud/practica-3-botanica',
    out: 'public/salud/practica-3-botanica',
    widths: [480, 900],
    quality: 52,
    denoise: 3, // foto de teléfono con ruido: sin esto, a 150 KB aparecen bloques en el follaje
    optional: true,
    grade: 'serie',
  },
  {
    name: 'salud-practica-4',
    src: 'assets-src/salud/practica-4-saberes',
    out: 'public/salud/practica-4-saberes',
    widths: [480, 900],
    quality: 52,
    optional: true,
    grade: 'serie',
  },
  {
    name: 'salud-solicitar',
    src: 'assets-src/salud/solicitar',
    out: 'public/salud/solicitar',
    widths: [960, 1200], // el recorte 16:9 mide 1200 px: no se amplía (ver docs/known-issues.md)
    quality: 76,
    optional: true,
    grade: 'serie',
    tilt: -1, // endereza el horizonte (la orilla lejana está ~0,5° inclinada; la ribera cercana, más por perspectiva)
    crop: { left: 48, top: 153, width: 1200, height: 675 }, // 16:9 sobre el lienzo ya girado (1297×982)
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
  // Orientación, enderezado y recorte se hacen una vez (en memoria); después se escala a cada ancho.
  let base = sharp(job.src).rotate(job.rotate) // sin argumento: según EXIF; con `rotate`: grados explícitos
  if (job.tilt) base = sharp(await base.toBuffer()).rotate(job.tilt, { background: '#000' })
  if (job.crop) base = sharp(await base.toBuffer()).extract(job.crop) // píxeles del original ya orientado/enderezado
  const cropped = await base.toBuffer()
  const grade = process.env.IMAGES_NO_GRADE ? undefined : job.grade // IMAGES_NO_GRADE=1: derivados sin retoque (comparaciones)
  for (const width of job.widths) {
    const file = `${job.out}-${width}.webp`
    mkdirSync(dirname(file), { recursive: true })
    const { data, info: size } = await sharp(cropped)
      .resize({ width, withoutEnlargement: true })
      .toBuffer({ resolveWithObject: true })
    let img = sharp(job.denoise ? await sharp(data).median(job.denoise).toBuffer() : data)
    if (grade) img = await applyGrade(img, grade, size.width, size.height)
    const info = await img.webp({ quality: job.quality ?? 78, effort: 5 }).toFile(file)
    console.log(`${file}  ${info.width}×${info.height}  ${await kb(file)}  (origen ${meta.width}×${meta.height})`)
  }
}
