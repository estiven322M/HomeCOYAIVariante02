# 0007 — Indexación y robots

**Estado:** Aceptada. Provisional hasta la Fase 6.

## Contexto

`site.json` traía `robots.index: false`, de modo que cada build generaba un `robots.txt` con `Disallow: /`.

## Decisión

Se mantiene el sitio **no indexable** por ahora, con **un único interruptor**: `SITE.indexable` en
`config/site.ts` (variable `SITE_INDEXABLE=true` en el build) gobierna a la vez `robots.txt` y
`<meta name="robots">`. `netlify.toml` añade `X-Robots-Tag: noindex` a las previsualizaciones (deploy previews y
branch deploys). Se cambia en la Fase 6, antes de publicar.

## Consecuencias

Hay que acordarse de activar `SITE_INDEXABLE` en producción; mientras tanto el sitio no aparecerá en buscadores.
No he podido verificar desde aquí el efecto de las cabeceras de Netlify; comprobar en la primera previsualización.
