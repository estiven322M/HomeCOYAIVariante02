import type { HtmlTagDescriptor, Plugin } from 'vite'
import { SITE } from '../site.ts'

const ROBOTS_TXT = 'User-agent: *\nDisallow: /\n'

/**
 * Inyecta los metadatos del documento (descripción, robots, favicon, Open Graph)
 * y publica `robots.txt` según el interruptor único `SITE.indexable`.
 */
export function siteHead(): Plugin {
  const robotsTxt = SITE.indexable ? '' : ROBOTS_TXT

  return {
    name: 'site-head',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!robotsTxt || req.url?.split('?')[0] !== '/robots.txt') return next()
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(robotsTxt)
      })
    },
    generateBundle() {
      if (!robotsTxt) return
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt })
    },
    transformIndexHtml() {
      const tags: HtmlTagDescriptor[] = [
        { tag: 'meta', attrs: { name: 'description', content: SITE.description }, injectTo: 'head' },
      ]
      if (!SITE.indexable) {
        tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' })
      }
      tags.push(
        { tag: 'link', attrs: { rel: 'icon', href: SITE.favicon }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:title', content: SITE.title }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:description', content: SITE.description }, injectTo: 'head' },
      )
      return tags
    },
  }
}
