# Problemas conocidos

Registro de lo detectado y **no corregido a propósito** (las Fases 1, 2A y 2B no rediseñan ni inventan contenido).
Cada punto indica la fase en la que conviene resolverlo (según el plan de 6 fases).

## Bloqueantes antes de publicar formularios o donaciones

- **Política de tratamiento de datos personales (Ley 1581 de 2012).** Antes de publicar **cualquier formulario**
  (contacto) **o canal de donación** debe existir la política de tratamiento de datos, **redactada por la organización
  con asesoría legal**, publicada en `/privacidad/` (ruta nueva en la tabla de rutas, con su enlace en el pie). No se
  redacta aquí: es un texto jurídico de la organización. Mientras no exista, «Aviso legal» y «Política de privacidad» no
  se muestran en el pie (ver abajo). _Requisito bloqueante._

## Para la fase de rediseño de Inicio (Nosotros ya rediseñada en la Fase 3)

- **Adelanto de Misión y Visión en Inicio.** Se decidió **no** mostrarlo en la 2B (ni siquiera como enlaces sueltos).
  Retomarlo en el rediseño de Inicio; si se hace, leer las mismas claves de `content/nosotros` (sin copiar) y enlazar a
  `/nosotros/#mision`.
- **Retratos de la junta directiva.** Los tres integrantes muestran iniciales hasta tener sus fotos (ver «Retratos» en
  ARCHITECTURE); el Taita aparece en «Liderazgo ancestral» con su foto.
- **Descripciones muy cortas.** Las de Nosotros y Contacto (`common.nav[*].desc`, ~40 caracteres) son honestas pero
  débiles para buscadores. Mejorarlas con el contenido definitivo.
- **Páginas con contenido por llegar.** `/proyectos/` y `/colaborar/` reutilizan el texto del proyecto destacado y de
  «Colaborar» más el aviso «Esta sección estará disponible pronto»; `/salud-y-medicina-tradicional/`, `/eventos/`, `/galeria/` y
  `/contacto/` solo tienen título, descripción y el aviso (`ProvisionalPage`); el diseño de Salud y Eventos llegará después.
- **Pie de página incompleto a propósito.** «Aviso legal» y «Política de privacidad» están ocultos hasta que exista su
  contenido (ver el bloqueante de arriba). Las redes (`common.footer.socials`, lista `{name, url}`) están vacías y el
  bloque no se muestra: faltan las URL reales. Antes había marcadores `[Instagram] [Facebook] [YouTube]`.
- **Duración del intro.** Ver la sección «Accesibilidad y comportamiento» (mediciones de la 2B).

## Despliegue y SEO (por verificar en el primer despliegue)

- **Sitio no indexable a propósito.** `robots.txt` con `Disallow: /` y `<meta name="robots" content="noindex,
  nofollow">`, gobernados por `VITE_SITE_INDEXABLE` (ver [ADR 0007](./adr/0007-indexacion.md)). _Se cambia en la
  Fase 6._
- **`VITE_SITE_URL` sin definir.** Hasta que se defina, `canonical`, `hreflang` y `og:url` salen como rutas
  relativas a la raíz. Google recomienda URL absolutas en `hreflang`. Definirla en Netlify antes de publicar.
- **Netlify verificado (2026-11-22, `curl -I` contra producción y la previsualización del PR #5).** Funciona:
  `/no-existe/` → 404 en español y `/en/no-existe/` → 404 con la página en inglés (`<html lang="en">`; la regla
  `/en/* → /en/404.html` de `netlify.toml` es correcta y no tapa `/en/` ni `/en/about/`); `/en` → 301 a `/en/` (no
  hace falta regla propia); `/nosotros/` y `/en/about/` → 200; `Cache-Control` de `/slider/slider1.webp` =
  `max-age=2592000` (30 días) y de `/assets/*` = `max-age=31536000, immutable`; `X-Robots-Tag: noindex` solo en la
  previsualización (no sale en producción); `robots.txt` con `Disallow: /` en ambas; `<meta name="robots">` con
  noindex en producción; Git LFS en Netlify (los `.webp` se sirven como imagen). Sigue en pie, a propósito, que el
  sitio no es indexable (ver arriba).
- **`/404` y `/en/404` (sin barra) responden 200 en Netlify** (es `404.html`, que Netlify sirve con «URL limpias»), y
  `/404/` → 301 a `/404`. No es una página enlazada ni indexable (lleva `noindex`), y el 404 real sí se da en cualquier URL
  inexistente; se deja anotado por si en la Fase 6 se quiere forzar 404 también ahí.
- **`VITE_SITE_URL` sigue sin definir en Netlify** (comprobado: `canonical`, `hreflang` y `og:url` salen relativos; ver
  arriba).
- **Node en Netlify.** `.node-version` fija 22.22.0; los despliegues construyen, pero no se ha confirmado que Netlify use
  exactamente esa versión (no verificable con `curl`; mirar el registro del despliegue).
- **Sin Open Graph completo.** Falta `og:image` (y `twitter:*`). `og:title`, `og:description`, `og:locale`, `og:url` y
  `og:type` sí están. _Fase 2B/6._
- **Títulos y descripciones.** Salen solo de textos existentes (aprobados en la 2B): la portada ya no usa el nombre
  del diseño de trabajo. Revisar con el contenido definitivo.

## Contenido

- **Marco legal retirado.** La página «Transparencia y Gobernanza» (marco legal, estatutos y documentos) y el cierre «Marco
  legal y estatutos» de Nosotros se retiraron por decisión de los stakeholders. No hay redirección (el sitio aún no está
  indexado). Su texto queda en el historial de git (commits anteriores al PR de este lote).

- **Textos provisionales.** Ya no queda ningún texto entre corchetes en `src/content` (una prueba,
  `src/content/content.test.ts`, falla si aparece alguno). `MediaPlaceholder` sustituye fotografías en varias
  secciones. _Fase 3/5._

## Estilos y diseño

- **Texto justificado (ajuste general de los stakeholders).** Solo en párrafos de texto corrido, desde `md` (en móvil,
  a la izquierda), con la clase `justificado` (ver ARCHITECTURE). Las tarjetas estrechas (Valores, junta, texto del Taita)
  y los textos centrados quedan sin justificar a propósito. Pendiente de confirmar con los stakeholders: si lo quieren
  también en móvil y si desean extenderlo a las tarjetas estrechas (con guionado hay menos huecos, pero aparecen).

- **Colisión del token «selva» (resuelta en la Fase 3, queda un alias confuso).** El `--selva` (#0f1b16) del hero y el
  intro se renombró a `--color-noche`. Pendiente para la fase de paletas: el alias `--color-selva` (clase `bg-selva`…)
  apunta al azul huito (#1c2233) y su nombre confunde; se resuelve al consolidar las paletas (Huito y achiote, y las
  variables del hero/intro, que siguen conviviendo). _Fase 4._
- **Tamaños de texto pequeños (parcial).** Ya existe una escala tipográfica en tokens (`--text-*` en `@theme`, mínimo
  12 px) y `Eyebrow`/`SubTitle` la usan; la página Nosotros solo usa la escala. Siguen con `text-[10px]`/`text-[11px]`
  fuera de la escala: pie, menú, selector de idioma, intro, portada (`Hero`, `Sections`) y 404.
  _Fase 4._
- **Contraste del acento.** Un comentario en `index.css` ya anota que el ámbar no alcanza 3:1 sobre el fotograma
  más claro del hero. _Fase 4._

## Accesibilidad y comportamiento

- **El botón del menú necesita JavaScript.** El panel va con `inert` cerrado y se abre con JS; sin JS la navegación
  completa está en el pie (enlaces reales), que basta para recorrer todo el sitio.
- **Con movimiento reducido ya no hay intro** (antes mostraba una versión corta). Es un cambio de comportamiento
  pedido en la Fase 2A.
- **Duración del intro (`node scripts/measure-intro.mjs [--profile <texto>]`).** El tope de 4 s del velo se cuenta desde el
  primer pintado y lo garantiza el script de `<head>`, sin depender de React (decisión tras la 2B; antes contaba desde
  hidratar y en Slow 4G llegaba a ~9,2 s). Medido: local ~3,2–4,0 s, 4G (9 Mbps, 170 ms) ~3,7 s, Slow 4G (1,6 Mbps,
  150 ms) ~4,0 s; disolución 0,5 s y entrada del hero 1,5 s. Con ahorro de datos (`saveData`) o `effectiveType`
  `slow-2g`/`2g`/`3g` no hay intro. Lo comprueban tests unitarios y e2e (Slow 4G, JavaScript retenido, conexión lenta).
  Pendiente: ver el intro a ojo en un navegador real.
- **Intro que depende del CSS.** El overlay existe siempre en el HTML y se muestra por `[data-intro='active']`;
  el script de `<head>` y `IntroProvider` deben seguir tomando la misma decisión (ambos usan la misma clave
  `ecoyai-intro-seen`, `prefers-reduced-motion` y la lista de rutas de la portada). Cualquier cambio en una condición debe
  hacerse en los dos; un test (`src/shared/intro/intro.test.tsx`) comprueba que coinciden.
- **El intro es solo de la portada y solo si la sesión empieza en ella:** entrar por `/nosotros/` (o una 404) lo da por
  visto. La navegación de idioma tampoco lo repite (el proveedor vive en la raíz); es lo deseado.
- **Los enlaces de salto y de ancla dentro de una página** (`#origen`, `#contenido`) son `<a>` normales; el resto de los
  internos son `<Link>` (navegación en cliente).

## Accesibilidad detectada por axe (no corregida en la Fase 3)

La e2e «accesibilidad (axe, WCAG A/AA)» (`e2e/site.e2e.test.ts`) recorre todas las páginas en es y en (1280 y 390 px, intro
visto, movimiento reducido) y falla ante cualquier infracción que no esté en su lista `KNOWN`. La página **Nosotros no tiene
ninguna propia**; lo que sigue ya existía y está fuera del alcance de la Fase 3 (al corregir una, quítala de `KNOWN`):

- **Selector de idioma (encabezado, todas las páginas)** — `label-content-name-mismatch` (WCAG 2.5.3, A): el `aria-label`
  («Cambiar idioma a inglés») no contiene el texto visible («ES»/«EN»). _Fase 4/5._
- **Texto de derechos del pie (todas las páginas)** — `color-contrast`: 3,9:1 (#7e7e82 sobre #1c2233, 12 px). _Fase 4._
- **Portada** — `color-contrast`: las descripciones de
  «Explora» (`text-carbon/60`, 14 px; 4,0:1). Además `list` y `listitem`: la lista de «Explora» tiene un `<div>` (el `Reveal`)
  entre `<ul>` y cada `<li>`. _Fase 4 y rediseño de Inicio._
- axe no puede medir el contraste sobre fotografías (queda «incompleto»): el del texto del hero de Nosotros se midió aparte,
  píxel a píxel (peor caso 4,56:1).

## Calidad y herramientas

- **`react-hooks/set-state-in-effect` en `warn`** (3 avisos que `pnpm lint` muestra y no bloquean): la transición
  del carrusel (`Sections.tsx`, más un `exhaustive-deps` por la falta de `shown`) y `leave()` llamado desde un efecto
  en `shared/intro/intro-context.tsx`. Cambiarlos implicaría tocar la lógica del carrusel y del intro. Las
  decisiones «solo de cliente tras hidratar» de la 2A llevan un `eslint-disable` justificado. _Fase 2B/5._
- **ESLint fijado en 9.** `eslint-plugin-jsx-a11y` declara compatibilidad hasta ESLint 9; ESLint 9.39 aparece como
  «deprecated» en pnpm. Subir a ESLint 10 cuando el plugin lo soporte.
- **Cobertura de pruebas.** Humo por página e idioma, enlaces y anclas, HTML generado y una suite corta de extremo a
  extremo (menú, idioma, 404, intro al empezar en la portada; `pnpm test:e2e`). Siguen sin pruebas automáticas la
  cronología completa del intro, el carrusel y el video (se verifican a mano).
- **`console.error` en el `ErrorBoundary`.** No hay servicio de registro de errores.
- **Figma Make.** Los scripts de `.figma/make` (`deploy` usa `--build-dir dist`) ya no coinciden con la salida
  `build/client`, y los plugins de Figma no se han probado con React Router. La detección del entorno Figma
  (variables `FIGMA_*` o `USE_FIGMA_PLUGINS`) es una heurística no verificada.
- **`pnpm check` y pnpm fuera del PATH.** El script encadena llamadas a `pnpm`; en una máquina sin pnpm global
  (solo corepack) hay que ejecutar `corepack enable` o los pasos por separado.
- **`build/server` y `__spa-fallback.html`** se generan y no se publican/usan. Sin impacto.
