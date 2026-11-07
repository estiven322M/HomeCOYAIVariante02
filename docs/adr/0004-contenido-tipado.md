# 0004 — Contenido tipado por dominio e idioma

**Estado:** Aceptada. Implementada en la Fase 1.

## Decisión

`src/content/{es,en}/<dominio>.ts`. `es` es la fuente de verdad y define el tipo; `en` lo satisface con
`satisfies`, de modo que una clave faltante rompe el typecheck. `src/shared/i18n` conserva el mecanismo de idioma
actual y solo consume el diccionario.

## Alternativas descartadas

- Un único archivo de ~350 líneas (estado anterior): difícil de mantener y de repartir por dominio.
- **CMS headless (Decap, Keystatic, Sanity…): no por ahora.** Si más adelante alguien de la organización debe
  editar textos sin tocar código, Decap CMS o Keystatic encajan con Netlify, y los módulos tipados migran sin
  reescribir componentes. No se implementa.

## Consecuencias

El texto no se duplica en los componentes. El contenido de una feature nueva se crea junto con la feature.
