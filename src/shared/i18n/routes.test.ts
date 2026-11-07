import { describe, expect, it } from 'vitest'
import { ALL_PATHS, ROUTES, alternatePath, langFromPath, pathFor, resolveRoute } from './routes'

describe('tabla de rutas', () => {
  it('el español no lleva prefijo y el inglés usa /en/', () => {
    expect(pathFor('home', 'es')).toBe('/')
    expect(pathFor('home', 'en')).toBe('/en/')
  })

  it('todas las rutas terminan en barra final y ninguna sirve /es', () => {
    for (const path of ALL_PATHS) expect(path.endsWith('/')).toBe(true)
    expect(ALL_PATHS).not.toContain('/es')
    expect(ALL_PATHS).not.toContain('/es/')
  })

  it('no hay dos rutas con la misma URL', () => {
    expect(new Set(ALL_PATHS).size).toBe(ALL_PATHS.length)
    expect(ALL_PATHS).toHaveLength(Object.keys(ROUTES).length * 2)
  })

  it('el idioma sale solo de la URL, con o sin barra final', () => {
    expect(langFromPath('/')).toBe('es')
    expect(langFromPath('/en/')).toBe('en')
    expect(langFromPath('/en')).toBe('en')
    expect(langFromPath('/english-nope')).toBe('es')
  })

  it('resuelve la página y su alternativa en el otro idioma', () => {
    expect(resolveRoute('/en')).toEqual({ key: 'home', lang: 'en' })
    expect(resolveRoute('/no-existe/')).toBeNull()
    expect(alternatePath('/', 'en')).toBe('/en/')
    expect(alternatePath('/en/', 'es')).toBe('/')
    expect(alternatePath('/no-existe/', 'en')).toBe('/en/')
  })
})
