# Arquitectura

Principio rector: **arquitectura proporcional**. Cada carpeta, librería o regla existe por un problema real de este
proyecto (un solo desarrollador, sitio estático, contenido mayormente fijo, bilingüe). Lo que no se justifica, no
se añade. Las decisiones y sus alternativas descartadas están en [`docs/adr/`](./adr).

## Estado actual (Fase 2B)

Sitio estático generado con **React Router 8.5.1 en modo framework** (`ssr: false` + `prerender`), sobre Vite 8,
React 19.3 y Tailwind v4. Seis páginas en dos idiomas (inicio, nosotros, proyectos, transparencia, colaborar y
contacto) más la 404; el build escribe un HTML por ruta en `build/client` y en el navegador React hidrata ese HTML.
Todos los enlaces internos salen de la tabla de rutas.

## Estructura

```
src/
  app/              raíz de la aplicación (React Router)
    root.tsx          documento HTML de todas las rutas (Layout) + proveedores
    routes.ts         registro de rutas, generado desde la tabla de rutas
    routes/           un módulo por página (home, nosotros, proyectos, transparencia, colaborar, contacto, not-found)
    DocumentHead.tsx  <title>, descripción, robots, canonical, hreflang, Open Graph
    ErrorBoundary.tsx pantalla de respaldo accesible
    layout/           RootLayout (<main id="contenido">), Intro (overlay), SideNav, Footer (global), FocusOnNavigate
  pages/            un componente por página; solo ensambla secciones
  features/         un dominio por carpeta (hoy: home, nosotros, transparencia)
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
scripts/            preview.mjs (sirve build/client como Netlify), finalize-build.mjs (404.html), capture.mjs (capturas)
                    y measure-intro.mjs (mide la duración del intro)
docs/               esta documentación, ADR y problemas conocidos
test/               render con router, preparación común y verificación posterior al build (post-build/)
e2e/                pruebas de extremo a extremo con Playwright (menú, idioma, 404, intro)
```

Solo existen las features que tienen contenido propio. `proyectos`, `colaborar` y `contacto` no tienen feature:
sus páginas reutilizan secciones existentes (`Proyecto` y `Colaborar` de `home`, con `asPage`) o componentes de `shared/ui`.
No se crean carpetas vacías.

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
  selector de idioma, la cabecera del documento y **todos los enlaces internos** (`pathFor`, `useNav`, `usePathFor`):

| Clave           | Español           | Inglés              |
| --------------- | ----------------- | ------------------- |
| `home`          | `/`               | `/en/`              |
| `nosotros`      | `/nosotros/`      | `/en/about/`        |
| `proyectos`     | `/proyectos/`     | `/en/projects/`     |
| `transparencia` | `/transparencia/` | `/en/transparency/` |
| `colaborar`     | `/colaborar/`     | `/en/collaborate/`  |
| `contacto`      | `/contacto/`      | `/en/contact/`      |
| 404 (`NOT_FOUND`) | `/404/` → `404.html` | `/en/404/` → `en/404.html` |

  `NAV_KEYS` fija las páginas del menú, de «Explora» y del pie (en ese orden, igual que `common.nav`). «Colaborar»
  cubre «Donaciones / Alianzas». Ningún enlace interno es un `<a href="#ancla">` sin destino: un test los recorre todos.
- **Anclas.** Los `id` de las anclas son **los mismos en español e inglés** (`#historia`, `#direccionamiento`,
  `#liderazgo`, `#equipo`, `#marco-legal`) porque el selector de idioma conserva el hash
  (`/nosotros/#historia` ↔ `/en/about/#historia`). Al añadir un ancla, el `id` no se traduce.
- **Navegación en el cliente.** Los enlaces internos son `<Link>` de React Router (sin recargar). Al navegar, el
  foco pasa al `<h1>` de la página (o al elemento del hash) con `FocusOnNavigate`; `ScrollRestoration` sube al
  inicio o baja al ancla, y `scroll-mt-20` en las secciones deja el destino bajo el encabezado fijo. El salto de
  contenido apunta a `<main id="contenido">`, que existe en todas las páginas.
- **Encabezado.** Transparente solo sobre el hero de la portada; en las demás páginas tiene el mismo fondo sólido
  que aparece al hacer scroll.
- **Pie global** (`app/layout/Footer.tsx`): enlaces reales a todas las páginas, así que sin JavaScript basta para
  recorrer el sitio. «Aviso legal» y «Política de privacidad» no se muestran hasta que exista su contenido; las redes
  (`common.footer.socials`, lista `{name, url}`) tampoco mientras la lista esté vacía.
- **Páginas con contenido por llegar** (`proyectos`, `colaborar`, `contacto`): título, el texto que ya existe y
  `SoonNotice` («Esta sección estará disponible pronto» + enlace a la portada). Ningún botón apunta a la página en la
  que está (un test lo comprueba).

- **SEO bilingüe.** Cada página lleva `<html lang>` correcto, `<title>`, `meta description`, `canonical`,
  `hreflang` (`es`, `en` y `x-default` hacia la versión en español) y `og:locale`. Los textos salen de
  `content/{es,en}/meta.ts`. Las URL son absolutas si se define `VITE_SITE_URL` y relativas a la raíz si no.
- **Selector de idioma.** `LangSwitch` es un enlace (`<a hreflang>`) a la misma página en el otro idioma, **conservando
  el hash** (`alternatePath`). Conserva el aspecto del interruptor ES | EN y el punto de lectura (`preventScrollReset`).
  Navega en cliente, sin recargar. En una URL que no es una página (la 404) lleva a la 404 del otro idioma.
- **Netlify y la barra final.** Se espera que Netlify redirija `/en` a `/en/` (301) cuando existe `en/index.html`.
  No se añade una regla propia (puede provocar un bucle). **No verificado:** comprobar `curl -I <previsualización>/en`
  en el primer despliegue y, si no redirige, añadir la regla entonces.

## Contenido

- `src/content/{es,en}/<dominio>.ts`: **`es` es la fuente de verdad y define el tipo**; `en` debe satisfacerlo
  (una clave que falte rompe `pnpm typecheck`). Sin librería de i18n: con dos idiomas y textos estáticos bastan
  diccionarios tipados.
- **Un espacio de nombres por dominio:** `t.common.*`, `t.home.*`, `t.nosotros.*`, `t.transparencia.*`, `t.meta.*`
  (`content/{es,en}/index.ts`). Una clave repetida entre dominios no se sobrescribe en silencio.
- `content/{es,en}/meta.ts` contiene los metadatos del documento por página (`meta.pages.<clave>`) y el título de la
  404. Las descripciones **se derivan de textos que ya existen** (mismas claves, sin copiarlos); las dos que se recortan
  para no pasar de 160 caracteres usan `cut`. `DocumentHead` indexa con `RouteKey`: añadir una ruta sin sus metadatos
  rompe el typecheck. Una URL que no es una página es la 404: `noindex`, sin canonical ni hreflang.
- Documentos legales: `{ name, url? }`. Sin `url` se muestran como texto («Documento por cargar»), sin enlace ni icono;
  con `url` pasan a ser un enlace de descarga.

## Cómo añadir una página

Ejemplo real: la página **Contacto** (`/contacto/` · `/en/contact/`).

1. Si tiene contenido propio, crea la feature (ver abajo); `contacto` no la tiene todavía.
2. `src/pages/ContactoPage.tsx`: ensambla secciones de `features/*` y `shared/*` (aquí `PageIntro` + `SoonNotice`).
   La página no pone `<main>` (lo pone `RootLayout`) y su único `<h1>` es el título.
3. `src/app/routes/contacto.tsx`: el módulo de ruta, que renderiza la página.
4. Fila en `ROUTES` (`src/shared/i18n/routes.ts`) con el slug en español y en inglés (con barra final), la clave en
   `MODULES` (`src/app/routes.ts`) y, si va en el menú, en `NAV_KEYS` (con su entrada en `common.nav`).
5. `meta.pages.contacto` (título y descripción) en `content/es/meta.ts` y `content/en/meta.ts`. El typecheck lo exige.
6. Añádela al mapa de páginas de `src/app/site.test.tsx` y a `h1Of` de `test/post-build/verify-build.test.ts`.
7. `pnpm check`: tabla de rutas, enlaces, anclas, h1 único, HTML generado y extremo a extremo.

## Cómo añadir una feature

1. Crea `src/features/<dominio>/components/`. ESLint **lee las carpetas de `src/features`** para aplicar la regla «una
   feature no importa de otra»: no hay que registrarla a mano.
2. Crea su contenido: `src/content/es/<dominio>.ts` (define el tipo) y `src/content/en/<dominio>.ts`
   (`satisfies typeof es<Dominio>`). Súmalos en `src/content/{es,en}/index.ts` (nuevo espacio de nombres).
3. Escribe una prueba de humo `src/features/<dominio>/<dominio>.test.tsx` con `renderAt` (`test/render.tsx`).

## Estado y datos

No hace falta librería de estado global.

| Estado                       | Dónde vive                                                   |
| ---------------------------- | ------------------------------------------------------------ |
| Idioma                       | La URL; `LangFromUrl` lo entrega por contexto                |
| Intro (fase, saltar)         | `IntroProvider` en `shared/intro`, montado en `app/root.tsx` |
| Menú abierto                 | Estado local de `SideNav` (la página activa sale de la URL)  |
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
| Visitante nuevo **en la portada**: intro sin parpadeo previo del hero | Un script mínimo y bloqueante en `<head>` (`shared/intro/boot-script.ts`) marca `<html data-intro="active">` **antes del primer pintado**. El CSS oculta los elementos del hero y muestra el overlay (`[data-intro='active'] .intro-root`). |
| Solo si la sesión **empieza** en la portada (`/` o `/en/`) | Si la primera página es otra (`/nosotros/`, una 404…), el script y `IntroProvider` marcan el intro como visto: al llegar luego a la portada no se muestra. Ambos usan `isHomePath` / la misma lista de rutas. |
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

### La página 404

**Estado 404 real, sin JavaScript.** Netlify sirve `404.html` con estado 404 para toda ruta que no existe, sin reglas.
**El prerender de React Router falla si una ruta responde distinto de 200** («Received a 404 status code…»), así que la
404 no puede prerenderizarse devolviendo 404. Cómo se resuelve:

1. Una ruta comodín `*` (`app/routes/not-found.tsx`) muestra `NotFoundPage` en cualquier URL desconocida (el cliente
   la hidrata con la URL real, p. ej. `/foo/`).
2. Se prerenderiza en `/404/` y `/en/404/` (`NOT_FOUND`, que responden 200 durante el build).
3. `scripts/finalize-build.mjs` (encadenado en `pnpm build`) mueve esos HTML a `build/client/404.html` y
   `build/client/en/404.html` y borra las carpetas `404/`: `/404/` tampoco debe responder 200.
4. `netlify.toml` añade `/en/* → /en/404.html` con estado 404 (según la documentación de Netlify, un archivo existente
   tiene prioridad, así que no afecta a `/en/` ni a `/en/about/`). **No verificado en Netlify.** `pnpm preview` la imita.
5. La 404 lleva `noindex`, sin canonical ni hreflang, y enlaza a la portada, a las páginas principales y a la 404
   del otro idioma.

**No** se añade la regla `/* → /__spa-fallback.html`: respondería 200 a URL inexistentes (soft-404).

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
| Vitest + Testing Library          | Humo por página e idioma, enlaces y anclas (`src/app/site.test.tsx`), intro  |
| `pnpm verify:build`               | HTML generado: lang, h1, title, canonical, hreflang de cada ruta y la 404    |
| `pnpm test:e2e`                   | Playwright: menú ES/EN, idioma, 404 con estado real, intro (`e2e/`)          |
| husky + lint-staged               | Formato y ESLint sobre lo que se va a commitear                              |
| GitHub Actions                    | typecheck, lint, formato, pruebas, build, verify:build y e2e en cada PR      |
| Playwright                        | `e2e/` (suite corta) y `scripts/capture.mjs` / `measure-intro.mjs`           |

`.react-router/` (tipos generados) está en `.gitignore` y se incluye en `tsconfig` como indica la documentación.
