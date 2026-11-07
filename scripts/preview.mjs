// Sirve build/client como lo haría Netlify con un sitio estático, para probar el build en local:
//  - `/en` (carpeta sin barra final) -> 301 a `/en/`, que sirve en/index.html;
//  - archivos inexistentes -> 404.html si existe (Fase 2B) o un 404 simple. SIN fallback SPA.
// Uso: pnpm run build && pnpm run preview   (puerto: variable PORT, 4173 por defecto)
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const root = normalize(join(import.meta.dirname, '..', 'build', 'client'))
const port = Number(process.env.PORT) || 4173

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.data': 'text/plain; charset=utf-8',
}

function send(res, status, file) {
  res.writeHead(status, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}

createServer((req, res) => {
  const pathname = decodeURIComponent((req.url ?? '/').split('?')[0])
  const file = normalize(join(root, pathname))
  if (!file.startsWith(root)) return res.writeHead(403).end()

  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!pathname.endsWith('/')) return res.writeHead(301, { Location: `${pathname}/` }).end()
    const index = join(file, 'index.html')
    if (existsSync(index)) return send(res, 200, index)
  } else if (existsSync(file)) {
    return send(res, 200, file)
  }

  const notFound = join(root, '404.html')
  if (existsSync(notFound)) return send(res, 404, notFound)
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404 Not Found')
}).listen(port, () => console.log(`build/client en http://localhost:${port}/`))
