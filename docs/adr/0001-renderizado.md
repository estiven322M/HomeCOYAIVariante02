# 0001 — Estrategia de renderizado

**Estado:** Aceptada e implementada en la Fase 2A (React Router 8.5.1 + prerender).

## Contexto

Era una SPA sin router. Al añadir páginas, una SPA con `react-router` entrega el mismo HTML (mismo título y
descripción) a buscadores y vistas previas de WhatsApp/redes. El sitio es estático, bilingüe, sin backend, lo
mantiene una persona y va a Netlify.

## Decisión

**React Router en modo framework con `ssr: false` y `prerender`** (salida estática por ruta e idioma).

Condiciones originales: (1) prueba de compatibilidad al inicio de la Fase 2; (2) etiqueta `pre-arquitectura`
(hecha).

### Resultado de la prueba de compatibilidad (Fase 2A, Paso 1)

La versión estable actual es **React Router 8.5.1** (no la v7). Veredicto: **compatible con ajustes**. Se probó
primero en una copia desechable y luego se contrastó con la documentación oficial (pre-rendering, SPA mode,
route module).

| Pieza                         | Resultado                                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Vite 8.0.5                    | Compatible (`@react-router/dev` declara `vite ^7 \|\| ^8`)                                                                             |
| `@tailwindcss/vite` 4         | Compatible; el CSS resultante es el mismo                                                                                              |
| React                         | **Ajuste:** exige `react` y `react-dom` ≥ 19.2.7 → se subió a 19.3.1                                                                   |
| Node                          | **Ajuste:** exige ≥ 22.22.0 → `.node-version` y `engines`                                                                              |
| `@vitejs/plugin-react`        | **Ajuste:** lo sustituye `reactRouter()`; se conserva solo en `vitest.config.ts`                                                       |
| `isbot`, `@react-router/node` | **Ajuste:** dependencias del `entry.server` por defecto (la documentación pide `@react-router/node`)                                   |
| Plugin propio `siteHead`      | **Ajuste:** su `transformIndexHtml` ya no actúa (el HTML lo genera React). Quedó `robots-txt.ts`; los metadatos pasan a `DocumentHead` |
| Salida                        | `build/client` (se publica) y `build/server` (no). `appDirectory: 'src/app'` funciona                                                  |
| `robots.txt`                  | Se emite en `build/client` con un plugin de Vite (solo en el entorno `client`)                                                         |

Hallazgos a tener presentes (de la documentación, salvo donde se indica):

- El prerender escribe `ruta/index.html` (con `ruta.data` si hay loaders) y, si `/` está prerenderizada, un
  `__spa-fallback.html` para las rutas no prerenderizadas.
- **Prerender falla si una ruta responde distinto de 200** (dato del código de `@react-router/dev`, no de la documentación). Por eso la 404 real no puede prerenderizarse con
  estado 404 (ver `docs/ARCHITECTURE.md`, «La página 404»).
- `headers` y `action` están prohibidos en rutas con `ssr: false`; `loader` solo en la raíz o en rutas prerenderizadas.
- La documentación recomienda las etiquetas nativas `<title>`/`<meta>`/`<link>` de React 19 frente al export
  `meta`; así se hizo (`DocumentHead`).

## Alternativas descartadas

- **SPA + prerender con plugin (Puppeteer):** build lento y herramientas frágiles.
- **`vite-react-ssg`:** menos reescritura, pero librería comunitaria de un solo mantenedor. Plan B no necesario.
- **Next.js (export) / Astro con islas:** más migración. Astro obligaría a rehacer intro, idioma y menú, que
  comparten estado, como islas.

## Consecuencias

- Figma Make deja de ser el entorno de ejecución (ver [0006](./0006-figma-make.md)).
- La carpeta de salida cambió de `dist` a `build/client` (`netlify.toml` actualizado).
- El código no puede usar `window`/`sessionStorage`/`matchMedia` al renderizar (ver `docs/ARCHITECTURE.md`).
- `__spa-fallback.html` se genera pero no se usa; la 404 real llega en la Fase 2B.
