import { ROUTES } from '@/shared/i18n/routes'
import { LEAVE_MS, MAX_MS, REVEAL_MS, SEEN_KEY, SLOW_CONNECTION_TYPES } from './intro-context'

/**
 * Script mínimo y bloqueante para el <head>. Se ejecuta ANTES del primer pintado y marca
 * <html data-intro="active"> solo si el visitante es nuevo en la sesión, no pidió movimiento reducido ni ahorro
 * de datos y su conexión no es lenta (la misma decisión que toma IntroProvider después de hidratar).
 *
 * Por qué existe: el HTML prerenderizado debe verse completo y usable sin JavaScript (sin `inert` ni
 * `aria-hidden`), pero un visitante nuevo no debe ver un parpadeo del hero antes del intro. El CSS
 * (`[data-intro='active'] .intro-root`) muestra el overlay —presente en el HTML— apenas corre este script.
 *
 * El intro es solo de la portada y solo si la sesión EMPIEZA en ella: si la primera página es otra (p. ej.
 * /nosotros/ o una 404), se marca como visto y no se mostrará al llegar luego a la portada.
 *
 * Límite de 4 s garantizado AQUÍ, sin depender de React: se cuenta desde el primer pintado
 * (`window.__introT0`) y, si pasado ese tiempo React aún no hidrató, el propio script marca el intro como visto y
 * recorre las mismas fases (leaving → reveal → done) con los mismos tiempos que IntroProvider. Si React hidrata
 * después, IntroProvider lee el estado en <html data-intro> y continúa desde ahí, sin volver a mostrar el intro.
 * Si React hidrata antes (lo normal), `window.__introReady` hace que el script ceda y siga IntroProvider.
 */
const HOME_PATHS = JSON.stringify([ROUTES.home.es, ROUTES.home.en])

export const INTRO_BOOT_SCRIPT = `(function(){try{var d=document.documentElement,k=${JSON.stringify(SEEN_KEY)},p=location.pathname;if(p.slice(-1)!=='/')p+='/';if(${HOME_PATHS}.indexOf(p)<0){sessionStorage.setItem(k,'1');return}if(sessionStorage.getItem(k)==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var c=navigator.connection;if(c&&(c.saveData||${JSON.stringify(SLOW_CONNECTION_TYPES)}.indexOf(c.effectiveType)>=0))return;window.__introT0=performance.now();d.setAttribute('data-intro','active');setTimeout(function(){if(window.__introReady)return;sessionStorage.setItem(k,'1');d.setAttribute('data-intro','leaving');setTimeout(function(){if(window.__introReady)return;d.setAttribute('data-intro','reveal');setTimeout(function(){if(!window.__introReady)d.setAttribute('data-intro','done')},${REVEAL_MS})},${LEAVE_MS})},${MAX_MS})}catch(e){}})()`
