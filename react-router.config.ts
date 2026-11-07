import type { Config } from '@react-router/dev/config'
import { ALL_PATHS } from './src/shared/i18n/routes.ts'

// React Router en modo framework, sin servidor (ssr: false) y con prerender: cada ruta e idioma se genera como
// HTML estático en build/client (`/` → index.html, `/en/` → en/index.html). Ver ADR 0001.
export default {
  appDirectory: 'src/app',
  ssr: false,
  prerender: ALL_PATHS,
} satisfies Config
