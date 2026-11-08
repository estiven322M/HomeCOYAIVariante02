import { index, route, type RouteConfig } from '@react-router/dev/routes'
// Import relativo a propósito (única excepción a la regla del alias @): React Router evalúa este archivo en Node,
// fuera de Vite (p. ej. `react-router typegen`), donde el alias no existe.
// eslint-disable-next-line no-restricted-imports
import { LANGS, ROUTES, type RouteKey } from '../shared/i18n/routes.ts'

/** Módulo de ruta de cada página (relativo a src/app). Una página = un archivo, registrado una vez por idioma. */
const MODULES: Record<RouteKey, string> = {
  home: 'routes/home.tsx',
  nosotros: 'routes/nosotros.tsx',
  proyectos: 'routes/proyectos.tsx',
  transparencia: 'routes/transparencia.tsx',
  colaborar: 'routes/colaborar.tsx',
  contacto: 'routes/contacto.tsx',
}

// Se generan desde la tabla de rutas (shared/i18n/routes.ts): el slug de cada idioma sale de ahí.
const pages = (Object.keys(ROUTES) as RouteKey[]).flatMap((key) =>
  LANGS.map((lang) => {
    const path = ROUTES[key][lang].replace(/^\/|\/$/g, '')
    const options = { id: `${key}-${lang}` }
    return path ? route(path, MODULES[key], options) : index(MODULES[key], options)
  }),
)

// 404: la ruta comodín muestra la página «no encontrada» en cualquier URL desconocida (y se prerenderiza en
// NOT_FOUND para generar 404.html). Va al final: las rutas concretas tienen prioridad.
export default [...pages, route('*', 'routes/not-found.tsx', { id: 'not-found' })] satisfies RouteConfig
