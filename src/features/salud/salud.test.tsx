import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { LangFromUrl } from '@/shared/i18n'
import { Salud } from './components/Salud'

const langs = [
  ['es', '/salud-y-medicina-tradicional/'],
  ['en', '/en/health-and-traditional-medicine/'],
] as const

describe('feature salud', () => {
  it.each(langs)('se renderiza con un solo h1 y sin textos entre corchetes (%s)', (lang, path) => {
    const { container } = renderAt(<Salud />, path)
    const h1 = screen.getAllByRole('heading', { level: 1 })
    expect(h1).toHaveLength(1)
    expect(h1[0]).toHaveTextContent(dict[lang].salud.hero.title)
    expect(container.textContent).not.toMatch(/\[[^\]]+\]/)
    // Sin fotos todavía: marcadores sin texto, ocultos a los lectores de pantalla.
    expect(container.querySelectorAll('img')).toHaveLength(0)
  })

  it.each(langs)('El llamado: dos párrafos justificados y una cita (%s)', (lang, path) => {
    const { container } = renderAt(<Salud />, path)
    const ps = [...container.querySelectorAll('section p.justificado')]
    expect(ps.map((p) => p.textContent)).toEqual(dict[lang].salud.llamado.paragraphs)
    expect(container.querySelector('blockquote')).toHaveTextContent(dict[lang].salud.llamado.quote)
    // El resto de los textos (acordeón) no se justifica.
    expect(container.querySelectorAll('p.justificado')).toHaveLength(2)
  })
})

describe('acordeón de prácticas', () => {
  it('sin JavaScript (HTML del servidor) todas las prácticas salen abiertas con su texto', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/salud-y-medicina-tradicional/']}>
        <LangFromUrl>
          <Salud />
        </LangFromUrl>
      </MemoryRouter>,
    )
    for (const item of dict.es.salud.encuentros.items) expect(html).toContain(item.text)
    expect(html.match(/aria-expanded="true"/g)).toHaveLength(4)
    expect(html).not.toMatch(/<div id="practica-\d-panel"[^>]*hidden/)
    // Cada panel lleva su imagen y no hay figura lateral hasta hidratar.
    expect(html.match(/<figure/g)).toHaveLength(5) // 4 prácticas + el retrato de El llamado
  })

  it.each(langs)(
    'al cargar solo la 01 está abierta; una sola abierta a la vez; la imagen sigue a la abierta (%s)',
    async (lang, path) => {
      renderAt(<Salud />, path)
      const items = dict[lang].salud.encuentros.items
      const btn = (i: number) =>
        screen.getByRole('button', { name: new RegExp(items[i]?.title.replace(/[()]/g, '\\$&') ?? '') })
      expect(btn(0)).toHaveAttribute('aria-expanded', 'true')
      for (const i of [1, 2, 3]) expect(btn(i)).toHaveAttribute('aria-expanded', 'false')
      // La abierta es el único panel visible, y el botón apunta a él.
      const panel0 = document.getElementById(btn(0).getAttribute('aria-controls') ?? '')
      expect(panel0).not.toHaveAttribute('hidden')
      expect(panel0).toHaveAttribute('role', 'region')
      // La figura lateral muestra el pie de la práctica abierta.
      const caption = () => document.querySelector('figcaption')?.textContent
      expect(caption()).toBe(`01 · ${items[0]?.title}`)

      await userEvent.click(btn(2))
      expect(btn(2)).toHaveAttribute('aria-expanded', 'true')
      expect(btn(0)).toHaveAttribute('aria-expanded', 'false')
      expect(document.querySelectorAll('[aria-expanded="true"]')).toHaveLength(1)
      expect(caption()).toBe(`03 · ${items[2]?.title}`)

      // Con la práctica abierta no se puede cerrar (siempre queda una): aria-disabled y sin efecto.
      expect(btn(2)).toHaveAttribute('aria-disabled', 'true')
      await userEvent.click(btn(2))
      expect(btn(2)).toHaveAttribute('aria-expanded', 'true')
    },
  )

  it('funciona con el teclado (Tab + Enter/Espacio) y la fila entera es el botón', async () => {
    renderAt(<Salud />, '/salud-y-medicina-tradicional/')
    const second = screen.getByRole('button', { name: /Terapias de purgas/ })
    expect(second).toHaveClass('min-h-11', 'w-full')
    second.focus()
    await userEvent.keyboard('{Enter}')
    expect(second).toHaveAttribute('aria-expanded', 'true')
    const third = screen.getByRole('button', { name: /Conversatorios/ })
    third.focus()
    await userEvent.keyboard(' ')
    expect(third).toHaveAttribute('aria-expanded', 'true')
    expect(second).toHaveAttribute('aria-expanded', 'false')
  })

  it('los separadores y los rombos numerados son decorativos', () => {
    const { container } = renderAt(<Salud />, '/salud-y-medicina-tradicional/')
    const separadores = container.querySelectorAll('.rombos-separador')
    expect(separadores).toHaveLength(5)
    for (const s of separadores) expect(s.closest('[aria-hidden="true"]')).not.toBeNull()
    for (const b of container.querySelectorAll('button')) {
      expect(b.querySelector('[aria-hidden="true"]')).not.toBeNull()
    }
  })
})
