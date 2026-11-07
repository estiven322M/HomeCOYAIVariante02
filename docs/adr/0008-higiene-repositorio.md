# 0008 — Higiene del repositorio: pnpm único

**Estado:** Aceptada. Implementada en la Fase 1.

## Decisión

- pnpm es el único gestor (`packageManager: pnpm@10.34.3`, igual que `.mise.toml`); se elimina
  `package-lock.json`.
- `.env.example` documenta las variables opcionales (`PORT`, `VITE_SITE_INDEXABLE`, `VITE_SITE_URL`) y se excluye del
  ignore de `.env*`. Se leen en `src/env.ts`, tipado (Fase 2A).
- El alias `@` ya existente se usa en todos los imports entre carpetas.
- Scripts: `typecheck`, `lint`, `lint:fix`, `format`, `format:check`, `test`, `test:watch`, `check`.
- `netlify.toml`: build, publicación, `noindex` en previsualizaciones y cabeceras de caché largas para `/assets`
  (inmutable, 1 año), `/video`, `/slider` y `/branding` (30 días).

- **Node (Fase 2A):** la versión mínima vive en un único archivo, `.node-version` (22.22.0), que usan mise
  (`idiomatic_version_file_enable_tools`), Netlify y GitHub Actions (`node-version-file`); `engines` en `package.json`
  la refuerza. El paquete se llama `ecoyai-web`.

## Consecuencias

Dos lockfiles dejaban versiones sin determinar según el gestor que se usara; ahora hay uno. En Windows sin pnpm
global se puede usar `corepack pnpm <comando>`.
