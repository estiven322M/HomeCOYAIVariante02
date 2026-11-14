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
- **Retratos de la junta directiva.** Se muestran iniciales (VP, FY, MR, JP) hasta tener las fotos; ver "Retratos" en
  ARCHITECTURE. Falta además un recorte revisado de `slider9` (corona de plumas, con inclinación de cámara de origen).
- **Descripciones muy cortas.** Las de Nosotros y Contacto (`common.nav[*].desc`, ~40 caracteres) son honestas pero
  débiles para buscadores. Mejorarlas con el contenido definitivo.
- **Páginas con contenido por llegar.** `/proyectos/` y `/colaborar/` reutilizan el texto del proyecto destacado y de
  «Colaborar» más el aviso «Esta sección estará disponible pronto»; `/contacto/` solo tiene título, descripción y el
  aviso. `/transparencia/` solo tiene el marco legal, con los documentos «por cargar» (cuando exista cada archivo, se
  le añade `url` en `content/{es,en}/transparencia.ts`).
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
- **404 por idioma en Netlify.** `netlify.toml` añade `/en/* → /en/404.html` (estado 404). Según la documentación de
  Netlify los archivos existentes tienen prioridad («shadowing»), así que no debería afectar a `/en/` ni a `/en/about/`.
  **No verificado:** en la primera previsualización, `curl -I <preview>/en/no-existe/` debe dar 404 con la página en inglés,
  `curl -I <preview>/no-existe/` 404 en español, `curl -I <preview>/404/` 404 y `curl -I <preview>/en/about/` 200. Si
  la regla fallara, quitarla: las URL bajo `/en/` mostrarían la 404 en español (con `lang` correcto tras hidratar).
- **Barra final en Netlify.** Se asume que `/en` redirige a `/en/` (301) porque existe `en/index.html`; no hay
  regla propia. **No verificado:** `curl -I <previsualización>/en`. Si no redirige (o duplica contenido), añadir
  entonces la regla `/en /en/ 301`, vigilando que no genere un bucle.
- **Cabeceras de Netlify sin probar.** `X-Robots-Tag` en previsualizaciones (`_headers` generado tras el build) y la
  caché de 30 días de `/video`, `/slider` y `/branding` (sin hash: si se reemplaza un archivo con el mismo nombre,
  los visitantes pueden ver la copia antigua hasta 30 días).
- **Node en Netlify.** `.node-version` fija 22.22.0; Netlify debe tener esa versión disponible (no verificado).
- **Sin Open Graph completo.** Falta `og:image` (y `twitter:*`). `og:title`, `og:description`, `og:locale`, `og:url` y
  `og:type` sí están. _Fase 2B/6._
- **Títulos y descripciones.** Salen solo de textos existentes (aprobados en la 2B): la portada ya no usa el nombre
  del diseño de trabajo. Revisar con el contenido definitivo.

## Contenido

- **Textos provisionales.** `src/content/{es,en}/common.ts`: «Transparencia y Gobernanza» lleva
  `[Contenido por definir]` en la descripción del menú. `MediaPlaceholder` sustituye fotografías en varias
  secciones. _Fase 3/5._

## Estilos y diseño

- **Colisión del token «selva» (resuelta en la Fase 3, queda un alias confuso).** El `--selva` (#0f1b16) del hero y el
  intro se renombró a `--color-noche`. Pendiente para la fase de paletas: el alias `--color-selva` (clase `bg-selva`…)
  apunta al azul huito (#1c2233) y su nombre confunde; se resuelve al consolidar las paletas (Huito y achiote, y las
  variables del hero/intro, que siguen conviviendo). _Fase 4._
- **Tamaños de texto pequeños (parcial).** Ya existe una escala tipográfica en tokens (`--text-*` en `@theme`, mínimo
  12 px) y `Eyebrow`/`SubTitle` la usan; la página Nosotros solo usa la escala. Siguen con `text-[10px]`/`text-[11px]`
  fuera de la escala: pie, menú, selector de idioma, intro, portada (`Hero`, `Sections`), 404 y `Transparencia`.
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
- **Portada** — `color-contrast`: el eyebrow «Origen/Born in Putumayo» (`text-carbon/60`, 11 px; 4,0:1) y las descripciones de
  «Explora» (`text-carbon/60`, 14 px; 4,0:1). Además `list` y `listitem`: la lista de «Explora» tiene un `<div>` (el `Reveal`)
  entre `<ul>` y cada `<li>`. _Fase 4 y rediseño de Inicio._
- **Transparencia** — `color-contrast`: «Documento por cargar» (`text-carbon/60`, 12 px; 4,1:1). _Fase 4._
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
