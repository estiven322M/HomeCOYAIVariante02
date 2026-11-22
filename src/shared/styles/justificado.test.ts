import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const css = fs.readFileSync(path.resolve(process.cwd(), 'src/shared/styles/index.css'), 'utf8')

// El justificado es una utilidad explícita (`justificado`): una regla global sobre «p» ya desalineó el eyebrow de Colaborar.
describe('texto justificado', () => {
  it('solo existe dentro de la utilidad `justificado`, no en reglas globales', () => {
    const sinUtilidad = css.replace(/@utility justificado \{[\s\S]*?\n\}\n/, '')
    expect(css).toMatch(/@utility justificado/)
    expect(sinUtilidad).not.toMatch(/text-align:\s*justify/)
    expect(sinUtilidad).not.toMatch(/hyphens:\s*auto/)
  })

  it('la utilidad solo actúa desde md (en móvil, a la izquierda)', () => {
    const utility = /@utility justificado \{([\s\S]*?)\n\}\n/.exec(css)?.[1] ?? ''
    expect(utility).toMatch(/@media \(min-width: 48rem\)/)
    expect(utility).toMatch(/text-align:\s*justify/)
    expect(utility).toMatch(/hyphens:\s*auto/)
    expect(utility).toMatch(/hyphenate-limit-chars:\s*10 5 5/)
    expect(utility).toMatch(/-webkit-hyphenate-limit-chars:\s*10 5 5/)
    expect(utility).toMatch(/text-wrap:\s*pretty/)
  })
})
