import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FooterPaisaje } from './FooterPaisaje'

const html = renderToStaticMarkup(<FooterPaisaje />)
const doc = () => new DOMParser().parseFromString(html, 'text/html')

describe('paisaje del pie', () => {
  it('es decorativo: aria-hidden, sin texto, títulos ni nada enfocable', () => {
    const root = doc().body.firstElementChild!
    expect(root.getAttribute('aria-hidden')).toBe('true')
    expect(root.textContent).toBe('')
    expect(root.querySelector('title, a, button, [tabindex]')).toBeNull()
  })

  it('pesa menos de 15 KB (va en cada página prerenderizada)', () => {
    expect(new TextEncoder().encode(html).length).toBeLessThan(15 * 1024)
  })

  it('reserva su alto y no estira el dibujo: capas repetidas sin viewBox y figuras sin preserveAspectRatio', () => {
    const d = doc()
    expect(d.body.firstElementChild!.className).toContain('h-[120px] ')
    expect(d.body.firstElementChild!.className).toContain('md:h-[200px]')
    const patterns = [...d.querySelectorAll('pattern')]
    expect(patterns).toHaveLength(3)
    expect(new Set(patterns.map((p) => p.id)).size).toBe(3)
    for (const p of patterns) {
      expect(p.hasAttribute('viewBox')).toBe(false)
      expect(p.parentElement!.hasAttribute('viewBox')).toBe(false)
    }
    expect(html).not.toContain('preserveAspectRatio')
  })

  it('cada tesela del dosel empieza y termina a la misma altura y mide su ancho (se repite sin salto)', () => {
    for (const pattern of doc().querySelectorAll('pattern')) {
      const d = pattern.querySelector('path')!.getAttribute('d')!
      const start = /^M0 (\d+)/.exec(d)!
      // Cada loma es «q cx cy x y»: las x suman el ancho de la tesela y las y, cero.
      const bumps = d
        .split('V')[0]!
        .split('q')
        .slice(1)
        .map((q) => q.match(/-?\d+/g)!.map(Number))
      const sum = (i: number) => bumps.reduce((total, b) => total + b[i]!, 0)
      expect(Number(start[1])).toBeGreaterThan(0)
      expect(sum(2), pattern.id).toBe(Number(pattern.getAttribute('width')))
      expect(sum(3), pattern.id).toBe(0)
    }
  })
})
