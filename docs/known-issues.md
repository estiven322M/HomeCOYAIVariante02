# Problemas conocidos

Registro de lo detectado y **no corregido a propósito** (las Fases 1 y 2A no cambian diseño, textos ni
imágenes). Cada punto indica la fase en la que conviene resolverlo (según el plan de 6 fases).

## Para la Fase 2B (páginas y navegación)

- **404 real.** Hoy una ruta inexistente la sirve Netlify con su 404 genérico (no hay regla de fallback, a
  propósito). Plan: ruta normal `/404/` (el prerender exige estado 200), copiada a `build/client/404.html` tras
  el build, con `noindex`; Netlify la sirve con estado 404 y sin JavaScript. Detalle y motivo en
  `docs/ARCHITECTURE.md` («La página 404»). `__spa-fallback.html` se genera pero no se usa; no añadir la regla
  `/* → /__spa-fallback.html` (soft-404).
- **Anclas sin destino.** `#proyectos`, `#transparencia`, `#donaciones`, `#alianzas`, `#legal` y `#privacidad`
  se enlazan desde el menú, el hero y el pie, pero no existe ningún elemento con ese `id`. Con rutas reales deben
  pasar a páginas (con slug por idioma).
- **Anclas duplicadas o casi duplicadas.** Tres enlaces apuntan a `#origen` (salto de contenido, CTA y flecha
  del hero); `#proyecto` (CTA del hero) y `#proyectos` (menú y CTA de la sección) parecen la misma meta; y
  `#nosotros-legal` enlaza a la sección en la que ya está. Los `id` en sí no están repetidos.
- **Pie de página como «contacto».** El ítem «Contacto» del menú (`#contacto`) apunta al `<footer>`; la feature de
  contacto no existe. El `Footer` vive en `features/home/components/Sections.tsx` aunque es global.
- **`NAV_META` y `useNav`** (hrefs del menú) viven en `shared/i18n` por herencia y siguen siendo anclas. Deben
  derivarse de la tabla de rutas (`shared/i18n/routes.ts`) con la 2B.
- **Selector de idioma en páginas sin equivalente.** `alternatePath` lleva a la portada del otro idioma si la URL
  no está en la tabla de rutas. Revisar al añadir la 404.

## Despliegue y SEO (por verificar en el primer despliegue)

- **Sitio no indexable a propósito.** `robots.txt` con `Disallow: /` y `<meta name="robots" content="noindex,
  nofollow">`, gobernados por `VITE_SITE_INDEXABLE` (ver [ADR 0007](./adr/0007-indexacion.md)). _Se cambia en la
  Fase 6._
- **`VITE_SITE_URL` sin definir.** Hasta que se defina, `canonical`, `hreflang` y `og:url` salen como rutas
  relativas a la raíz. Google recomienda URL absolutas en `hreflang`. Definirla en Netlify antes de publicar.
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
- **Título provisional.** El título de la portada («ÉCOYAI — Home / Variante 02 / Inmersiva Territorial») es el
  nombre del diseño de trabajo, no un título para buscadores. Se conservó tal cual (y se tradujo al inglés) por no
  cambiar textos. _Cambiarlo con el contenido definitivo._

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

- **El menú lateral necesita JavaScript.** El menú retráctil va con `inert` cuando está cerrado y su botón
  necesita JS para abrirlo; sin JS la página se ve y se lee completa, pero no hay navegación por menú. _Fase 2B
  (con páginas reales, valorar enlaces visibles sin JS)._
- **Con movimiento reducido ya no hay intro** (antes mostraba una versión corta). Es un cambio de comportamiento
  pedido en la Fase 2A.
- **Intro que depende del CSS.** El overlay existe siempre en el HTML y se muestra por `[data-intro='active']`;
  el script de `<head>` y `IntroProvider` deben seguir tomando la misma decisión (ambos usan la misma clave
  `ecoyai-intro-seen` y `prefers-reduced-motion`). Cualquier cambio en una condición debe hacerse en las dos.
- **La navegación de idioma no vuelve a mostrar el intro** (el proveedor vive en la raíz); es lo deseado.

## Calidad y herramientas

- **`react-hooks/set-state-in-effect` en `warn`** (3 avisos que `pnpm lint` muestra y no bloquean): la transición
  del carrusel (`Sections.tsx`, más un `exhaustive-deps` por la falta de `shown`) y `leave()` llamado desde un efecto
  en `shared/intro/intro-context.tsx`. Cambiarlos implicaría tocar la lógica del carrusel y del intro. Las
  decisiones «solo de cliente tras hidratar» de la 2A llevan un `eslint-disable` justificado. _Fase 2B/5._
- **ESLint fijado en 9.** `eslint-plugin-jsx-a11y` declara compatibilidad hasta ESLint 9; ESLint 9.39 aparece como
  «deprecated» en pnpm. Subir a ESLint 10 cuando el plugin lo soporte.
- **Pruebas de humo.** Cubren render, cambio de idioma por enlace, rutas, cabecera del documento y el HTML
  generado. No cubren el intro (cronología), el carrusel, el menú ni el video: se verificaron a mano con Playwright
  en la 2A. Valorar pruebas de extremo a extremo en la 2B.
- **`console.error` en el `ErrorBoundary`.** No hay servicio de registro de errores.
- **Figma Make.** Los scripts de `.figma/make` (`deploy` usa `--build-dir dist`) ya no coinciden con la salida
  `build/client`, y los plugins de Figma no se han probado con React Router. La detección del entorno Figma
  (variables `FIGMA_*` o `USE_FIGMA_PLUGINS`) es una heurística no verificada.
- **`pnpm check` y pnpm fuera del PATH.** El script encadena llamadas a `pnpm`; en una máquina sin pnpm global
  (solo corepack) hay que ejecutar `corepack enable` o los pasos por separado.
- **`build/server` y `__spa-fallback.html`** se generan y no se publican/usan. Sin impacto.
