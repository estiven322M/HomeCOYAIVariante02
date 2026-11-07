# ÉCOYAI — sitio institucional

Sitio institucional de ÉCOYAI, organización indígena sin ánimo de lucro del Putumayo. Contenido mayormente
estático, bilingüe (ES/EN), con animaciones de cliente (intro con video, parallax, carrusel).

**Pila:** React 19 · Vite 8 · Tailwind CSS v4 · TypeScript estricto · pnpm · oxfmt · ESLint · Vitest.
**Hosting:** Netlify (sitio estático, sin backend).

## Requisitos

- Node.js 22 y pnpm 10 (versión fijada en `packageManager` de `package.json` y en `.mise.toml`).
- Si no tienes pnpm: `corepack enable` (o `corepack pnpm <comando>`).

## Cómo correr, probar y construir

```bash
pnpm install          # instala dependencias y los hooks de git
pnpm dev              # servidor de desarrollo (puerto 8443 por defecto, variable PORT)
pnpm test             # pruebas (Vitest + Testing Library)
pnpm test:watch       # pruebas en modo observación
pnpm typecheck        # verificación de tipos (tsc --noEmit)
pnpm lint             # ESLint (calidad, accesibilidad y límites entre capas)
pnpm format           # formatea con oxfmt
pnpm format:check     # comprueba el formato sin escribir
pnpm build            # build de producción en dist/
pnpm preview          # sirve el build de dist/
pnpm check            # typecheck + lint + format:check + test + build (lo mismo que CI)
```

Variables de entorno opcionales: ver [`.env.example`](./.env.example).

## Cómo está organizado

El código vive en `src/` por capas (`app`, `pages`, `features`, `shared`, `content`) con reglas de dependencia
que ESLint hace cumplir. Cómo añadir una página o una feature, el detalle de las capas y las restricciones para
el prerenderizado están en [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — estructura, reglas y guías.
- [`docs/adr/`](./docs/adr) — decisiones de arquitectura y su motivo.
- [`docs/known-issues.md`](./docs/known-issues.md) — problemas conocidos pendientes para fases siguientes.

## Control de calidad

- **Antes de cada commit** (husky + lint-staged): se formatea y se corrige con ESLint lo que está en staging.
- **En cada pull request y push a `main`** (GitHub Actions, `.github/workflows/ci.yml`): typecheck, lint,
  formato, pruebas y build.
- **Commits:** se siguen [Conventional Commits](https://www.conventionalcommits.org/) por convención
  (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `build:`, `ci:`, `chore:`). No hay commitlint.

## Despliegue

Netlify construye con `pnpm run build` y publica `dist/` (ver `netlify.toml`). **El sitio no es indexable
todavía**: ver [ADR 0007](./docs/adr/0007-indexacion.md).

## Figma Make

El proyecto nació en Figma Make. La carpeta `.figma/` se conserva intacta, pero **Figma Make ya no es el entorno
de ejecución**; ver [ADR 0006](./docs/adr/0006-figma-make.md).
