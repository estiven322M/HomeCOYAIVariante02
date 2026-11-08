# Problemas conocidos

Registro de lo detectado y **no corregido a propósito** (las Fases 1, 2A y 2B no rediseñan ni inventan contenido).
Cada punto indica la fase en la que conviene resolverlo (según el plan de 6 fases).

## Bloqueantes antes de publicar formularios o donaciones

- **Política de tratamiento de datos personales (Ley 1581 de 2012).** Antes de publicar **cualquier formulario**
  (contacto) **o canal de donación** debe existir la política de tratamiento de datos, **redactada por la organización
  con asesoría legal**, publicada en `/privacidad/` (ruta nueva en la tabla de rutas, con su enlace en el pie). No se
  redacta aquí: es un texto jurídico de la organización. Mientras no exista, «Aviso legal» y «Política de privacidad» no
  se muestran en el pie (ver abajo). _Requisito bloqueante._

## Para la fase de rediseño de Inicio y Nosotros

- **Adelanto de Misión y Visión en Inicio.** Se decidió **no** mostrarlo en la 2B (ni siquiera como enlaces sueltos).
  Retomarlo en el rediseño de Inicio; si se hace, leer las mismas claves de `content/nosotros` (sin copiar) y enlazar a
  `/nosotros/#direccionamiento`.
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
- **Medios en Git LFS.** `public/` guarda imágenes, el video y el poster en Git LFS (`.gitattributes`). CI no
  descarga LFS a propósito. **No he podido verificar desde aquí que Netlify los resuelva en el build**: confirmar en
  el primer despliegue (si faltaran, se verían los punteros LFS en lugar de los medios).
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

- **Texto justificado.** `src/shared/styles/index.css` aplica `text-align: justify; hyphens: auto` a todos los
  `<p>`. Afecta a la legibilidad y a la accesibilidad (ríos de espacio, sobre todo en columnas estrechas). _Fase 4._
- **Colisión del token «selva».** `@theme` define `--color-selva` (alias de `--color-huito`, `#1c2233`) y el hero
  define otra variable `--selva` (`#0f1b16`). Son dos colores distintos con el mismo nombre. Conviven además dos
  paletas (Huito y achiote, y las variables del hero/intro: `--niebla`, `--ambar`…). _Fase 4._
- **Tamaños de texto pequeños.** Hay `text-[10px]` (6 usos) y `text-[11px]` (11 usos), además de tamaños
  arbitrarios `text-[15px]` y `text-[17px]`, fuera de una escala tipográfica. Los de 10–11 px quedan por debajo
  de lo recomendable para lectura. _Fase 4._
- **Contraste del acento.** Un comentario en `index.css` ya anota que el ámbar no alcanza 3:1 sobre el fotograma
  más claro del hero. _Fase 4._

## Accesibilidad y comportamiento

- **El botón del menú necesita JavaScript.** El panel va con `inert` cerrado y se abre con JS; sin JS la navegación
  completa está en el pie (enlaces reales), que basta para recorrer todo el sitio.
- **Con movimiento reducido ya no hay intro** (antes mostraba una versión corta). Es un cambio de comportamiento
  pedido en la Fase 2A.
- **Duración del intro (medida en la 2B, `node scripts/measure-intro.mjs`).** El velo permanece ~3,1 s sin límite de red
  y ~3,6–3,8 s en 4G (9 Mbps, 170 ms): cumple el máximo de 4 s, con poco margen. **En una conexión lenta (Slow 4G,
  1,6 Mbps) llega a ~9,2 s y NO cumple:** el temporizador de 2,5–4 s empieza cuando React hidrata, no cuando aparece el
  velo (que el script de `<head>` muestra de inmediato), así que la descarga del JavaScript se suma. Disolución del
  velo: 0,5 s; entrada del hero: 1,5 s. **No se cambió la lógica** (pendiente de decisión): una opción es contar los 4 s
  desde el primer pintado (el script de `<head>` iniciaría el límite), otra acortar el mínimo de 2,5 s.
- **Intro que depende del CSS.** El overlay existe siempre en el HTML y se muestra por `[data-intro='active']`;
  el script de `<head>` y `IntroProvider` deben seguir tomando la misma decisión (ambos usan la misma clave
  `ecoyai-intro-seen`, `prefers-reduced-motion` y la lista de rutas de la portada). Cualquier cambio en una condición debe
  hacerse en los dos; un test (`src/shared/intro/intro.test.tsx`) comprueba que coinciden.
- **El intro es solo de la portada y solo si la sesión empieza en ella:** entrar por `/nosotros/` (o una 404) lo da por
  visto. La navegación de idioma tampoco lo repite (el proveedor vive en la raíz); es lo deseado.
- **Los enlaces de salto y de ancla dentro de una página** (`#origen`, `#contenido`) son `<a>` normales; el resto de los
  internos son `<Link>` (navegación en cliente).

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
