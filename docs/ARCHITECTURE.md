# Arquitectura

Principio rector: **arquitectura proporcional**. Cada carpeta, librería o regla existe por un problema real de este
proyecto (un solo desarrollador, sitio estático, contenido mayormente fijo, bilingüe). Lo que no se justifica, no
se añade. Las decisiones y sus alternativas descartadas están en [`docs/adr/`](./adr).

## Estado actual (Fase 1)

SPA de una sola página con navegación por anclas, construida con Vite. El idioma se resuelve en cliente
(`localStorage` y `navigator`). La Fase 2 introduce rutas y prerenderizado (ver más abajo).

## Estructura

```
src/
  app/            proveedores, layout raíz (Intro, SideNav, RootLayout), ErrorBoundary
  pages/          un componente por ruta; solo ensambla secciones
  features/       un dominio por carpeta (hoy: home, nosotros)
    <dominio>/components/  componentes propios del dominio
  shared/
    ui/           componentes genéricos sin lógica de negocio (Button, Eyebrow, Reveal…)
    hooks/        hooks reutilizables (useScrollY…)
    i18n/         infraestructura de idioma (LangProvider, useLang, LangSwitch)
    intro/        contexto del intro (lo leen Hero y el overlay)
    styles/       Tailwind, tokens (@theme) y estilos globales
  content/        textos tipados por idioma y dominio (capa hoja)
config/           configuración de Vite: metadatos del sitio y plugins de Figma (aislados)
docs/             esta documentación, ADR y problemas conocidos
test/             preparación común de las pruebas
```

Solo existen las features que tienen contenido hoy. Las demás (`proyectos`, `transparencia`, `colaborar`,
`contacto`) se crean junto con su página en la Fase 2; no se crean carpetas vacías.

## Reglas de dependencia

| Capa       | Puede importar de                           | No puede importar de             |
| ---------- | ------------------------------------------- | -------------------------------- |
| `content`  | solo de sí misma                            | todo lo demás                    |
| `shared`   | `shared`; `shared/i18n` además de `content` | `app`, `pages`, `features`       |
| `features` | `shared`, `content`                         | `app`, `pages`, **otra feature** |
| `pages`    | `features`, `shared`, `content`             | `app`                            |
| `app`      | todas                                       | —                                |

Además, **entre carpetas siempre se usa el alias `@`** (`@/shared/ui/Button`). Los imports relativos solo pueden
bajar o quedarse en la misma carpeta (`./Hero`, `./components/Hero`); `../` está prohibido. Así la regla de capas
no se puede esquivar con una ruta relativa.

Se hacen cumplir con `no-restricted-imports` en [`eslint.config.js`](../eslint.config.js) (sin plugins extra).
`pnpm lint` falla si se rompe una regla, tanto en local como en CI.

Si una feature necesita algo de otra, ese algo es `shared` (súbelo) o se compone en `pages`.

## Cómo añadir una página

1. Si tiene contenido propio, crea la feature (ver abajo) y su contenido.
2. Crea `src/pages/<Nombre>Page.tsx`: un componente que solo ensambla secciones de `features/*` y `shared/*`.
3. Regístrala en la tabla de rutas (Fase 2, `src/app/routes`) con su slug en español y en inglés.
4. Añade sus metadatos (título, descripción) por idioma en `content`.
5. Ejecuta `pnpm check`.

## Cómo añadir una feature

1. Crea `src/features/<dominio>/components/`.
2. Crea su contenido: `src/content/es/<dominio>.ts` (define el tipo) y `src/content/en/<dominio>.ts`
   (`satisfies typeof es<Dominio>`). Súmalos en `src/content/{es,en}/index.ts`.
3. **Registra la feature en `eslint.config.js`** (constante `FEATURES`) para que se aplique la regla «una feature
   no importa de otra».
4. Escribe una prueba de humo `src/features/<dominio>/<dominio>.test.tsx`: render sin errores y cambio de idioma.

## Contenido e idioma

- `src/content/{es,en}/<dominio>.ts`: **`es` es la fuente de verdad y define el tipo**; `en` debe satisfacerlo
  (una clave que falte rompe `pnpm typecheck`). Sin librería de i18n: con dos idiomas y textos estáticos bastan
  diccionarios tipados.
- Hoy el idioma se guarda en `localStorage` (mecanismo heredado). El diseño de la Fase 2 está abajo.

### Diseño de rutas e idioma (se implementa en la Fase 2)

- Español **sin prefijo** (`/`, `/nosotros`); inglés con prefijo `/en` (`/en/`, `/en/about`).
- **Nunca** se sirve lo mismo en `/` y `/es`.
- Cada ruta tiene un **slug por idioma**, definido en una sola tabla (propuesta inicial; se confirma en la Fase 2):

| Clave           | Español          | Inglés             |
| --------------- | ---------------- | ------------------ |
| `home`          | `/`              | `/en/`             |
| `nosotros`      | `/nosotros`      | `/en/about`        |
| `proyectos`     | `/proyectos`     | `/en/projects`     |
| `transparencia` | `/transparencia` | `/en/transparency` |
| `colaborar`     | `/colaborar`     | `/en/collaborate`  |
| `contacto`      | `/contacto`      | `/en/contact`      |

- SEO bilingüe: cada página lleva `<html lang>` correcto, `canonical` propio y `hreflang` para `es` y `en`.
  `x-default` apunta a la versión en español («/» en la portada, la ruta española equivalente en el resto).
- Sin redirección automática por `navigator.language`. El selector de idioma es un enlace a la misma página en
  el otro idioma, no un botón con estado. `localStorage` deja de ser fuente de verdad.

## Estado y datos

No hace falta librería de estado global.

| Estado                       | Dónde vive                                          |
| ---------------------------- | --------------------------------------------------- |
| Idioma                       | Contexto `LangProvider` (hoy); la URL (Fase 2)      |
| Intro (fase, saltar)         | `IntroProvider` en `shared/intro`, montado en `app` |
| Menú abierto, sección activa | Estado local de `SideNav`                           |
| Carrusel (índice, pausa)     | Estado local del carrusel                           |

## Estilos

Tailwind v4 con `@theme` en `src/shared/styles/index.css` es la fuente de verdad de los tokens. Hoy conviven dos
paletas (Huito y achiote, y las variables del hero/intro); **su consolidación va en la Fase 4**. Los estilos
globales de elementos (`body`, `p`…) van dentro de `@layer base` para no pisar las utilidades.

## Prerenderizado: restricciones para la Fase 2

La Fase 2 adopta React Router en modo framework con `prerender` ([ADR 0001](./adr/0001-renderizado.md)). Prerender
ejecuta los componentes en Node al construir, donde no existen `window`, `sessionStorage`, `localStorage` ni
`matchMedia`. Por eso:

- **`Intro` y `Hero` no pueden usar `window`, `sessionStorage` ni `matchMedia` al renderizar.** Solo pueden
  hacerlo dentro de efectos (`useEffect`) o manejadores.
- **El intro debe ser solo de cliente y empezar en «terminado» (`done`) en el servidor.** Sin esto el HTML
  prerenderizado traería el intro activo y el contenido `inert`, y los buscadores no verían la página.
- Los usos actuales que hay que mover a efectos antes del prerender están en
  [`known-issues.md`](./known-issues.md): `seen()` y `reducedMotion()` en `shared/intro`, `matchMedia` en el
  carrusel y la detección de idioma en `shared/i18n`.

## Figma Make y hosting

Las decisiones de renderizado ([ADR 0001](./adr/0001-renderizado.md)) y de separar los plugins de Figma
([ADR 0006](./adr/0006-figma-make.md)) tienen dos consecuencias:

1. **Figma Make deja de ser el entorno de ejecución.** El desarrollo, las pruebas y el despliegue se hacen con
   pnpm, GitHub Actions y Netlify. `.figma/` se conserva intacta pero ya no manda sobre el proyecto.
2. **La carpeta de salida cambiará.** Hoy `vite build` publica en `dist/`. Con React Router en modo framework la
   salida estática estará en `build/client`. En ese momento hay que actualizar **`publish` en `netlify.toml`**
   (y las rutas de caché/`_headers` que dependan de ella). `netlify.toml` ya lleva un recordatorio.

Los plugins exclusivos de Figma están en `config/vite-plugins/figma.ts` y se cargan solo si hay variables
`FIGMA_*` o `USE_FIGMA_PLUGINS=true`. Los metadatos del sitio (título, descripción, favicon, robots) están en
`config/site.ts` y `config/vite-plugins/site-head.ts`.

## Indexación

Un **único interruptor** (`SITE.indexable` en `config/site.ts`, variable `SITE_INDEXABLE`) gobierna `robots.txt` y
`<meta name="robots">`. Hoy el sitio **no es indexable** (`Disallow: /` y `noindex, nofollow`). Además,
`netlify.toml` añade `X-Robots-Tag: noindex` a las previsualizaciones de Netlify. Se revisa en la Fase 6
([ADR 0007](./adr/0007-indexacion.md)).

## Calidad automatizada

| Herramienta                       | Para qué                                                       |
| --------------------------------- | -------------------------------------------------------------- |
| `tsc --noEmit` (`typecheck`)      | Tipos estrictos (`noUnused*`, `noUncheckedIndexedAccess`)      |
| ESLint (flat) + typescript-eslint | Calidad; límites de capas; `jsx-a11y` (accesibilidad)          |
| oxfmt                             | Formato (`.oxfmtrc.json`: comillas simples, sin `;`, 120 cols) |
| Vitest + Testing Library          | Pruebas unitarias y de humo por feature                        |
| husky + lint-staged               | Formato y ESLint sobre lo que se va a commitear                |
| GitHub Actions                    | typecheck, lint, formato, pruebas y build en cada PR           |

Playwright (extremo a extremo) se evalúa en la Fase 2, cuando existan rutas e idioma en URL.
