# Arquitectura

Principio rector: **arquitectura proporcional**. Cada carpeta, librería o regla existe por un problema real de este
proyecto (un solo desarrollador, sitio estático, contenido mayormente fijo, bilingüe). Lo que no se justifica, no
se añade. Las decisiones y sus alternativas descartadas están en [`docs/adr/`](./adr).

## Estado actual (Fase 2A)

Sitio estático generado con **React Router 8.5.1 en modo framework** (`ssr: false` + `prerender`), sobre Vite 8,
React 19.3 y Tailwind v4. Hoy hay una página (la portada) en dos idiomas: `/` (español) y `/en/` (inglés). El
build escribe un HTML por ruta en `build/client`; en el navegador React hidrata ese HTML. Las páginas nuevas y la
navegación real entre ellas son la Fase 2B.

## Estructura

```
src/
  app/              raíz de la aplicación (React Router)
    root.tsx          documento HTML de todas las rutas (Layout) + proveedores
    routes.ts         registro de rutas, generado desde la tabla de rutas
    routes/           un módulo por página (hoy: home.tsx)
    DocumentHead.tsx  <title>, descripción, robots, canonical, hreflang, Open Graph
    ErrorBoundary.tsx pantalla de respaldo accesible
    layout/           RootLayout, Intro (overlay), SideNav
  pages/            un componente por página; solo ensambla secciones
  features/         un dominio por carpeta (hoy: home, nosotros)
    <dominio>/components/  componentes propios del dominio
  shared/
    ui/             componentes genéricos sin lógica de negocio (Button, Eyebrow, Reveal…)
    hooks/          hooks reutilizables (useScrollY, useViewportHeight)
    lib/            utilidades (prefersReducedMotion)
    i18n/           idioma: LangProvider, LangSwitch, tabla de rutas (routes.ts)
    intro/          contexto del intro y script de arranque
    styles/         Tailwind, tokens (@theme) y estilos globales
  content/          textos tipados por idioma y dominio (capa hoja)
  env.ts            variables de entorno tipadas (VITE_*)
react-router.config.ts   modo framework: appDirectory, ssr: false, prerender
config/             plugins de Vite: robots.txt y plugins de Figma (aislados)
scripts/            preview.mjs (sirve build/client) y capture.mjs (captura visual)
docs/               esta documentación, ADR y problemas conocidos
test/               render con router, preparación común y verificación posterior al build
```

Solo existen las features que tienen contenido hoy. Las demás (`proyectos`, `transparencia`, `colaborar`,
`contacto`) se crean junto con su página en la Fase 2B; no se crean carpetas vacías.

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
no se puede esquivar con una ruta relativa. **Única excepción:** `src/app/routes.ts`, que React Router evalúa en
Node fuera de Vite (donde el alias no existe) y lleva un `eslint-disable` explicado.

Se hacen cumplir con `no-restricted-imports` en [`eslint.config.js`](../eslint.config.js) (sin plugins extra).
`pnpm lint` falla si se rompe una regla, tanto en local como en CI.

Si una feature necesita algo de otra, ese algo es `shared` (súbelo) o se compone en `pages`.

## Rutas e idioma

- Español **sin prefijo** (`/`, `/nosotros/`); inglés con prefijo `/en/` (`/en/`, `/en/about/`).
- **Nunca** se sirve lo mismo en `/` y `/es`: `/es` no existe.
- El idioma sale **solo de la URL** (`langFromPath`). No hay `localStorage`, `navigator` ni redirecciones
  automáticas por idioma del navegador.
- **Política de URLs: todas terminan en barra final** (`/en/`, no `/en`). Es la URL que se sirve (`en/index.html`)
  y la que usan `canonical`, `hreflang`, `og:url` y los enlaces internos.
- La **tabla de rutas** (`src/shared/i18n/routes.ts`) es la única fuente: clave de página y un slug por idioma.
  De ella salen el registro de rutas (`app/routes.ts`), la lista de prerender (`react-router.config.ts`), el
  selector de idioma y la cabecera del documento. Hoy solo está `home`; las demás filas son la propuesta de la 2B:

| Clave           | Español           | Inglés              | Estado    |
| --------------- | ----------------- | ------------------- | --------- |
| `home`          | `/`               | `/en/`              | activa    |
| `nosotros`      | `/nosotros/`      | `/en/about/`        | propuesta |
| `proyectos`     | `/proyectos/`     | `/en/projects/`     | propuesta |
| `transparencia` | `/transparencia/` | `/en/transparency/` | propuesta |
| `colaborar`     | `/colaborar/`     | `/en/collaborate/`  | propuesta |
| `contacto`      | `/contacto/`      | `/en/contact/`      | propuesta |

- **SEO bilingüe.** Cada página lleva `<html lang>` correcto, `<title>`, `meta description`, `canonical`,
  `hreflang` (`es`, `en` y `x-default` hacia la versión en español) y `og:locale`. Los textos salen de
  `content/{es,en}/meta.ts`. Las URL son absolutas si se define `VITE_SITE_URL` y relativas a la raíz si no.
- **Selector de idioma.** `LangSwitch` es un enlace (`<a hreflang>`) a la misma página en el otro idioma. Conserva
  el aspecto del interruptor ES | EN y el punto de lectura (`preventScrollReset`). Navega en cliente, sin recargar.
- **Netlify y la barra final.** Se espera que Netlify redirija `/en` a `/en/` (301) cuando existe `en/index.html`.
  No se añade una regla propia (puede provocar un bucle). **No verificado:** comprobar `curl -I <previsualización>/en`
  en el primer despliegue y, si no redirige, añadir la regla entonces.

## Contenido

- `src/content/{es,en}/<dominio>.ts`: **`es` es la fuente de verdad y define el tipo**; `en` debe satisfacerlo
  (una clave que falte rompe `pnpm typecheck`). Sin librería de i18n: con dos idiomas y textos estáticos bastan
  diccionarios tipados.
- `content/{es,en}/meta.ts` contiene los metadatos del documento por página (`meta.pages.<clave>`). `DocumentHead`
  indexa con `RouteKey`: añadir una ruta sin sus metadatos rompe el typecheck.

## Cómo añadir una página (Fase 2B en adelante)

1. Si tiene contenido propio, crea la feature (ver abajo) y su contenido.
2. Crea `src/pages/<Nombre>Page.tsx`: un componente que solo ensambla secciones de `features/*` y `shared/*`.
3. Crea su módulo de ruta `src/app/routes/<nombre>.tsx` (un componente que renderiza la página).
4. Añade la fila en `ROUTES` (`src/shared/i18n/routes.ts`) con su slug en español y en inglés (con barra final) y
   regístrala en `MODULES` (`src/app/routes.ts`). El prerender y los enlaces de idioma la recogen solos.
5. Añade `meta.pages.<clave>` (título y descripción) en `content/es/meta.ts` y `content/en/meta.ts`.
6. Ejecuta `pnpm check`.

## Cómo añadir una feature

1. Crea `src/features/<dominio>/components/`.
2. Crea su contenido: `src/content/es/<dominio>.ts` (define el tipo) y `src/content/en/<dominio>.ts`
   (`satisfies typeof es<Dominio>`). Súmalos en `src/content/{es,en}/index.ts`.
3. **Registra la feature en `eslint.config.js`** (constante `FEATURES`) para que se aplique la regla «una feature
   no importa de otra».
4. Escribe una prueba de humo `src/features/<dominio>/<dominio>.test.tsx` con `renderAt` (`test/render.tsx`):
   render sin errores y cambio de idioma.

## Estado y datos

No hace falta librería de estado global.

| Estado                       | Dónde vive                                                   |
| ---------------------------- | ------------------------------------------------------------ |
| Idioma                       | La URL; `LangFromUrl` lo entrega por contexto                |
| Intro (fase, saltar)         | `IntroProvider` en `shared/intro`, montado en `app/root.tsx` |
| Menú abierto, sección activa | Estado local de `SideNav`                                    |
| Carrusel (índice, pausa)     | Estado local del carrusel                                    |

## Estilos

Tailwind v4 con `@theme` en `src/shared/styles/index.css` es la fuente de verdad de los tokens. Hoy conviven dos
paletas (Huito y achiote, y las variables del hero/intro); **su consolidación va en la Fase 4**. Los estilos
globales de elementos (`body`, `p`…) van dentro de `@layer base` para no pisar las utilidades. Tailwind no
escanea `docs/` ni los `.md` (`@source not`).

## Prerender: reglas del código

React Router renderiza `root.tsx` y cada ruta **en Node al construir**, donde no existen `window`, `document`,
`sessionStorage`, `localStorage`, `navigator` ni `matchMedia`. Reglas:

- **Nada de esas APIs durante el render.** Solo dentro de efectos (`useEffect`/`useLayoutEffect`) o manejadores.
  El primer render del cliente debe producir exactamente el mismo HTML que el servidor (si no, React avisa de un
  desajuste de hidratación). Patrón: valor neutro en el render y valor real en un efecto
  (`useViewportHeight`, el carrusel, `IntroProvider`).
- **El HTML estático debe verse y usarse completo sin JavaScript**: nada de `inert` ni `aria-hidden` en el
  contenido (el único `inert` es el del menú lateral cerrado, que necesita JS para abrirse).

### El intro

Requisitos y cómo se cumplen:

| Requisito                                               | Solución                                                                                                                                                                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visitante nuevo: intro sin parpadeo previo del hero     | Un script mínimo y bloqueante en `<head>` (`shared/intro/boot-script.ts`) marca `<html data-intro="active">` **antes del primer pintado**. El CSS oculta los elementos del hero y muestra el overlay (`[data-intro='active'] .intro-root`). |
| Ya visto en la sesión, o movimiento reducido: sin intro | El script no marca nada; el CSS no muestra el overlay. Tras hidratar, `IntroProvider` confirma la misma decisión y retira el overlay del DOM.                                                                                               |
| El HTML estático no es `inert` ni `aria-hidden`         | En el servidor y en el primer render del cliente la fase es `done` y `ready` es `false`. El overlay va en el HTML, pero con `display: none` por defecto.                                                                                    |
| Sin advertencias de hidratación                         | Servidor y primer render del cliente son idénticos; la decisión (`sessionStorage`, `matchMedia`) se toma en un `useLayoutEffect`, antes de pintar. `<html suppressHydrationWarning>` cubre el atributo `data-intro` que añade el script.    |

Elegí un script en `<head>` y no solo un efecto de React porque el efecto corre después de hidratar, cuando el
visitante ya vio el hero: es la única forma de decidir antes del primer pintado con HTML estático. Red de
seguridad: si a los 10 s el cliente no hidrató, el script retira `data-intro` para no dejar al visitante bajo el
overlay.

## Variables de entorno

Se leen en un solo lugar, `src/env.ts` (tipadas en `src/vite-env.d.ts`); ver `.env.example`.

| Variable              | Para qué                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `VITE_SITE_INDEXABLE` | **Interruptor único** de indexación: `<meta name="robots">` (React) y `robots.txt` (build) |
| `VITE_SITE_URL`       | Origen público (sin barra final) para `canonical`, `hreflang` y `og:url` absolutos         |
| `PORT`                | Puerto de `pnpm dev` (8443) y de `pnpm preview` (4173)                                     |

## Indexación

Hoy el sitio **no es indexable**: `robots.txt` con `Disallow: /` y `<meta name="robots" content="noindex,
nofollow">`, ambos gobernados por `VITE_SITE_INDEXABLE` ([ADR 0007](./adr/0007-indexacion.md)). Además,
`netlify.toml` añade `X-Robots-Tag: noindex` a las previsualizaciones. Se revisa en la Fase 6.

## Build, salida y hosting

- `pnpm build` ejecuta `react-router build` y escribe en **`build/client`** (se publica) y `build/server` (no se
  publica). Cada ruta es `ruta/index.html`; también se genera `__spa-fallback.html`, que **no se usa**.
- `netlify.toml`: `publish = "build/client"`; cabeceras de caché largas para `/assets`, `/video`, `/slider` y
  `/branding`; `X-Robots-Tag` en previsualizaciones.
- **Node:** la versión vive en un único archivo, `.node-version` (≥ 22.22, requisito de React Router 8), que leen
  Netlify, mise y GitHub Actions (`node-version-file`); `engines` en `package.json` lo refuerza.
- `pnpm preview` sirve `build/client` imitando a Netlify (carpeta sin barra → 301; ruta inexistente → 404, sin
  fallback SPA).

### La página 404 (Fase 2B)

Objetivo: **estado 404 real, sin JavaScript**. Netlify sirve `404.html` con estado 404 para toda ruta que no
existe, sin reglas. Detalle importante: **el prerender de React Router falla si una ruta responde distinto de 200**
(«Received a 404 status code…»), así que la 404 no puede prerenderizarse devolviendo 404. Plan: registrar una ruta
normal (p. ej. `/404/`, que devuelve 200), prerenderizarla y **copiar** `build/client/404/index.html` a
`build/client/404.html` en un paso posterior al build (con `noindex` en esa página). **No** se añade la regla
`/* → /__spa-fallback.html`: respondería 200 a URL inexistentes (soft-404).

### Figma Make deja de ser el entorno de ejecución

Las decisiones de renderizado ([ADR 0001](./adr/0001-renderizado.md)) y de separar Figma
([ADR 0006](./adr/0006-figma-make.md)) tienen dos consecuencias:

1. **Figma Make ya no ejecuta el proyecto.** Desarrollo, pruebas y despliegue son pnpm, GitHub Actions y Netlify.
   `.figma/` se conserva intacta, pero sus scripts (`.figma/make/deploy` usa `--build-dir dist`) ya no encajan
   con la salida `build/client`.
2. **La carpeta de salida cambió de `dist/` a `build/client`.** `netlify.toml` ya la refleja.

Los plugins exclusivos de Figma están en `config/vite-plugins/figma.ts` y se cargan solo si hay variables
`FIGMA_*` o `USE_FIGMA_PLUGINS=true`; no se han probado con React Router.

## Calidad automatizada

| Herramienta                       | Para qué                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `react-router typegen` + `tsc`    | Tipos estrictos (`noUnused*`, `noUncheckedIndexedAccess`) y tipos de rutas   |
| ESLint (flat) + typescript-eslint | Calidad; límites de capas; `jsx-a11y`; globals de Node solo en configuración |
| oxfmt                             | Formato (`.oxfmtrc.json`: comillas simples, sin `;`, 120 cols)               |
| Vitest + Testing Library          | Pruebas unitarias y de humo por feature (`renderAt` da router e idioma)      |
| `pnpm verify:build`               | Revisa el HTML generado de cada ruta (`test/post-build`)                     |
| husky + lint-staged               | Formato y ESLint sobre lo que se va a commitear                              |
| GitHub Actions                    | typecheck, lint, formato, pruebas, build y verify:build en cada PR           |
| Playwright                        | Solo `scripts/capture.mjs` (capturas para comparar visualmente); no es suite |

`.react-router/` (tipos generados) está en `.gitignore` y se incluye en `tsconfig` como indica la documentación.
