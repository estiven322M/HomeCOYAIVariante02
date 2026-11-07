import { SEEN_KEY } from './intro-context'

/**
 * Script mínimo y bloqueante para el <head>. Se ejecuta ANTES del primer pintado y marca
 * <html data-intro="active"> solo si el visitante es nuevo en la sesión y no pidió movimiento reducido
 * (la misma decisión que toma IntroProvider después de hidratar).
 *
 * Por qué existe: el HTML prerenderizado debe verse completo y usable sin JavaScript (sin `inert` ni
 * `aria-hidden`), pero un visitante nuevo no debe ver un parpadeo del hero antes del intro. El CSS
 * (`[data-intro='active'] .intro-root`) muestra el overlay —presente en el HTML— apenas corre este script.
 *
 * Red de seguridad: si tras 10 s el cliente no hidrató (p. ej. falló la descarga del bundle), se retira
 * el atributo para no dejar al visitante atrapado bajo el overlay.
 */
export const INTRO_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;if(sessionStorage.getItem(${JSON.stringify(SEEN_KEY)})!=='1'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-intro','active');setTimeout(function(){if(!window.__introReady)d.removeAttribute('data-intro')},10000)}}catch(e){}})()`
