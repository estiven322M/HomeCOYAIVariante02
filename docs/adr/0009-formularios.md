# 0009 — Formularios con Netlify Forms e interruptor `VITE_FORMS_ENABLED`

**Estado:** Aceptada. Implementada con el formulario de «Salud y medicina tradicional».

## Contexto

El sitio es estático (sin backend). La página de Salud necesita un formulario de pre-inscripción (nombre, país, correo o
WhatsApp, motivación) que el equipo de ÉCOYAI revisa antes de confirmar un cupo. Recoger datos personales exige una política
de tratamiento de datos (Ley 1581 de 2012) que la organización aún no ha entregado, y los datos se guardan en Netlify
(Estados Unidos: transferencia internacional).

## Decisión

- **Netlify Forms.** El formulario existe en el HTML prerenderizado (`<form name="solicitud-encuentros" data-netlify="true"
  netlify-honeypot="bot-field">` con un campo oculto `form-name`), que es lo que Netlify detecta al publicar. Un solo
  nombre de formulario para español e inglés, con los mismos campos (Netlify lo exige). Campo oculto `idioma` (`es`/`en`)
  y honeypot `bot-field`.
- **Sin JavaScript:** envío nativo (`method="POST"`, `action="/gracias/"` o `/en/thank-you/`), con validación nativa
  (`required`). La página de agradecimiento está fuera del menú y siempre es `noindex` (`NOINDEX_ROUTES` en
  `shared/i18n/routes.ts`).
- **Con JavaScript:** tras hidratar se desactiva la validación nativa y se valida con errores accesibles (junto a cada
  campo con `aria-invalid` y `aria-describedby`, y un resumen que recibe el foco). El envío es un `fetch` POST
  (`application/x-www-form-urlencoded`, `form-name` incluido) a `/`; el estado (enviando, éxito, fallo) se anuncia en una
  región `aria-live`. Hook `shared/hooks/useNetlifyForm`, campos en `shared/ui/forms` (reutilizables por Contacto).
- **Interruptor `VITE_FORMS_ENABLED`** (`src/env.ts` → `env.FORMS_ENABLED`). En `false` el formulario **no se renderiza**
  (tampoco sale en el HTML, así que Netlify no lo detecta) y la sección muestra el mismo título con un botón a Contacto.
  `netlify.toml`: `"false"` en producción y en las ramas, `"true"` en las previsualizaciones (`deploy-preview`), para poder
  probarlo. Ver `.env.example`.
- **Política de datos:** el consentimiento (casilla obligatoria, sin marcar) enlaza a `/privacidad/` (`/en/privacy/`),
  hoy una página provisional `noindex`. **El formulario no puede activarse en producción hasta que esa página tenga la
  política real** (ver `docs/known-issues.md`).
- **CI** construye con `VITE_FORMS_ENABLED=true` para verificar el formulario prerenderizado (`verify:build` y e2e se adaptan
  al estado del build); el estado apagado lo cubren las pruebas unitarias y `verify:build` sin la variable.

## Alternativas descartadas

- **Backend propio o función serverless:** más piezas para un formulario; Netlify Forms basta.
- **Servicios externos (Formspree, etc.):** un tercero más con datos personales.
- **Formulario siempre encendido:** publicaría un canal de recogida de datos sin la política exigida por la ley.
- **Formulario solo con JavaScript** (sin `data-netlify` en el HTML estático): Netlify no lo detectaría y el envío sin JS
  fallaría.

## Consecuencias

- Hay que activar la detección de formularios y las notificaciones por correo en el panel de Netlify (no se configuran en
  el repositorio).
- Los envíos quedan en Netlify; el plan gratuito tiene un límite mensual de envíos.
- Para activar en producción: política real en `/privacidad/`, quitar `privacidad` de `NOINDEX_ROUTES`, encender
  `PRIVACIDAD_EN_PIE` (el enlace del pie, en `shared/i18n/routes.ts`) y poner `VITE_FORMS_ENABLED = "true"` en
  `[context.production.environment]`.
