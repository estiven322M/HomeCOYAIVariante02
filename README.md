# ÉCOYAI — sitio institucional

Sitio institucional de ÉCOYAI, organización indígena sin ánimo de lucro del Putumayo. Contenido mayormente
estático, bilingüe (ES/EN), con animaciones de cliente (intro con video, parallax, carrusel).

**Pila:** React 19 · React Router 8 (modo framework, prerender) · Vite 8 · Tailwind CSS v4 · TypeScript estricto ·
pnpm · oxfmt · ESLint · Vitest.
**Hosting:** Netlify (sitio estático, sin backend). **Salida del build:** `build/client`.

## Requisitos

- Node.js ≥ 22.22 (versión fijada en [`.node-version`](./.node-version); `engines` en `package.json`) y pnpm 10
  (versión fijada en `packageManager`).
- Si no tienes pnpm: `corepack enable` (o `corepack pnpm <comando>`).

## Cómo correr, probar y construir

```bash
pnpm install          # instala dependencias y los hooks de git
pnpm dev              # servidor de desarrollo (react-router dev; puerto 8443 por defecto, variable PORT)
pnpm test             # pruebas (Vitest + Testing Library)
pnpm test:watch       # pruebas en modo observación
pnpm typecheck        # react-router typegen + tsc --noEmit
pnpm lint             # ESLint (calidad, accesibilidad y límites entre capas)
pnpm format           # formatea con oxfmt
pnpm format:check     # comprueba el formato sin escribir
pnpm build            # build de producción: HTML estático por ruta e idioma en build/client
pnpm verify:build     # revisa el HTML generado (lang, title, h1, hreflang…); requiere haber hecho build
pnpm test:e2e         # extremo a extremo con Playwright (menú, idioma, 404, intro); requiere build y Chromium
pnpm preview          # sirve build/client como Netlify (puerto 4173 por defecto)
pnpm check            # typecheck + lint + format:check + test + build + verify:build + test:e2e (lo mismo que CI)
```

`pnpm dev` no prerenderiza: para ver el HTML estático real usa `pnpm build && pnpm preview`.

Variables de entorno opcionales: ver [`.env.example`](./.env.example).

## Cómo está organizado

El código vive en `src/` por capas (`app`, `pages`, `features`, `shared`, `content`) con reglas de dependencia
que ESLint hace cumplir. Las rutas e idiomas (`/` en español, `/en/` en inglés, y `/nosotros/`, `/proyectos/`… con su equivalente en `/en/…`), cómo añadir una página o una
feature, y las reglas para el prerenderizado están en [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — estructura, reglas y guías.
- [`docs/adr/`](./docs/adr) — decisiones de arquitectura y su motivo.
- [`docs/known-issues.md`](./docs/known-issues.md) — problemas conocidos pendientes para fases siguientes.

## Control de calidad

- **Antes de cada commit** (husky + lint-staged): se formatea y se corrige con ESLint lo que está en staging.
- **En cada pull request y push a `main`** (GitHub Actions, `.github/workflows/ci.yml`): typecheck, lint,
  formato, pruebas, build y `verify:build`.
- **Commits:** se siguen [Conventional Commits](https://www.conventionalcommits.org/) por convención
  (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `build:`, `ci:`, `chore:`). No hay commitlint.
- **Comparación visual:** `node scripts/capture.mjs --label <nombre> --es <url> --en <url>` captura la página
  completa (ES/EN, 1440 y 390 px) en `.baseline/<nombre>/` (ignorado por git) para comparar dos builds. Requiere
  `pnpm exec playwright install chromium` la primera vez.

## Despliegue

Netlify construye con `pnpm run build` y publica `build/client` (ver `netlify.toml`). **El sitio no es indexable
todavía** (`VITE_SITE_INDEXABLE`): ver [ADR 0007](./docs/adr/0007-indexacion.md). Antes de publicar, define
`VITE_SITE_URL` (URL absolutas de canonical y hreflang).

## Figma Make

El proyecto nació en Figma Make. La carpeta `.figma/` se conserva intacta, pero **Figma Make ya no es el entorno
de ejecución**; ver [ADR 0006](./docs/adr/0006-figma-make.md).
