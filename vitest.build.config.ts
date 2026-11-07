import path from 'node:path'
import { defineConfig } from 'vitest/config'

// Verificación posterior al build (test/build): lee el HTML de build/client. Aparte de vitest.config.ts para que
// `pnpm test` no exija un build previo.
export default defineConfig({
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  test: {
    environment: 'jsdom',
    include: ['test/build/**/*.test.ts'],
  },
})
