# 0007 — Indexación y robots

**Estado:** Aceptada. Provisional hasta la Fase 6.

## Contexto

`site.json` traía `robots.index: false`, de modo que cada build generaba un `robots.txt` con `Disallow: /`.

## Decisión

Se mantiene el sitio **no indexable** por ahora, con **un único interruptor**: la variable de entorno de Vite
`VITE_SITE_INDEXABLE` (`true` para permitir indexación), leída en un único lugar tipado, `src/env.ts`.

- **`<meta name="robots" content="noindex, nofollow">`**: la renderiza React en `DocumentHead` (sale en el HTML
  prerenderizado) cuando `env.SITE_INDEXABLE` es falso.
- **`robots.txt`**: lo emite el plugin `config/vite-plugins/robots-txt.ts` en el build del cliente (`Disallow: /`)
  y en desarrollo, con el mismo valor (`config.env.VITE_SITE_INDEXABLE`). Con el sitio indexable no se emite.
- `netlify.toml` añade `X-Robots-Tag: noindex` a las previsualizaciones (deploy previews y branch deploys).

Se cambia en la Fase 6, antes de publicar. (Antes: `SITE_INDEXABLE` y `config/site.ts`; se eliminaron.)

## Alternativas descartadas

- `define` propio de Vite: duplicaría el mecanismo que Vite ya ofrece con las variables `VITE_*`.
- Dos interruptores (uno para `robots.txt`, otro para la meta): pueden desincronizarse. El test posterior al build
  comprueba que ambos coinciden.

## Consecuencias

Hay que acordarse de definir `VITE_SITE_INDEXABLE=true` (y `VITE_SITE_URL`) en el entorno de producción de Netlify;
mientras tanto el sitio no aparecerá en buscadores. No he podido verificar desde aquí el efecto de las cabeceras de
Netlify; comprobar en la primera previsualización.
