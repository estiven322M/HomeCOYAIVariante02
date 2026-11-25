import { screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { LangProvider } from '@/shared/i18n'
import { Agenda } from './components/Agenda'
import { eventosDeEjemplo } from './fuente.demo'

// La fecha de build de las pruebas es 2027-01-15 (vitest.config.ts). El reloj se fija en cada caso.
const reloj = (instante: string) => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(instante))
}
afterEach(() => vi.useRealTimers())

const nombres = () => screen.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent)
const tarjetas = () => screen.queryAllByRole('article')

describe.each([
  ['es', '/eventos/', '/contacto/', '14 de marzo de 2027'],
  ['en', '/en/events/', '/en/contact/', 'March 14, 2027'],
] as const)('Agenda · %s', (lang, path, contacto, fecha) => {
  const a = dict[lang].eventos.agenda
  const ejemplos = eventosDeEjemplo(lang)

  it('sin eventos publicados muestra el estado vacío con enlace a Contacto', () => {
    reloj('2027-01-20T15:00:00Z')
    renderAt(<Agenda />, path)
    expect(screen.getByRole('heading', { level: 2, name: a.title })).toBeInTheDocument()
    expect(screen.getByText(a.empty.title)).toBeInTheDocument()
    expect(screen.getByText(a.empty.text)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: a.empty.cta })).toHaveAttribute('href', contacto)
    expect(tarjetas()).toHaveLength(0)
  })

  it('ordena por fecha, deja fuera lo pasado y no muestra el estado vacío', () => {
    reloj('2027-01-20T15:00:00Z')
    renderAt(<Agenda eventos={ejemplos} />, path)
    expect(tarjetas()).toHaveLength(3)
    expect([...document.querySelectorAll('li time')].map((t) => t.getAttribute('datetime'))).toEqual([
      '2027-03-14',
      '2027-04-02',
      '2027-05-07',
      '2027-05-09',
    ])
    expect(screen.queryByText(a.empty.title)).toBeNull()
    expect(nombres()).not.toContain(ejemplos.at(-1)?.nombre)
  })

  it('la fecha va en <time> con la fecha completa solo para lectores; «Lugar» y el nombre del enlace', () => {
    reloj('2027-01-20T15:00:00Z')
    renderAt(<Agenda eventos={ejemplos} />, path)
    const primera = within(tarjetas()[0] as HTMLElement)
    const time = (tarjetas()[0] as HTMLElement).querySelector('time')
    expect(time).toHaveAttribute('datetime', '2027-03-14')
    expect(time?.querySelector('[aria-hidden]')).toHaveTextContent(/14.*2027/)
    expect(primera.getByText(fecha)).toHaveClass('sr-only')
    expect(primera.getByText(a.place, { exact: false })).toHaveClass('sr-only')
    const link = primera.getByRole('link')
    expect(link).toHaveAccessibleName(`${a.moreAbout} ${ejemplos[1]?.nombre}`)
    expect(a.moreAbout.startsWith(a.more)).toBe(true) // el nombre accesible empieza por el texto visible
    expect(link).toHaveAttribute('href', contacto)
  })

  it('un evento de varios días muestra el intervalo completo y su insignia es decorativa', () => {
    reloj('2027-01-20T15:00:00Z')
    renderAt(<Agenda eventos={ejemplos} />, path)
    const tarjeta = tarjetas()[2] as HTMLElement
    expect(tarjeta.querySelector('p[aria-hidden="true"]')).toHaveTextContent('07')
    expect(tarjeta).toHaveTextContent(`${a.range.from} `)
    expect(tarjeta.querySelectorAll('time')).toHaveLength(2)
  })

  it('con enlace propio, «Más información» lo usa', () => {
    reloj('2027-01-20T15:00:00Z')
    renderAt(<Agenda eventos={[{ ...ejemplos[0]!, enlace: 'https://example.org/inscripcion' }]} />, path)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.org/inscripcion')
  })
})

describe('Agenda · eventos vencidos', () => {
  const ejemplos = eventosDeEjemplo('es')
  const vacio = dict.es.eventos.agenda.empty.title

  it('el HTML del servidor usa la fecha del build, no la de hoy', () => {
    reloj('2030-01-01T12:00:00Z')
    const html = renderToString(
      <MemoryRouter>
        <LangProvider lang="es">
          <Agenda eventos={ejemplos} />
        </LangProvider>
      </MemoryRouter>,
    )
    expect(html.match(/<article/g)).toHaveLength(3)
    expect(html).not.toContain(vacio)
  })

  it.each([
    // El evento del 14 de marzo sigue hasta que termina ese día en Bogotá (05:00 UTC del 15).
    ['2027-03-15T04:59:00Z', 3],
    ['2027-03-15T05:00:00Z', 2],
    // El de varios días (7–9 de mayo) sigue durante su último día.
    ['2027-05-09T20:00:00Z', 1],
  ])('en el cliente recalcula con el día de hoy (%s)', (instante, quedan) => {
    reloj(instante)
    renderAt(<Agenda eventos={ejemplos} />, '/eventos/')
    expect(tarjetas()).toHaveLength(quedan)
  })

  it('cuando vencen todos aparece el estado vacío', () => {
    reloj('2027-06-01T12:00:00Z')
    renderAt(<Agenda eventos={ejemplos} />, '/eventos/')
    expect(tarjetas()).toHaveLength(0)
    expect(screen.getByText(vacio)).toBeInTheDocument()
  })
})
