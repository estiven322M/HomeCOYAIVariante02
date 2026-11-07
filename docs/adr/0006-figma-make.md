# 0006 — Separar Figma Make

**Estado:** Aceptada. Implementada en la Fase 1.

## Contexto

`vite.config.ts` importaba `.figma/make/site.json` y cargaba cuatro plugins de Figma Make. Solo uno
(`figmaSiteConfiguration`) afectaba al producto (título, descripción, `lang`, robots).

## Decisión

Separar, no borrar. **`.figma/` no se toca.**

- Los tres plugins exclusivos de Figma (error overlay, refresh boundary, kit de «stories») pasan a
  `config/vite-plugins/figma.ts`, sin cambios de código, y se cargan solo en un entorno Figma.
- Los metadatos pasan a `config/site.ts` y `config/vite-plugins/site-head.ts`.
- **Figma Make deja de ser el entorno de ejecución** (consecuencia también de [0001](./0001-renderizado.md)).

## Consecuencias

- La detección de entorno es una heurística (variables `FIGMA_*` o `USE_FIGMA_PLUGINS`); no verificada contra
  Figma Make real (ver `known-issues.md`).
- La carpeta de salida cambiará en la Fase 2 (`dist` → `build/client`); actualizar `netlify.toml`.
