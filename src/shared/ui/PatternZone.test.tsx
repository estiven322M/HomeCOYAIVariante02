import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PatternZone } from './PatternZone'

describe('PatternZone', () => {
  it('dibuja dos franjas decorativas (aria-hidden, sin eventos, solo desde xl, ocultas al imprimir) y deja pasar el contenido', () => {
    const { container, getByText } = render(
      <PatternZone>
        <p>contenido</p>
      </PatternZone>,
    )
    expect(getByText('contenido')).toBeInTheDocument()
    const strips = container.querySelectorAll('[aria-hidden="true"]')
    expect(strips).toHaveLength(2)
    for (const strip of strips) {
      expect(strip.className).toContain('pointer-events-none')
      expect(strip.className).toContain('hidden')
      expect(strip.className).toContain('xl:block')
      expect(strip.className).toContain('print:hidden')
      expect(strip.querySelector('.patron-lateral')).not.toBeNull()
    }
    // Sin fondo propio: ni la franja ni su contenedor llevan clases bg-*.
    expect(container.innerHTML).not.toContain('bg-')
    // Franja derecha: el mismo azulejo espejado.
    expect(strips[1]?.className).toContain('-scale-x-100')
  })

  it('con as="section" la propia sección es la zona, con su id y sus clases', () => {
    const { container } = render(
      <PatternZone as="section" id="x" className="bg-crema">
        <p>a</p>
      </PatternZone>,
    )
    const zone = container.firstElementChild
    expect(zone?.tagName).toBe('SECTION')
    expect(zone?.id).toBe('x')
    expect(zone?.className).toContain('relative')
    expect(zone?.className).toContain('bg-crema')
  })
})
