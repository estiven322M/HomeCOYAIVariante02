import { describe, expect, it } from 'vitest'
import { dict } from '@/content'

// Un texto entre corchetes («[Contenido por definir]») es un marcador provisional que no debe llegar al sitio.
const PLACEHOLDER = /\[[^\]]*\]/

function strings(value: unknown, path: string): [string, string][] {
  if (typeof value === 'string') return [[path, value]]
  if (Array.isArray(value)) return value.flatMap((item, i) => strings(item, `${path}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => strings(item, `${path}.${key}`))
  }
  return []
}

describe('contenido', () => {
  it.each(['es', 'en'] as const)('no tiene textos provisionales entre corchetes (%s)', (lang) => {
    const found = strings(dict[lang], lang).filter(([, text]) => PLACEHOLDER.test(text))
    expect(found).toEqual([])
  })
})
