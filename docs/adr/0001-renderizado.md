# 0001 — Estrategia de renderizado

**Estado:** Aceptada, con dos condiciones. Se implementa en la Fase 2.

## Contexto

Hoy es una SPA sin router. Al añadir páginas, una SPA con `react-router` entrega el mismo HTML (mismo título y
descripción) a buscadores y vistas previas de WhatsApp/redes. El sitio es estático, bilingüe, sin backend, lo
mantiene una persona y va a Netlify.

## Decisión

**React Router en modo framework con `prerender`** (salida estática por ruta e idioma). Condiciones:

1. Al inicio de la Fase 2, una prueba de compatibilidad con Vite 8, React 19 y el plugin de Tailwind. Si falla:
   se usa `vite-react-ssg` o se fija otra versión de Vite.
2. Etiqueta de Git `pre-arquitectura` creada antes de mover archivos (hecho).

## Alternativas descartadas

- **SPA + prerender con plugin (Puppeteer):** build lento y herramientas frágiles.
- **`vite-react-ssg`:** menos reescritura, pero librería comunitaria de un solo mantenedor. Queda como plan B.
- **Next.js (export) / Astro con islas:** más migración. Astro obligaría a rehacer intro, idioma y menú, que
  comparten estado, como islas.

## Consecuencias

- Figma Make deja de ser el entorno de ejecución (ver [0006](./0006-figma-make.md)).
- La carpeta de salida cambia de `dist` a `build/client`: actualizar `publish` en `netlify.toml`.
- `Intro` y `Hero` no pueden usar `window`/`sessionStorage`/`matchMedia` al renderizar; el intro empieza en
  `done` en el servidor (ver `docs/ARCHITECTURE.md` y `known-issues.md`).
