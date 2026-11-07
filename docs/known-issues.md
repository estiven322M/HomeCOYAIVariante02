# Problemas conocidos

Registro de lo detectado en la Fase 1 y **no corregido a propósito** (la Fase 1 no cambia diseño, textos,
imágenes ni comportamiento). Cada punto indica la fase en la que conviene resolverlo (según el plan de 6 fases).

## Restricción para la Fase 2 (prerender) — bloqueante

Prerender ejecuta los componentes en Node, donde no existen `window`, `sessionStorage`, `localStorage` ni
`matchMedia`. **`Intro` y `Hero` no pueden usarlos al renderizar, y el intro debe ser solo de cliente y empezar en
`done` en el servidor.** Usos actuales a mover a efectos o a inicialización diferida:

| Dónde                                          | Qué hace hoy                                                                             |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/shared/intro/intro-context.tsx`           | `seen()` lee `sessionStorage` al inicializar la fase; `reducedMotion()` usa `matchMedia` |
| `src/features/home/components/Sections.tsx`    | El carrusel inicializa `userPaused` con `window.matchMedia`                              |
| `src/shared/i18n/index.tsx`                    | `detectLang()` lee `localStorage` y `navigator` al inicializar                           |
| `src/shared/hooks/useScrollY.ts`, `Reveal.tsx` | Usan `window` / `IntersectionObserver`, pero dentro de efectos (correcto)                |

## Contenido

- **Textos provisionales.** `src/content/{es,en}/common.ts`: «Transparencia y Gobernanza» lleva
  `[Contenido por definir]` en la descripción del menú. `MediaPlaceholder` sustituye fotografías en varias
  secciones. _Fase 3/5._
- **Descripción del sitio en inglés.** `config/site.ts` conserva la descripción de `site.json` (en inglés) aunque
  el idioma de origen es español. _Fase 2 (metadatos por ruta e idioma)._

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

## Navegación y anclas

- **Anclas sin destino.** `#proyectos`, `#transparencia`, `#donaciones`, `#alianzas`, `#legal` y `#privacidad`
  se enlazan desde el menú, el hero y el pie, pero no existe ningún elemento con ese `id`. _Fase 2._
- **Anclas duplicadas o casi duplicadas.** Tres enlaces apuntan a `#origen` (salto de contenido, CTA y flecha
  del hero); `#proyecto` (CTA del hero) y `#proyectos` (menú y CTA de la sección) parecen la misma meta; y
  `#nosotros-legal` enlaza a la sección en la que ya está. Los `id` en sí no están repetidos. _Fase 2._
- **Pie de página como «contacto».** El ítem «Contacto» del menú (`#contacto`) apunta al `<footer>`; la feature
  de contacto no existe todavía. El `Footer` vive en `features/home/components/Sections.tsx` aunque es global.
  _Fase 2._
- **`NAV_META` y `useNav`** (hrefs del sitio) viven en `shared/i18n` por herencia. Deberían pasar a la tabla de
  rutas de la Fase 2.

## Calidad y herramientas

- **`react-hooks/set-state-in-effect` en `warn`** (3 avisos que `pnpm lint` muestra y no bloquean):
  - `Sections.tsx`, transición del carrusel (`setLeaving` / `setShown` dentro de un efecto), más un aviso
    `exhaustive-deps` por la falta de `shown` en la lista de dependencias.
  - `shared/intro/intro-context.tsx`, `leave()` llamado desde un efecto cuando se cumplen las condiciones.

  Cambiarlo implicaría tocar la lógica del carrusel y del intro. Pasar la regla a `error` cuando se revisen.
  _Fase 2/5._

- **ESLint fijado en 9.** `eslint-plugin-jsx-a11y` declara compatibilidad hasta ESLint 9; ESLint 9.39 aparece como
  «deprecated» en pnpm. Subir a ESLint 10 cuando el plugin lo soporte.
- **Pruebas de humo.** Solo cubren render y cambio de idioma en `home` y `nosotros`. No cubren intro, carrusel,
  menú ni el video. _Se amplía con cada fase._
- **`console.error` en el `ErrorBoundary`.** No hay servicio de registro de errores. Valorar uno (p. ej. Sentry)
  solo si el sitio gana tráfico.
- **`AGENTS.md` / `CLAUDE.md`** describen la estructura original de Figma Make (`src/App.tsx`, `src/index.css`).
  Las rutas de esos dos archivos se actualizaron mínimamente en la Fase 1; revisarlos al final de la Fase 2.

## Despliegue y SEO

- **Sitio no indexable a propósito.** `robots.txt` con `Disallow: /` y `<meta name="robots" content="noindex,
  nofollow">`, gobernados por `SITE_INDEXABLE` (ver [ADR 0007](./adr/0007-indexacion.md)). _Se cambia en la Fase 6._
- **Sin Open Graph completo.** Falta `og:image`, `og:url`, `og:locale`, `canonical` y `hreflang`. Antes `og:title`
  valía «Figma Make App» (corregido: ahora usa el título real). _Fase 2/6._
- **Medios en Git LFS.** `public/` guarda imágenes, el video y el poster en Git LFS (`.gitattributes`). CI no
  descarga LFS a propósito. **No he podido verificar desde aquí que Netlify los resuelva en el build**: confirmar en
  el primer despliegue (si faltaran, se verían los punteros LFS en lugar de los medios).
- **Caché de 30 días en medios sin hash** (`/video`, `/slider`, `/branding` en `netlify.toml`). Si se reemplaza un
  archivo conservando el nombre, los visitantes pueden ver la copia antigua hasta 30 días. Renombrar al reemplazar
  o añadir hash.
- **Detección del entorno Figma.** Los plugins de Figma se cargan si existe alguna variable `FIGMA_*` o
  `USE_FIGMA_PLUGINS=true`. Es una heurística: no pude comprobar desde aquí qué variables inyecta Figma Make en
  cada comando.
- **`index.html` ya no usa los marcadores `<!-- figma:* -->`** y trae `lang="es"` fijo (antes quedaba `en` en el
  HTML inicial y se corregía en cliente). Si Figma Make regenerara `index.html`, volvería a necesitar los marcadores.
