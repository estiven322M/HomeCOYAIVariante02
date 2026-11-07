// Metadatos del documento HTML que no dependen de Figma Make.
// Sustituye a .figma/make/site.json (que sigue ahí, intacto, para Figma Make).

export const SITE = {
  title: 'ÉCOYAI — Home / Variante 02 / Inmersiva Territorial',
  description:
    'Offers an immersive, cinematic homepage showcasing the Putumayo territory to connect users with cultural memory, language preservation, and technology.',
  /** Idioma de origen del documento (el contenido en español es la fuente de verdad). */
  lang: 'es',
  favicon: '/favicon.svg',
  /**
   * INTERRUPTOR ÚNICO de indexación: gobierna `robots.txt` y `<meta name="robots">`.
   * Por defecto el sitio NO es indexable (decisión Fase 1; se revisa en la Fase 6).
   * Para habilitarlo: SITE_INDEXABLE=true en el entorno del build.
   */
  indexable: process.env.SITE_INDEXABLE === 'true',
} as const
