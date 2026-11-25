// Genera los medios del video de fondo de Eventos (`pnpm video`): webm (VP9) y mp4 (H.264) sin audio, y su póster.
// No forma parte del build: se ejecuta a mano y los derivados se versionan (Git LFS).
//
// El ORIGINAL NO SE VERSIONA (personas identificables y audio). Se pasa como argumento o en EVENTOS_VIDEO_ORIGINAL:
//   pnpm video "C:\Users\jhons\OneDrive\Documents\Freelance\Seguimiento\Imágenes\videos\eventos-hero-original.mp4"
//
// Necesita ffmpeg y ffprobe. Se buscan en FFMPEG_DIR, en el PATH y en la instalación de Shutter Encoder (Windows).
// Otra versión de ffmpeg puede no dar archivos idénticos byte a byte.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Fragmento del original (segundos): un bucle de 8 s con corte seco. Se probó fundir el final con el inicio, pero la
 * cámara se desplaza entre ambos y el fundido superponía dos encuadres (figuras fantasma).
 */
const INICIO = 16
const FIN = 24
/** Tamaño de salida. El original debe ser al menos así de grande: nunca se amplía. */
const ANCHO = 1024
const ALTO = 576
const FPS = 30
/** Calidad constante (menor = mejor y más pesado). */
const CRF_WEBM = 40
const CRF_MP4 = 29
/** Peso máximo de los tres archivos juntos (lo comprueba también `pnpm verify:build`). */
const MAX_BYTES = 3_000_000

const SALIDA = 'public/video'
const WEBM = join(SALIDA, 'eventos-hero.webm')
const MP4 = join(SALIDA, 'eventos-hero.mp4')
const POSTER = join(SALIDA, 'eventos-poster.jpg')

function herramienta(nombre) {
  const exe = process.platform === 'win32' ? `${nombre}.exe` : nombre
  const carpetas = [process.env.FFMPEG_DIR, 'C:\\Program Files\\Shutter Encoder\\app\\Library'].filter(Boolean)
  if (!process.env.FFMPEG_DIR) {
    try {
      execFileSync(nombre, ['-version'], { stdio: 'ignore' })
      return nombre
    } catch {
      /* no está en el PATH */
    }
  }
  const ruta = carpetas.map((c) => join(c, exe)).find((r) => existsSync(r))
  if (!ruta) throw new Error(`No se encontró ${nombre}. Instálalo o define FFMPEG_DIR con la carpeta que lo contiene.`)
  return ruta
}

const original = process.argv[2] ?? process.env.EVENTOS_VIDEO_ORIGINAL
if (!original || !existsSync(original)) {
  console.error(
    'Falta el video original. Uso: pnpm video "<ruta>\\eventos-hero-original.mp4" (o EVENTOS_VIDEO_ORIGINAL).',
  )
  process.exit(1)
}

const ffmpeg = herramienta('ffmpeg')
const ffprobe = herramienta('ffprobe')
const run = (args) => execFileSync(ffmpeg, ['-hide_banner', '-v', 'error', '-y', ...args], { stdio: 'inherit' })
const probe = (file) =>
  JSON.parse(execFileSync(ffprobe, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]).toString())

const fuente = probe(original).streams.find((s) => s.codec_type === 'video')
if (!fuente || fuente.width < ANCHO || fuente.height < ALTO)
  throw new Error(`El original debe medir al menos ${ANCHO}×${ALTO} (no se amplía).`)

mkdirSync(SALIDA, { recursive: true })

const filtro = `[0:v]trim=${INICIO}:${FIN},setpts=PTS-STARTPTS,scale=${ANCHO}:${ALTO},fps=${FPS},format=yuv420p[v]`

// Sin audio (-an) y sin metadatos del original (-map_metadata -1: fecha, dispositivo, ubicación…).
const comunes = ['-i', original, '-filter_complex', filtro, '-map', '[v]', '-an', '-map_metadata', '-1']

const vp9 = ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(CRF_WEBM), '-row-mt', '1', '-deadline', 'good']
run([...comunes, ...vp9, '-cpu-used', '2', WEBM])
const x264 = ['-c:v', 'libx264', '-preset', 'slow', '-crf', String(CRF_MP4), '-profile:v', 'high']
run([...comunes, ...x264, '-movflags', '+faststart', MP4])
// Póster: el primer fotograma del bucle (así no hay salto al empezar a reproducirse).
run(['-i', MP4, '-frames:v', '1', '-q:v', '4', '-map_metadata', '-1', '-update', '1', POSTER])

let total = 0
for (const file of [WEBM, MP4, POSTER]) {
  const { size } = statSync(file)
  total += size
  const info = probe(file)
  const video = info.streams.find((s) => s.codec_type === 'video')
  if (info.streams.some((s) => s.codec_type === 'audio')) throw new Error(`${file} tiene audio`)
  if (video.width !== ANCHO || video.height !== ALTO) throw new Error(`${file}: ${video.width}×${video.height}`)
  const duracion = file === POSTER ? '' : `  ${Number(info.format.duration).toFixed(2)} s`
  console.log(`${file}  ${video.width}×${video.height}${duracion}  ${size} bytes`)
}
console.log(`total ${total} bytes (máximo ${MAX_BYTES})`)
if (total >= MAX_BYTES) throw new Error('Los medios superan el peso máximo.')
