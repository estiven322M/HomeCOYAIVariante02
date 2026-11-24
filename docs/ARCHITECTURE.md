# Arquitectura

Principio rector: **arquitectura proporcional**. Cada carpeta, librería o regla existe por un problema real de este
proyecto (un solo desarrollador, sitio estático, contenido mayormente fijo, bilingüe). Lo que no se justifica, no
se añade. Las decisiones y sus alternativas descartadas están en [`docs/adr/`](./adr).

## Estado actual (Fase 3)

Sitio estático generado con **React Router 8.5.1 en modo framework** (`ssr: false` + `prerender`), sobre Vite 8,
React 19.3 y Tailwind v4. Ocho páginas en dos idiomas (inicio, nosotros, proyectos, salud, eventos, galería,
colaborar y contacto) más la 404; el build escribe un HTML por ruta en `build/client` y en el navegador React hidrata ese HTML.
Todos los enlaces internos salen de la tabla de rutas.

## Estructura

```
src/
  app/              raíz de la aplicación (React Router)
    root.tsx          documento HTML de todas las rutas (Layout) + proveedores
    routes.ts         registro de rutas, generado desde la tabla de rutas
    routes/           un módulo por página (home, nosotros, proyectos, salud, eventos, galeria, colaborar, contacto, not-found)
    DocumentHead.tsx  <title>, descripción, robots, canonical, hreflang, Open Graph
    ErrorBoundary.tsx pantalla de respaldo accesible
    layout/           RootLayout (<main id="contenido">), Intro (overlay), SideNav, Footer (global), FocusOnNavigate
  pages/            un componente por página; solo ensambla secciones
  features/         un dominio por carpeta (hoy: home, nosotros, proyectos, salud)
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
scripts/            preview.mjs (sirve build/client como Netlify), finalize-build.mjs (404.html), capture.mjs (capturas),
                    measure-intro.mjs (mide la duración del intro) e images.mjs (`pnpm images`: derivados optimizados)
assets-src/         originales de las imágenes que no están ya en `public/` (entrada de `pnpm images`)
docs/               esta documentación, ADR y problemas conocidos
test/               render con router, preparación común y verificación posterior al build (post-build/)
e2e/                pruebas de extremo a extremo con Playwright (menú, idioma, 404, intro)
```

Solo existen las features que tienen contenido propio. `eventos`, `galeria`, `colaborar` y `contacto` no tienen feature:
sus páginas reutilizan secciones existentes (`Colaborar` de `home`, con `asPage`) o componentes de `shared/ui`.
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

| Clave             | Español                          | Inglés                                 |
| ----------------- | -------------------------------- | -------------------------------------- |
| `home`            | `/`                              | `/en/`                                 |
| `nosotros`        | `/nosotros/`                     | `/en/about/`                           |
| `proyectos`       | `/proyectos/`                    | `/en/projects/`                        |
| `salud`           | `/salud-y-medicina-tradicional/` | `/en/health-and-traditional-medicine/` |
| `eventos`         | `/eventos/`                      | `/en/events/`                          |
| `galeria`         | `/galeria/`                      | `/en/gallery/`                         |
| `colaborar`       | `/colaborar/`                    | `/en/collaborate/`                     |
| `contacto`        | `/contacto/`                     | `/en/contact/`                         |
| `privacidad`      | `/privacidad/`                   | `/en/privacy/`                         |
| `gracias`         | `/gracias/`                      | `/en/thank-you/`                       |
| 404 (`NOT_FOUND`) | `/404/` → `404.html`             | `/en/404/` → `en/404.html`             |

`privacidad` y `gracias` están en `ROUTES` pero **no** en `NAV_KEYS` (ni en el menú, «Explora» o el pie) y siempre llevan `noindex`
(`NOINDEX_ROUTES`).

`NAV_KEYS` fija las páginas del menú, de «Explora» y del pie (en ese orden, igual que `common.nav`): Nosotros, Proyectos,
Salud y medicina tradicional, Eventos, Galería, Donaciones / Alianzas y Contacto. El menú lateral con 7 entradas cabe sin
scroll en 1280×720 y se desplaza (`overflow-y-auto`) en pantallas bajas; una e2e lo comprueba. «Colaborar»
cubre «Donaciones / Alianzas». Ningún enlace interno es un `<a href="#ancla">` sin destino: un test los recorre todos.

- **Anclas.** Los `id` de las anclas son **los mismos en español e inglés** (Nosotros: `#historia`, `#mision`,
  `#valores`, `#equipo`) porque el selector de idioma conserva el hash
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
- **Páginas con contenido por llegar** (`colaborar`; y `eventos`, `galeria` y `contacto`, que solo
  tienen `ProvisionalPage`: su nombre y descripción de `common.nav` como título y entradilla): título, el texto que ya
  existe y `SoonNotice` («Esta sección estará disponible pronto» + enlace a la portada). Ningún botón apunta a la página en la
  que está (un test lo comprueba).

- **SEO bilingüe.** Cada página lleva `<html lang>` correcto, `<title>`, `meta description`, `canonical`,
  `hreflang` (`es`, `en` y `x-default` hacia la versión en español) y `og:locale`. Los textos salen de
  `content/{es,en}/meta.ts`. Las URL son absolutas si se define `VITE_SITE_URL` y relativas a la raíz si no.
- **Selector de idioma.** `LangSwitch` es un enlace (`<a hreflang>`) a la misma página en el otro idioma, **conservando
  el hash** (`alternatePath`). Conserva el aspecto del interruptor ES | EN y el punto de lectura (`preventScrollReset`).
  Navega en cliente, sin recargar. En una URL que no es una página (la 404) lleva a la **portada** del otro idioma (igual que el enlace «Read in English» de la 404).
- **Netlify y la barra final.** Netlify redirige `/en` a `/en/` (301) porque existe `en/index.html`; verificado con
  `curl -I` (2026-11-22). No hace falta una regla propia (puede provocar un bucle).

## Contenido

- `src/content/{es,en}/<dominio>.ts`: **`es` es la fuente de verdad y define el tipo**; `en` debe satisfacerlo
  (una clave que falte rompe `pnpm typecheck`). Sin librería de i18n: con dos idiomas y textos estáticos bastan
  diccionarios tipados.
- **Un espacio de nombres por dominio:** `t.common.*`, `t.home.*`, `t.nosotros.*`, `t.meta.*`
  (`content/{es,en}/index.ts`). Una clave repetida entre dominios no se sobrescribe en silencio.
- `content/{es,en}/meta.ts` contiene los metadatos del documento por página (`meta.pages.<clave>`) y el título de la 404. Las descripciones **se derivan de textos que ya existen** (mismas claves, sin copiarlos); las dos que se recortan
  para no pasar de 160 caracteres usan `cut`. `DocumentHead` indexa con `RouteKey`: añadir una ruta sin sus metadatos
  rompe el typecheck. Una URL que no es una página es la 404: `noindex`, sin canonical ni hreflang.

## Cómo añadir una página

Ejemplo real: la página **Contacto** (`/contacto/` · `/en/contact/`).

1. Si tiene contenido propio, crea la feature (ver abajo); `contacto` no la tiene todavía.
2. `src/pages/ContactoPage.tsx`: ensambla secciones de `features/*` y `shared/*` (aquí `ProvisionalPage`, que es `PageIntro` + `SoonNotice`; Salud, Eventos y Galería son iguales).
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

## Página Nosotros (Fase 3)

`features/nosotros/components/`: un componente por bloque (`NosotrosHero`, `SectionNav`, `Historia`,
`MisionVision`, `Valores`, `Equipo`) ensamblados por `Nosotros.tsx`. Piezas reutilizables
nuevas en `shared/ui`: `SubTitle` con numeración (`n="01"`) y
`PatternZone` (patrón lateral; ver «Patrón lateral» más abajo).

- **Anclas** (iguales en es y en): `#historia`, `#mision`, `#valores`, `#equipo`. El marco legal se retiró del sitio por decisión de los stakeholders (su texto queda en el historial de git).
- **Barra interna** (`SectionNav`): `<nav>` con enlaces `<a href="#id">` (no pestañas: todas las secciones están visibles).
  Fija bajo el encabezado desde `md` (`top: var(--header-h)`), en el flujo y desplazable en móvil con un velo en el borde
  derecho. Marca la sección actual con `aria-current="location"` (IntersectionObserver en un efecto; el HTML estático no
  marca ninguna). `--header-h` y `--sectionnav-h` (`index.css`) deben coincidir con el alto real del encabezado y de la
  barra; `.anchor-section` los usa en `scroll-margin-top` (una e2e lo comprueba).
- **Patrón lateral**: en Nosotros hay una zona, Historia–Misión–Valores (el bloque oscuro de Equipo
  queda fuera y cierra la página, separado del pie por una línea ocre). La barra interna fija no lleva patrón.
- **Hero**: la foto es la imagen principal (`fetchPriority="high"`, sin lazy, `srcset`/`sizes`); React emite su preload en
  el `<head>` a partir del propio `<img>` (no se declara aparte, para que no diverjan). Los velos de `index.css`
  (`.page-hero-velo-*`, en `PageHero`) mantienen el contraste AA del texto en todos los anchos (medido sobre la foto).
- **Valores**: siete tarjetas sin numeración ni imagen, en rejilla de 1 → 2 → 4 columnas; desde 520 px la última ocupa
  dos columnas, así que no queda ninguna celda vacía (2 columnas: 4.ª fila; 4 columnas: 2.ª fila = 1 + 1 + 2).
- **Retratos de la junta**: tres integrantes con iniciales (`members[].initials`) en un tono neutro, `aria-hidden` (el nombre
  va al lado). Avatar en fila hasta `md`; desde `md`, rejilla de 3 columnas sin huecos. Cuando haya fotos, se añaden a
  `members` y a `Portrait` (con derivados de `pnpm images`).
- **Imágenes**: derivados de `pnpm images` en `public/nosotros/` (hero, río Putumayo y el Taita). Las tarjetas de Misión y
  Visión no llevan foto; solo el rombo ocre decorativo que las une.

## Patrón lateral (`PatternZone`)

Franjas con el patrón geométrico de Figma en los márgenes de las **zonas de fondo claro** (arena, arena clara, cálido,
crema). Una sola pieza: `shared/ui/PatternZone.tsx`; los estilos (`.patron-lateral`, que usa el azulejo
`shared/styles/patron-lateral.svg` como máscara con `-webkit-mask-image`) y el color (`--color-patron`) están en
`shared/styles/index.css`.

**Activarlo en una sección nueva** (explícito, nunca automático):

```tsx
import { PatternZone } from '@/shared/ui/PatternZone'

// Una sección clara: la propia sección es la zona.
<PatternZone as="section" id="x" className="bg-crema px-6 py-28">…</PatternZone>

// Varias secciones claras consecutivas (aunque tengan fondos distintos): una sola zona, franjas continuas.
<PatternZone>
  <SeccionClara1 />
  <SeccionClara2 />
</PatternZone>
```

Reglas: **solo** sobre fondos claros; una sección oscura (huito, noche, chagra), una foto, el hero o el degradado de
transición del hero de Inicio quedan **fuera** de la zona (dos zonas separadas si hay una oscura en medio). La zona
cubre su contenedor entero, sin fundido vertical y sin fondo propio (deja ver el de cada sección). Solo desde 1280 px
(`xl`), en el margen (≥ 64 px frente a 40 px de franja), con el contenido en `max-w-6xl`, `aria-hidden`, sin eventos de
puntero y oculto al imprimir. Queda por debajo de la barra interna fija (`z-20`) y del encabezado (`z-50`).
Una e2e («patrón lateral») lo comprueba en todas las páginas a 1280, 1440 y 1920 px.

Dónde está hoy: Nosotros (Historia–Misión–Valores), Inicio («¿Qué es ÉCOYAI?» y «Explora»),
y el aviso `SoonNotice` de Proyectos, Salud, Eventos, Galería, Colaborar y Contacto. La 404 es toda oscura y no
lleva patrón.

## Texto justificado (`justificado`)

Clase explícita (`@utility justificado` en `shared/styles/index.css`): `text-align: justify`, `hyphens: auto`,
`hyphenate-limit-chars: 10 5 5` (con el prefijo `-webkit-` para Safari: solo parte palabras de 10 o más letras, con al
menos 5 a cada lado; en la prueba visual salen ~1 corte cada 4–5 líneas) y `text-wrap: pretty`, **solo desde `md`**; por debajo
(móvil) el texto queda a la izquierda. El guionado usa el `lang` de cada página (es/en). **No es una regla global sobre `p`**
(esa regla desalineó el eyebrow de Colaborar); un test (`shared/styles/justificado.test.ts`) falla si el justificado aparece
fuera de la utilidad.

**Cómo se aplica:** con el componente `<TextoCorrido className="…">{texto}</TextoCorrido>` (`shared/ui/TextoCorrido.tsx`), que
pone la clase y **envuelve los nombres propios en `<span class="hyphens-none">`** al renderizar, para que nunca se partan
(Victoriano, Piaguaje, Yaiguaje, ÉCOYAI, Asëcoyai, Zio Bain, Putumayo, Siona, Mocoa; lista `NOMBRES_PROPIOS`). Los textos de
`src/content` quedan limpios, sin marcas. Un nombre nuevo se añade a esa lista.

**Qué textos la llevan** (solo párrafos de texto corrido con medida suficiente): los párrafos de cuerpo de Historia (no su
primer párrafo, la entradilla grande en serif: a ese tamaño deja espacios amplios), las descripciones de Misión y Visión, el
párrafo largo de «¿Qué es ÉCOYAI?» y el texto de Proyecto de Inicio. Nunca en: títulos, etiquetas o eyebrows, entradillas
destacadas en serif, citas (el banner del propósito), pies de foto, botones, enlaces, insignias, textos centrados (Colaborar),
el hero ni tarjetas estrechas donde se verían huecos (Valores, perfiles de la junta, texto del Taita, la frase corta de
«¿Qué es ÉCOYAI?»). Si los stakeholders lo piden también en móvil, basta quitar el `@media` de la utilidad.

## Página Salud y medicina tradicional

`features/salud/components/`: `Salud.tsx` ensambla `PageHero` (de `shared/ui`, el mismo hero que Nosotros, con
`size="long"` para el título largo), `Llamado`, `Practicas`, `Cuidados` + `Protocolo` (una sola zona con patrón lateral) y
`Solicitar`. Contenido: `t.salud` (`content/{es,en}/salud.ts`); el protocolo de preparación y salud lo valida la
organización antes de publicar. Sin textos entre corchetes (un test lo impide).

- **Acordeón de prácticas** (`Practicas`, sobre `shared/ui/Disclosure`): siempre una sola abierta (la primera al cargar, también en
  móvil); la abierta no se puede cerrar (`aria-disabled`, patrón de WAI-ARIA) y lleva un rombo de estado en vez de «−». Toda la
  fila es el botón (≥ 44 px, `aria-expanded`, `aria-controls`). En escritorio la imagen y su pie (texto normal) van a un lado y
  cambian con un fundido (sin transición con movimiento reducido); en móvil la imagen va dentro del panel abierto.
  **Sin JavaScript todas las prácticas salen abiertas** con su imagen: el HTML y el primer render del cliente usan `'all'` y
  un `useLayoutEffect` pasa a una sola abierta antes de pintar (mismo patrón que el intro). El **protocolo** es un acordeón
  que se puede cerrar y sale abierto sin JavaScript.
- **Justificado:** solo los dos párrafos de «El llamado» (`TextoCorrido`); Seguridad, prácticas y protocolo van a la izquierda.
- **Imágenes** (`features/salud/images.ts`): hero, llamado (4:5, el Taita Victoriano Piaguaje Yaiguaje) y 4 prácticas (4:5);
  las 6 están activas (originales en `assets-src/salud/`, derivados en `public/salud/`).
  El hero es decorativo (`alt=""`); el retrato y las prácticas llevan `imageAlt`/`imageAlts` en `content/{es,en}/salud.ts`
  (en el acordeón de escritorio solo la imagen visible lleva alt). Si falta alguna (`available: false`) se ve
  `ImagePlaceholder`. `pnpm images` aplica un **grado de color** (`GRADES` en `scripts/images.mjs`, sin tocar los originales):
  `rio` (solo este hero: la foto del río es oscura y con `selva` no se reconocía; más brillo, viñeta suave y algo de calidez;
  el hero usa además `object-[20%_center]` en pantallas estrechas para que se vea la orilla y, de 1024 a 1279 px, encuadre abajo y `brightness-90` por contraste) y `serie`
  (retrato y prácticas: ajuste leve). Recortes: retrato 4:5 desplazado a la derecha; hero (el río) girado 1° y recortado solo
  lo necesario para quitar los bordes del giro (1260×936, no se amplía). Pesos máximos: hero 1260 px ≈ 38 KB; el resto ≤ 150 KB (prácticas y retrato a 900 px; la práctica 3,
  una foto ruidosa, usa `denoise`).
- **Formulario** (`Solicitar`, `SolicitudForm`): Netlify Forms con interruptor `VITE_FORMS_ENABLED`; ver
  [ADR 0009](./adr/0009-formularios.md). Rutas `/gracias/` (`/en/thank-you/`) y `/privacidad/` (`/en/privacy/`) fuera de
  `NAV_KEYS` y con `noindex` (`NOINDEX_ROUTES`).

## Página Proyectos (lengua Siona)

`features/proyectos/components/`: `Proyectos.tsx` ensambla `PageHero` (con la línea de estado como `children`), `PorQue`, `Iniciativa`,
una zona clara con `Resguardos` + `Compromiso` y `Llamado`. Contenido: `t.proyectos.items` (`content/{es,en}/proyectos.ts`).

- **Modelo para varios proyectos.** `t.proyectos.items` es una LISTA (cada proyecto con su `slug`); `ProyectosPage` muestra
  `items[0]`. Los componentes reciben el proyecto como dato (`<Proyectos project={…} />`), así que cuando llegue un segundo
  proyecto `/proyectos/` podrá pasar a ser índice y cada proyecto tendrá su ruta sin reescribir componentes (el índice
  NO está construido). Título y descripción para buscadores salen de `items[0].meta`.
- **Línea de estado del hero.** Sale del contenido (`hero.estado.items`) y `hero.estado.visible` la oculta entera con un solo
  cambio. Hoy es `false` hasta que la organización confirme los estados (ver known-issues).
- **Zonas con patrón lateral.** «Por qué» (sola) y «Resguardos» + «Compromiso» (una sola `PatternZone`); la iniciativa
  (oscura), el hero y el llamado quedan fuera.
- **Justificado:** solo los dos párrafos de «Por qué» y la entradilla de «Compromiso» (`TextoCorrido`). La ficha, las tarjetas,
  las referencias y la entradilla serif de la iniciativa van a la izquierda.
- **Resguardos y mapa.** `Resguardos` usa el `Disclosure` compartido, abierto en el HTML y en el primer render (sin JavaScript se
  ve la lista; abierto también en móvil). El mapa (`MapaResguardos`) es un SVG inline con `role="img"` y una descripción
  (`mapa.desc`); la lista basta por sí sola. **La geometría** (trazados de los ríos y posición y rótulo de cada resguardo) está en
  `features/proyectos/mapa.ts` (`MAPAS` por `slug`): **añadir un resguardo es añadir una fila** a `resguardos` (aparece en el mapa y en
  la lista), más su mención en `mapa.desc` (una prueba lo comprueba). En `content` solo va lo traducible (nombre de cada río por `id`,
  leyenda y descripción). Los nombres de los resguardos son nombres propios y viven en `mapa.ts`. En móvil el texto del SVG se
  agranda (unidades del `viewBox`) y los rótulos se colocan con `label.{dx,dy,anchor}` para que no se solapen.
- **«Zio Bain» sin partirse.** El título del hero usa un espacio de no separación (`NBSP`, exportada por `content/es/proyectos.ts`);
  el `<title>` y la descripción para buscadores van en texto plano.
- **Imágenes** (`features/proyectos/images.ts`): hero (16:9, `selva`), retrato (4:5, `serie`), 3 tarjetas (4:3, `serie`) y fondo del
  llamado (16:9, `selva`), en `assets-src/proyectos/` (nombres y tamaños mínimos en ese archivo). Todas `available: false` por
  ahora: se ve `ImagePlaceholder` sin texto. Al llegar: `pnpm images proyectos`, `available: true` y escribir `retratoAlt` e
  `imageAlt` de las tarjetas (el hero y el fondo son decorativos).
- **Componentes compartidos nuevos.** `shared/ui/FillImage` (imagen que rellena su contenedor o marcador; la usan Salud y Proyectos,
  cada una con su `ImageSpec` en su `images.ts`) y `pageHeroImage` (de `PageHero`). `PageHero` tiene altura **mínima**, no fija: en móvil un
  texto largo hace crecer el hero en vez de quedar bajo el encabezado fijo.
- **Llamado a la acción:** el botón va a `pathFor('colaborar')` (Donaciones / Alianzas).

## Estado y datos

No hace falta librería de estado global.

| Estado                   | Dónde vive                                                   |
| ------------------------ | ------------------------------------------------------------ |
| Idioma                   | La URL; `LangFromUrl` lo entrega por contexto                |
| Intro (fase, saltar)     | `IntroProvider` en `shared/intro`, montado en `app/root.tsx` |
| Menú abierto             | Estado local de `SideNav` (la página activa sale de la URL)  |
| Carrusel (índice, pausa) | Estado local del carrusel                                    |

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

| Requisito                                                             | Solución                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visitante nuevo **en la portada**: intro sin parpadeo previo del hero | Un script mínimo y bloqueante en `<head>` (`shared/intro/boot-script.ts`) marca `<html data-intro="active">` **antes del primer pintado**. El CSS oculta los elementos del hero y muestra el overlay (`[data-intro='active'] .intro-root`). |
| Solo si la sesión **empieza** en la portada (`/` o `/en/`)            | Si la primera página es otra (`/nosotros/`, una 404…), el script y `IntroProvider` marcan el intro como visto: al llegar luego a la portada no se muestra. Ambos usan `isHomePath` / la misma lista de rutas.                               |
| Ya visto en la sesión, o movimiento reducido: sin intro               | El script no marca nada; el CSS no muestra el overlay. Tras hidratar, `IntroProvider` confirma la misma decisión y retira el overlay del DOM.                                                                                               |
| El HTML estático no es `inert` ni `aria-hidden`                       | En el servidor y en el primer render del cliente la fase es `done` y `ready` es `false`. El overlay va en el HTML, pero con `display: none` por defecto.                                                                                    |
| Sin advertencias de hidratación                                       | Servidor y primer render del cliente son idénticos; la decisión (`sessionStorage`, `matchMedia`) se toma en un `useLayoutEffect`, antes de pintar. `<html suppressHydrationWarning>` cubre el atributo `data-intro` que añade el script.    |

Elegí un script en `<head>` y no solo un efecto de React porque el efecto corre después de hidratar, cuando el
visitante ya vio el hero: es la única forma de decidir antes del primer pintado con HTML estático. Límite: el
script también garantiza el tope de 4 s del velo, contado desde el primer pintado (`window.__introT0`): si React aún no
hidrató, el propio script marca el intro como visto y recorre `leaving` → `reveal` → `done` con los mismos tiempos. Al
hidratar, `IntroProvider` lee la fase de `data-intro` y continúa desde ahí, sin volver a mostrarlo. Sin intro también
con `navigator.connection.saveData` o `effectiveType` `slow-2g`/`2g`/`3g` (mismas condiciones en ambos).

### Videos de fondo

Tres piezas en `shared`: `useBackgroundVideo` (estado), `ui/BackgroundVideo` (el `<video>` decorativo) y
`ui/VideoToggle` (botón «Pausar» / «Reproducir», WCAG 2.2.2). El botón va aparte porque debe quedar por encima de los
velos y fuera de la capa del video (en la portada, esa capa se escala y se desvanece al desplazarse).

- El HTML prerenderizado lleva **solo el póster** (precargado): sin fuentes, sin `autoplay` y sin botón. Sin JavaScript
  no se descarga el video.
- Tras hidratar se carga y se reproduce, **salvo** con `prefers-reduced-motion`, `saveData` o `effectiveType`
  `slow-2g`/`2g`/`3g` (`shared/lib/network.ts`, la misma regla que el intro). En esos casos no se descarga hasta que el
  visitante pulsa «Reproducir».
- La etiqueta del botón sale de los eventos `play` y `pause` del video (un `play()` rechazado la deja en «Reproducir»).
  La pausa no se recuerda al salir de la página ni al cambiar de idioma.
- `onReady` se llama con `canplay`, si el video falla o si no se va a cargar; la portada lo usa para cerrar el intro.
- **Pruebas y Git LFS.** CI no descarga LFS (consume la cuota de ancho de banda), así que allí los medios de `public/`
  son punteros. Las e2e responden a `/video/*.{webm,mp4}` con `e2e/fixtures/video-prueba.webm` (unos 3 KB, en git
  normal: `.gitattributes` excluye `e2e/fixtures/` de LFS). Ninguna prueba debe depender del contenido de un archivo
  LFS. Para reproducir CI en local: tras el build, sustituye el archivo en `build/client` por su puntero
  (`git cat-file blob HEAD:public/video/video-hero.webm > build/client/video/video-hero.webm`).

## Variables de entorno

Se leen en un solo lugar, `src/env.ts` (tipadas en `src/vite-env.d.ts`); ver `.env.example`.

| Variable              | Para qué                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `VITE_SITE_INDEXABLE` | **Interruptor único** de indexación: `<meta name="robots">` (React) y `robots.txt` (build) |
| `VITE_SITE_URL`       | Origen público (sin barra final) para `canonical`, `hreflang` y `og:url` absolutos         |
| `VITE_FORMS_ENABLED`  | Interruptor de los formularios (Netlify Forms); `false` en producción, `true` en previews  |
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
   tiene prioridad, así que no afecta a `/en/` ni a `/en/about/`). Verificado en Netlify con `curl -I` (2026-11-22); `pnpm preview` la imita.
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
