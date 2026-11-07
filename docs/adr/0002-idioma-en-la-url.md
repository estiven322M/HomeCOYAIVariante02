# 0002 — Idioma en la URL

**Estado:** Aceptada. Implementada en la Fase 2A para la portada (`/` y `/en/`); el resto de páginas, en la 2B.

## Contexto

El idioma vive en `localStorage`: un enlace compartido no conserva el idioma y los buscadores no pueden indexar
la versión en inglés.

## Decisión

- Español **sin prefijo** (`/`, `/nosotros/`); inglés con prefijo (`/en/`, `/en/about/`).
- **Todas las URL terminan en barra final** (`/en/`, no `/en`): es la que se sirve (`en/index.html`) y la que usan
  canonical, hreflang y los enlaces internos.
- Un **slug por idioma** desde el diseño, en una sola tabla de rutas (ver `docs/ARCHITECTURE.md`).
- Nunca `/` y `/es` sirviendo lo mismo.
- `hreflang` para `es`, `en` y `x-default` (hacia la versión en español), `canonical` y `<html lang>` por página.
- Sin redirección automática por `navigator.language`; el selector es un enlace (`<a>`) a la misma página en el otro
  idioma, que navega en cliente sin recargar.
- **Sin librería de i18n**: diccionarios tipados (ver [0004](./0004-contenido-tipado.md)).

## Alternativas descartadas

- Prefijo en ambos idiomas (`/es`, `/en`): obliga a decidir qué sirve `/` y duplica contenido.
- `i18next` / `react-intl`: peso y complejidad sin resolver un problema real con 2 idiomas y textos estáticos.
- Mantener `localStorage`: no indexable ni compartible.

## Consecuencias

La detección de idioma en cliente (`detectLang`) y la escritura en `localStorage` se eliminaron. El idioma es un
dato que llega a `LangProvider` desde la URL. Una sugerencia de idioma no intrusiva, si se quiere, sería una decisión
posterior.
