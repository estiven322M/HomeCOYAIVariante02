import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

import { figmaPlugins, isFigmaEnvironment } from './config/vite-plugins/figma.ts'
import { robotsTxt } from './config/vite-plugins/robots-txt.ts'

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
    plugins: [tailwindcss(), reactRouter(), robotsTxt(), ...(figma ? figmaPlugins() : [])],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
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
