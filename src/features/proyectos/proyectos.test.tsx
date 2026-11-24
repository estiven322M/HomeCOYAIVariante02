import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import type { Proyecto } from '@/content/es/proyectos'
import { Proyectos } from './components/Proyectos'

const langs = [
  ['es', '/proyectos/'],
  ['en', '/en/projects/'],
] as const

/** La página tal como la monta ProyectosPage: el primer proyecto del idioma. */
const Pagina = ({ lang }: { lang: 'es' | 'en' }) => <Proyectos project={dict[lang].proyectos.items[0]} />

describe('feature proyectos', () => {
  it.each(langs)('un solo h1 con el título del proyecto, sin corchetes (%s)', (lang, path) => {
    const { container } = renderAt(<Pagina lang={lang} />, path)
    const h1 = screen.getAllByRole('heading', { level: 1 })
    expect(h1).toHaveLength(1)
    expect(h1[0]).toHaveTextContent(dict[lang].proyectos.items[0].hero.title)
    expect(container.textContent).not.toMatch(/\[[^\]]+\]/)
  })

  it.each(langs)('los encabezados no saltan niveles (%s)', (lang, path) => {
    renderAt(<Pagina lang={lang} />, path)
    const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName[1]))
    levels.forEach((l, i) => {
      if (i > 0) expect(l - (levels[i - 1] ?? 1)).toBeLessThanOrEqual(1)
    })
  })

  it.each(langs)('justificados solo los párrafos de «por qué»; la entradilla y la ficha, no (%s)', (lang, path) => {
    const { container } = renderAt(<Pagina lang={lang} />, path)
    const p = dict[lang].proyectos.items[0]
    const justified = [...container.querySelectorAll('p.justificado')].map((x) => x.textContent)
    expect(justified).toEqual(p.porQue.paragraphs)
    expect(container.querySelector('dl')?.closest('.justificado')).toBeNull()
  })

  it.each(langs)('ficha de la lengua como lista de definiciones (%s)', (lang, path) => {
    renderAt(<Pagina lang={lang} />, path)
    const f = dict[lang].proyectos.items[0].porQue.ficha
    const ficha = screen.getByRole('region', { name: f.title })
    for (const row of f.rows) {
      expect(within(ficha).getByText(row.label)).toBeInTheDocument()
      expect(within(ficha).getByText(row.value)).toBeInTheDocument()
    }
  })

  it.each(langs)('tres tarjetas con h3 e iconos decorativos (%s)', (lang, path) => {
    const { container } = renderAt(<Pagina lang={lang} />, path)
    const frentes = dict[lang].proyectos.items[0].iniciativa.frentes
    for (const f of frentes) expect(screen.getByRole('heading', { level: 3, name: f.title })).toBeInTheDocument()
    const icons = container.querySelectorAll('ol svg')
    expect(icons).toHaveLength(3)
    for (const svg of icons) expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it.each(langs)('sin fotos todavía: marcadores sin texto y sin imágenes rotas (%s)', (lang, path) => {
    const { container } = renderAt(<Pagina lang={lang} />, path)
    expect(container.querySelectorAll('img')).toHaveLength(0)
  })

  it.each(langs)('la línea de estado está oculta por defecto y sale si el contenido lo activa (%s)', (lang, path) => {
    const base = dict[lang].proyectos.items[0]
    expect(base.hero.estado.visible).toBe(false)
    const hidden = renderAt(<Proyectos project={base} />, path)
    expect(hidden.container.textContent).not.toContain(base.hero.estado.label)
    hidden.unmount()

    const shown: Proyecto = { ...base, hero: { ...base.hero, estado: { ...base.hero.estado, visible: true } } }
    const { container } = renderAt(<Proyectos project={shown} />, path)
    expect(container.textContent).toContain(base.hero.estado.label)
    for (const item of base.hero.estado.items) expect(container.textContent).toContain(item.value)
  })
})
