/// <reference types="vite/client" />

/** Día del build en Colombia ('AAAA-MM-DD'); lo define vite.config.ts. */
declare const __FECHA_BUILD__: string

interface ImportMetaEnv {
  readonly VITE_SITE_INDEXABLE?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_FORMS_ENABLED?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
