import { ROUTES } from '@/shared/i18n/routes'
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
 * El intro es solo de la portada y solo si la sesión EMPIEZA en ella: si la primera página es otra (p. ej.
 * /nosotros/ o una 404), se marca como visto y no se mostrará al llegar luego a la portada.
 *
 * Red de seguridad: si tras 10 s el cliente no hidrató (p. ej. falló la descarga del bundle), se retira
 * el atributo para no dejar al visitante atrapado bajo el overlay.
 */
const HOME_PATHS = JSON.stringify([ROUTES.home.es, ROUTES.home.en])

export const INTRO_BOOT_SCRIPT = `(function(){try{var d=document.documentElement,k=${JSON.stringify(SEEN_KEY)},p=location.pathname;if(p.slice(-1)!=='/')p+='/';if(${HOME_PATHS}.indexOf(p)<0){sessionStorage.setItem(k,'1');return}if(sessionStorage.getItem(k)!=='1'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-intro','active');setTimeout(function(){if(!window.__introReady)d.removeAttribute('data-intro')},10000)}}catch(e){}})()`
