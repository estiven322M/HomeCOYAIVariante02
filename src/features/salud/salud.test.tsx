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
  })

  it.each(langs)('imágenes: hero decorativo; retrato y prácticas con texto alternativo (%s)', (lang, path) => {
    const { container } = renderAt(<Salud />, path)
    const s = dict[lang].salud
    const imgs = [...container.querySelectorAll('img')]
    const alts = imgs.map((i) => i.getAttribute('alt'))
    expect(alts.every((a) => a !== null)).toBe(true) // ninguna sin atributo alt
    expect(alts).toContain(s.llamado.imageAlt)
    expect(s.llamado.imageAlt).toContain('Victoriano Piaguaje Yaiguaje')
    for (const a of s.encuentros.imageAlts) expect(alts).toContain(a)
    // El hero es decorativo (los demás, con texto salvo las de opacidad 0 del acordeón de escritorio).
    expect(imgs.filter((i) => i.getAttribute('src')?.includes('/salud/hero'))[0]?.getAttribute('alt')).toBe('')
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
    expect(html.match(/aria-expanded="true"/g)).toHaveLength(5) // 4 prácticas + el protocolo
    expect(html).not.toMatch(/<div id="practica-\d-panel"[^>]*hidden/)
    // Cada panel lleva su imagen y no hay figura lateral hasta hidratar.
    expect(html.match(/<figure/g)).toHaveLength(5) // 4 prácticas + el retrato de El llamado
  })

  it.each(langs)(
    'al cargar solo la primera está abierta; una sola abierta a la vez; la imagen sigue a la abierta (%s)',
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
      expect(caption()).toBe(items[0]?.title)

      await userEvent.click(btn(2))
      expect(btn(2)).toHaveAttribute('aria-expanded', 'true')
      expect(btn(0)).toHaveAttribute('aria-expanded', 'false')
      expect(document.querySelectorAll('[aria-expanded="true"]')).toHaveLength(1)
      expect(caption()).toBe(items[2]?.title)

      // Indicadores: las cerradas llevan «+»; la abierta, un rombo de estado (nunca un «−», que sugeriría cerrarla).
      for (const i of [0, 1, 3]) expect(btn(i).querySelector('svg path')?.getAttribute('d')).toBe('M2 7H12M7 2V12')
      expect(btn(2).querySelector('svg')).toBeNull()
      expect(btn(2).querySelector('[class*="clip-path"]')).not.toBeNull()
      // El pie de la imagen es texto normal (sin mayúsculas ni tracking amplio).
      expect(document.querySelector('figcaption')?.className).not.toMatch(/uppercase|tracking/)
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

  it('los separadores y los rombos (sin número) son decorativos', () => {
    const { container } = renderAt(<Salud />, '/salud-y-medicina-tradicional/')
    const separadores = container.querySelectorAll('.rombos-separador')
    expect(separadores).toHaveLength(5)
    for (const s of separadores) expect(s.closest('[aria-hidden="true"]')).not.toBeNull()
    for (const b of container.querySelectorAll('button')) {
      expect(b.querySelector('[aria-hidden="true"]')).not.toBeNull()
    }
    for (const b of container.querySelectorAll('button[id^="practica-"]')) {
      expect(b.textContent).not.toMatch(/\d/)
    }
  })
})

describe('seguridad y protocolo', () => {
  it.each(langs)('tres tarjetas con texto a la izquierda (sin justificar) y rombos decorativos (%s)', (lang, path) => {
    const { container } = renderAt(<Salud />, path)
    const c = dict[lang].salud.cuidado
    const cards = container.querySelectorAll('section ul.grid > li')
    expect(cards).toHaveLength(3)
    cards.forEach((li, i) => {
      expect(li.querySelector('h3')).toHaveTextContent(c.items[i]?.title ?? '')
      expect(li.querySelector('p')?.className).not.toContain('justificado')
      expect(li.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    })
    // Solo El llamado se justifica.
    expect(container.querySelectorAll('.justificado')).toHaveLength(2)
  })

  it.each(langs)('el protocolo se abre y se cierra (cerrado al cargar con JS) (%s)', async (lang, path) => {
    renderAt(<Salud />, path)
    const p = dict[lang].salud.protocolo
    const btn = screen.getByRole('button', { name: new RegExp(p.title) })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    expect(btn.closest('h2')).not.toBeNull()
    const panel = document.getElementById(btn.getAttribute('aria-controls') ?? '')
    expect(panel).toHaveAttribute('hidden')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    expect(panel).not.toHaveAttribute('hidden')
    for (const point of p.points) expect(panel).toHaveTextContent(point)
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  it('sin JavaScript el protocolo sale abierto con sus cuatro puntos', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/salud-y-medicina-tradicional/']}>
        <LangFromUrl>
          <Salud />
        </LangFromUrl>
      </MemoryRouter>,
    )
    for (const point of dict.es.salud.protocolo.points) expect(html).toContain(point)
    expect(html).not.toMatch(/<div id="protocolo-panel"[^>]*hidden/)
  })
})
