import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

import { figmaPlugins, isFigmaEnvironment } from './config/vite-plugins/figma.ts'
import { robotsTxt } from './config/vite-plugins/robots-txt.ts'

/**
 * Día del build en Colombia ('AAAA-MM-DD'). La agenda de Eventos filtra con él al prerenderizar, y el cliente usa el
 * mismo en su primer render (si no, no coincidiría con el HTML). Va en el entorno para que todas las pasadas del build
 * (cliente, servidor, prerender) compartan el valor.
 */
process.env.ECOYAI_FECHA_BUILD ??= new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date())

/**
 * Build de demostración, SOLO LOCAL (`EVENTOS_DEMO=1 pnpm build`): cambia los datos de Eventos por ejemplos marcados con
 * [EJEMPLO]. En el build normal ese módulo no entra. Netlify no define la variable.
 */
const demoEventos = process.env.EVENTOS_DEMO === '1'

// Vite config — https://vitejs.dev/config/
// El plugin de React Router sustituye a @vitejs/plugin-react en la app (este último solo queda en vitest.config.ts).
export default defineConfig(({ mode }) => {
  // .figma/make/deploy-preview passes `--mode development` for cached-preview builds.
  const emitSourcemaps = mode === 'development'
  const figma = isFigmaEnvironment()

  return {
    base: figma && process.env.FIGMA_PUBLIC_URL ? `${process.env.FIGMA_PUBLIC_URL}/` : '/',
    build: {
      sourcemap: emitSourcemaps ? 'inline' : false,
      minify: !emitSourcemaps,
    },
    define: { __FECHA_BUILD__: JSON.stringify(process.env.ECOYAI_FECHA_BUILD) },
    plugins: [tailwindcss(), reactRouter(), robotsTxt(), ...(figma ? figmaPlugins() : [])],
    resolve: {
      // El orden importa: la sustitución de la demo va antes que el alias general.
      alias: [
        ...(demoEventos
          ? [
              {
                find: /^@\/features\/eventos\/fuente$/,
                replacement: path.resolve(import.meta.dirname, './src/features/eventos/fuente.demo.ts'),
              },
            ]
          : []),
        { find: '@', replacement: path.resolve(import.meta.dirname, './src') },
      ],
    },
    server: {
      host: process.env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
      strictPort: true,
      watch: {
        ignored: ['**/.figma/**'],
      },
    },
    preview: {
      host: process.env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
    },
  }
})
