// Variables de entorno de Vite, leídas y tipadas en un solo lugar (ver también .env.example y vite-env.d.ts).
// Solo las que empiezan por VITE_ llegan al código del cliente.

export const env = {
  /**
   * INTERRUPTOR ÚNICO de indexación. Gobierna <meta name="robots"> (en React) y robots.txt (en el build).
   * Por defecto el sitio NO es indexable (ADR 0007).
   */
  SITE_INDEXABLE: import.meta.env.VITE_SITE_INDEXABLE === 'true',
  /**
   * Origen público del sitio (https://ejemplo.org), sin barra final. Se usa para las URL absolutas de canonical,
   * hreflang y og:url. Si no está definido, esas URL salen relativas a la raíz (válidas, pero se recomienda definirlo).
   */
  SITE_URL: (import.meta.env.VITE_SITE_URL ?? '').replace(/\/+$/, ''),
} as const
