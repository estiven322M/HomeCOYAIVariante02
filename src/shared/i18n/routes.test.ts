import { describe, expect, it } from 'vitest'
import { dict } from '@/content'
import {
  ALL_PATHS,
  NAV_KEYS,
  NOT_FOUND,
  ROUTES,
  alternatePath,
  isHomePath,
  langFromPath,
  pathFor,
  resolveRoute,
} from './routes'

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
    expect(ALL_PATHS).toHaveLength(Object.keys(ROUTES).length * 2 + 2) // + la 404 en cada idioma
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
    // Una URL fuera de la tabla es la 404: su alternativa es la portada del otro idioma (sin hash).
    expect(alternatePath('/no-existe/', 'en')).toBe('/en/')
    expect(alternatePath(NOT_FOUND.en, 'es', '#x')).toBe('/')
  })

  it('el selector de idioma conserva la página y el hash', () => {
    expect(alternatePath('/nosotros/', 'en', '#historia')).toBe('/en/about/#historia')
    expect(alternatePath('/en/about/', 'es', '#historia')).toBe('/nosotros/#historia')
  })

  it('cada página del menú tiene sus textos (NAV_KEYS y common.nav, mismo número)', () => {
    expect(dict.es.common.nav).toHaveLength(NAV_KEYS.length)
    expect(dict.en.common.nav).toHaveLength(NAV_KEYS.length)
  })

  it('solo la portada es portada', () => {
    expect(isHomePath('/')).toBe(true)
    expect(isHomePath('/en')).toBe(true)
    expect(isHomePath('/nosotros/')).toBe(false)
    expect(isHomePath('/404/')).toBe(false)
  })
})
