import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { Llamado } from './components/Llamado'
import { Memoria } from './components/Memoria'
import { memoriaDeEjemplo } from './fuente.demo'

describe.each([
  ['es', '/eventos/', '/galeria/', '/colaborar/', '/contacto/'],
  ['en', '/en/events/', '/en/gallery/', '/en/collaborate/', '/en/contact/'],
] as const)('Eventos · memoria y llamado (%s)', (lang, path, galeria, colaborar, contacto) => {
  const m = dict[lang].eventos.memoria
  const c = dict[lang].eventos.llamado

  it('sin fotos publicadas la memoria no se muestra', () => {
    const { container } = renderAt(<Memoria />, path)
    expect(container).toBeEmptyDOMElement()
  })

  it('un año sin fotos no basta para mostrarla', () => {
    const { container } = renderAt(<Memoria anios={[{ anio: 2024, fotos: [] }]} />, path)
    expect(container).toBeEmptyDOMElement()
  })

  it('años del más reciente al más antiguo, sin los vacíos', () => {
    renderAt(<Memoria anios={memoriaDeEjemplo(lang)} />, path)
    expect(screen.getByRole('heading', { level: 2, name: m.title })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['2026', '2025'])
  })

  it('hasta 6 fotos por año; la 5.ª y la 6.ª se ocultan en móvil', () => {
    renderAt(<Memoria anios={memoriaDeEjemplo(lang)} />, path)
    const [con8, con3] = screen.getAllByRole('list') as [HTMLElement, HTMLElement]
    const items = within(con8).getAllByRole('listitem')
    expect(items).toHaveLength(6)
    expect(items.map((li) => li.classList.contains('max-md:hidden'))).toEqual([false, false, false, false, true, true])
    expect(within(con3).getAllByRole('listitem')).toHaveLength(3)
  })

  it('cada foto lleva su pie y su texto alternativo, y no es un enlace', () => {
    const anios = memoriaDeEjemplo(lang)
    renderAt(<Memoria anios={anios} />, path)
    const foto = anios[1]!.fotos[0]!
    expect(screen.getAllByRole('img', { name: foto.alt }).length).toBeGreaterThan(0)
    expect(screen.getAllByText(foto.pie).length).toBeGreaterThan(0)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAccessibleName(m.gallery)
    expect(links[0]).toHaveAttribute('href', galeria)
  })

  it('llamado: título y los dos botones a Colaborar y Contacto', () => {
    renderAt(<Llamado />, path)
    expect(screen.getByRole('heading', { level: 2, name: c.title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: c.collaborate })).toHaveAttribute('href', colaborar)
    expect(screen.getByRole('link', { name: c.write })).toHaveAttribute('href', contacto)
  })

  it('llamado: sin frase aprobada no hay párrafo vacío; todo el texto va en crema al 100 %', () => {
    renderAt(<Llamado />, path)
    const section = document.querySelector('section')!
    expect(section.querySelectorAll('p')).toHaveLength(1) // solo el rótulo
    expect(section.querySelector('p')).toHaveClass('text-calido')
    expect(section.innerHTML).not.toMatch(/text-calido\/\d/)
  })

  it('llamado: con frase, la muestra', () => {
    renderAt(<Llamado texts={{ ...c, text: '[EJEMPLO] Frase.' }} />, path)
    expect(screen.getByText('[EJEMPLO] Frase.')).toBeInTheDocument()
  })
})
