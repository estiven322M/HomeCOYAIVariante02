// ESLint (configuración flat). Reglas de calidad, accesibilidad y límites entre capas.
// Las capas y sus reglas de dependencia están documentadas en docs/ARCHITECTURE.md.
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'

/** Prohíbe imports relativos que suban de carpeta: entre carpetas siempre se usa el alias @. */
const NO_PARENT_RELATIVE = {
  regex: '^\\.\\./',
  message: 'No uses imports relativos que suben de carpeta (../). Usa el alias @ (p. ej. @/shared/ui/Button).',
}

const FEATURES = ['home', 'nosotros']

/** Construye la regla no-restricted-imports de un bloque (la regla no se fusiona entre bloques). */
function restrict(message = '', ...groups) {
  return [
    'error',
    {
      patterns: [NO_PARENT_RELATIVE, ...groups.map((group) => ({ group, message }))],
    },
  ]
}

const layer = (name) => [`@/${name}`, `@/${name}/**`]

export default tseslint.config(
  { ignores: ['dist/**', 'build/**', 'node_modules/**', '.figma/**', 'public/**', 'coverage/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat.recommended,

  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },

  // Reglas de React Compiler que marcan lógica existente (carrusel, intro).
  // En "warn" hasta revisarla (ver docs/known-issues.md); no se cambia lógica en la Fase 1.
  { rules: { 'react-hooks/set-state-in-effect': 'warn' } },

  // Código original de Figma Make, sin modificar: se exime de no-explicit-any.
  {
    files: ['config/vite-plugins/figma.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },

  // --- Imports: sin relativos que suban, en todo src ---
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': restrict() },
  },

  // --- Límites entre capas ---
  // content: capa hoja. No importa de ninguna otra capa.
  {
    files: ['src/content/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrict(
        'content es una capa hoja: no puede importar de app, pages, features ni shared.',
        ['@/app', '@/app/**', '@/pages', '@/pages/**', '@/features', '@/features/**', '@/shared', '@/shared/**'],
      ),
    },
  },
  // shared: solo importa de shared. Además, solo shared/i18n puede importar content.
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    ignores: ['src/shared/i18n/**'],
    rules: {
      'no-restricted-imports': restrict(
        'shared no puede importar de app, pages, features ni content (solo shared/i18n lee content).',
        ['@/app', '@/app/**', '@/pages', '@/pages/**', '@/features', '@/features/**', '@/content', '@/content/**'],
      ),
    },
  },
  {
    files: ['src/shared/i18n/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrict('shared no puede importar de app, pages ni features.', [
        '@/app',
        '@/app/**',
        '@/pages',
        '@/pages/**',
        '@/features',
        '@/features/**',
      ]),
    },
  },
  // features: shared y content; nunca app, pages ni otra feature.
  ...FEATURES.map((name) => ({
    files: [`src/features/${name}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': restrict(
        `La feature "${name}" solo puede importar de shared y content; no de app, pages ni de otra feature.`,
        ['@/app', '@/app/**', '@/pages', '@/pages/**'],
        ...FEATURES.filter((f) => f !== name).map((f) => layer(`features/${f}`)),
      ),
    },
  })),
  // pages: ensambla features; no importa de app.
  {
    files: ['src/pages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrict('pages no puede importar de app.', ['@/app', '@/app/**']),
    },
  },
)
