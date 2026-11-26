import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { useLangLinks } from '@/shared/i18n'
import { NOT_FOUND, pathFor } from '@/shared/i18n/routes'

function Probe() {
  return <output>{JSON.stringify(useLangLinks())}</output>
}

const linksAt = (path: string) => {
  renderAt(<Probe />, path)
  return JSON.parse(screen.getByRole('status').textContent ?? '[]') as unknown
}

describe('useLangLinks', () => {
  it('da la misma página en cada idioma, con el ancla, y marca el activo', () => {
    expect(linksAt(`${pathFor('nosotros', 'es')}#equipo`)).toEqual([
      { lang: 'es', current: true, href: `${pathFor('nosotros', 'es')}#equipo` },
      { lang: 'en', current: false, href: `${pathFor('nosotros', 'en')}#equipo` },
    ])
  })

  it('en la 404 lleva a la portada de cada idioma', () => {
    expect(linksAt(NOT_FOUND.en)).toEqual([
      { lang: 'es', current: false, href: pathFor('home', 'es') },
      { lang: 'en', current: true, href: pathFor('home', 'en') },
    ])
  })
})
