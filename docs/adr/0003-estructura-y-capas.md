# 0003 — Estructura de carpetas y reglas de capas

**Estado:** Aceptada. Implementada en la Fase 1.

## Contexto

`src/components` mezclaba secciones de página, UI genérica y lógica. Se quiere añadir páginas sin romper lo
existente.

## Decisión

Capas `app`, `pages`, `features`, `shared`, `content` (ver `docs/ARCHITECTURE.md`). Ajustes aprobados:

- Solo existen `features/home` y `features/nosotros`; las demás nacen con su página.
- `Intro` y `SideNav` van en `app/layout`; el **contexto** del intro va en `shared/intro` para que `Hero` (feature)
  no importe de `app`.
- `content` es una **capa hoja**: no importa nada; la importan `shared/i18n`, `features`, `pages` y `app`.
- Se impone con `no-restricted-imports` (sin plugins adicionales), alias `@` obligatorio entre capas y sin
  imports relativos que suban (`../`).

## Alternativas descartadas

- `eslint-plugin-boundaries` / `dependency-cruiser`: para 4 reglas simples, una dependencia más.
- Crear todas las carpetas de feature desde ya: ruido sin contenido.

## Consecuencias

Al añadir una feature hay que registrarla en la constante `FEATURES` de `eslint.config.js`.
