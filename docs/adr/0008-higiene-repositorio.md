# 0008 — Higiene del repositorio: pnpm único

**Estado:** Aceptada. Implementada en la Fase 1.

## Decisión

- pnpm es el único gestor (`packageManager: pnpm@10.34.3`, igual que `.mise.toml`); se elimina
  `package-lock.json`.
- `.env.example` documenta las variables opcionales (`PORT`, `SITE_INDEXABLE`) y se excluye del ignore de `.env*`.
  No hay `import.meta.env` en uso, así que no se creó un módulo de entorno tipado (se añadirá cuando exista una
  variable real).
- El alias `@` ya existente se usa en todos los imports entre carpetas.
- Scripts: `typecheck`, `lint`, `lint:fix`, `format`, `format:check`, `test`, `test:watch`, `check`.
- `netlify.toml`: build, publicación, `noindex` en previsualizaciones y cabeceras de caché largas para `/assets`
  (inmutable, 1 año), `/video`, `/slider` y `/branding` (30 días).

## Consecuencias

Dos lockfiles dejaban versiones sin determinar según el gestor que se usara; ahora hay uno. En Windows sin pnpm
global se puede usar `corepack pnpm <comando>`.
