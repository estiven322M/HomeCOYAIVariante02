import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextoCorrido } from './TextoCorrido'

describe('TextoCorrido', () => {
  it('lleva la clase justificado y protege los nombres propios del guionado', () => {
    const { container } = render(
      <TextoCorrido>
        La Asociación ÉCOYAI (Asëcoyai) nació en Mocoa, inspirada por el Taita Victoriano Piaguaje Yaiguaje.
      </TextoCorrido>,
    )
    const p = container.querySelector('p')
    expect(p).toHaveClass('justificado')
    const protegidos = [...container.querySelectorAll('span.hyphens-none')].map((s) => s.textContent)
    expect(protegidos).toEqual(['ÉCOYAI', 'Asëcoyai', 'Mocoa', 'Victoriano', 'Piaguaje', 'Yaiguaje'])
    // El texto visible es el mismo: solo se añaden envolturas.
    expect(p?.textContent).toBe(
      'La Asociación ÉCOYAI (Asëcoyai) nació en Mocoa, inspirada por el Taita Victoriano Piaguaje Yaiguaje.',
    )
  })
})
