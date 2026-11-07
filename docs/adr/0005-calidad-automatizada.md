# 0005 — Calidad automatizada mínima

**Estado:** Aceptada. Implementada en la Fase 1.

## Decisión

| Sí                                                        | No                           |
| --------------------------------------------------------- | ---------------------------- |
| ESLint (flat) + typescript-eslint, react-hooks, jsx-a11y  | Playwright (por ahora)       |
| Límites entre capas con `no-restricted-imports`           | commitlint                   |
| oxfmt (`.oxfmtrc.json`) y `typecheck` estricto            | Librería de estado global    |
| Vitest + Testing Library (pruebas de humo por feature)    | Cobertura mínima obligatoria |
| husky + lint-staged mínimos (Windows: `npx --no-install`) |                              |
| GitHub Actions: typecheck, lint, formato, pruebas, build  |                              |

Conventional Commits se sigue por convención. Playwright se reevalúa en la Fase 2 (rutas e idioma en URL).

## Notas

- ESLint se fija en la versión 9 porque `eslint-plugin-jsx-a11y` no declara compatibilidad con 10.
- oxfmt se actualizó de 0.2.0 a 0.77.0 (la 0.2.0 no admite archivo de configuración).
- `tsconfig` activa `noUnusedLocals`, `noUnusedParameters` y `noUncheckedIndexedAccess`; sin el operador `!`.
