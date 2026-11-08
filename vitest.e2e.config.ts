import path from 'node:path'
import { defineConfig } from 'vitest/config'

// Pruebas de extremo a extremo (e2e/): Playwright contra build/client servido con scripts/preview.mjs.
// Aparte de vitest.config.ts: `pnpm test` no exige build ni navegador.
export default defineConfig({
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  test: {
    environment: 'node',
    include: ['e2e/**/*.e2e.test.ts'],
    testTimeout: 30_000,
    fileParallelism: false,
  },
})
