import type { Plugin } from 'vite'

const ROBOTS_TXT = 'User-agent: *\nDisallow: /\n'

/**
 * Publica `robots.txt` según el interruptor único VITE_SITE_INDEXABLE (el mismo que lee src/env.ts para la
 * <meta name="robots"> de React). Con el sitio no indexable emite `Disallow: /`; con él indexable no emite nada.
 * Vite carga la variable desde .env* o desde el entorno del build (p. ej. el panel de Netlify).
 */
export function robotsTxt(): Plugin {
  let indexable = false

  return {
    name: 'robots-txt',
    configResolved(config) {
      indexable = config.env.VITE_SITE_INDEXABLE === 'true'
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (indexable || req.url?.split('?')[0] !== '/robots.txt') return next()
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(ROBOTS_TXT)
      })
    },
    generateBundle() {
      // Solo en el build del cliente: build/server no se publica.
      if (indexable || this.environment?.name !== 'client') return
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: ROBOTS_TXT })
    },
  }
}
