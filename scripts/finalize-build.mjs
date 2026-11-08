// Paso posterior al build: publica la página 404 como Netlify la espera.
//  - El prerender de React Router solo admite rutas que responden 200, así que la 404 se genera como una ruta
//    normal (/404/ y /en/404/) y aquí se COPIA a 404.html y en/404.html (Netlify sirve 404.html con estado 404
//    para cualquier ruta inexistente). Las carpetas 404/ se eliminan: /404/ no debe responder 200.
// Uso: se encadena en `pnpm build` (node scripts/finalize-build.mjs).
import { existsSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..', 'build', 'client')

for (const segments of [['404'], ['en', '404']]) {
  const dir = join(root, ...segments)
  const from = join(dir, 'index.html')
  if (!existsSync(from)) throw new Error(`Falta ${from}: ¿está la ruta 404 en el prerender?`)
  renameSync(from, `${dir}.html`)
  rmSync(dir, { recursive: true })
  console.log(`404: build/client/${segments.join('/')}.html`)
}
