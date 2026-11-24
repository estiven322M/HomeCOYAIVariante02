import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { NBSP, type Proyecto } from '@/content/es/proyectos'
import { LangFromUrl } from '@/shared/i18n'
import { pathFor } from '@/shared/i18n/routes'
import { Proyectos } from './components/Proyectos'
import { MAPAS } from './mapa'

const langs = [
  ['es', '/proyectos/'],
  ['en', '/en/projects/'],
] as const

/** La página tal como la monta ProyectosPage: el primer proyecto del idioma. */
const Pagina = ({ lang }: { lang: 'es' | 'en' }) => <Proyectos project={dict[lang].proyectos.items[0]} />

/** El espacio de no separación (que evita partir «Zio Bain») cuenta como espacio al comparar textos. */
const plain = (s: string) => s.split(NBSP).join(' ')

describe('feature proyectos', () => {
  it.each(langs)('un solo h1 con el título del proyecto, sin corchetes (%s)', (lang, path) => {
    const { container } = renderAt(<Pagina lang={lang} />, path)
    const h1 = screen.getAllByRole('heading', { level: 1 })
    expect(h1).toHaveLength(1)
    expect(plain(h1[0]?.textContent ?? '')).toBe(plain(dict[lang].proyectos.items[0].hero.title))
    expect(container.textContent).not.toMatch(/\[[^\]]+\]/)
  })

  it.each(langs)(
    '«Zio Bain» del título no se parte (espacio de no separación) pero el <title> SEO es texto plano (%s)',
    (lang) => {
      const p = dict[lang].proyectos.items[0]
      expect(p.hero.title).toContain(`Zio${NBSP}Bain`)
      expect(p.meta.title).not.toContain(NBSP)
      expect(p.meta.description).not.toContain(NBSP)
    },
  )

  it.each(langs)('los encabezados no saltan niveles (%s)', (lang, path) => {
    renderAt(<Pagina lang={lang} />, path)
    const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName[1]))
    levels.forEach((l, i) => {
      if (i > 0) expect(l - (levels[i - 1] ?? 1)).toBeLessThanOrEqual(1)
    })
  })

  it.each(langs)('justificados solo los párrafos de «por qué» y la entradilla del compromiso (%s)', (lang, path) => {
    const { container } = renderAt(<Pagina lang={lang} />, path)
    const p = dict[lang].proyectos.items[0]
    const justified = [...container.querySelectorAll('p.justificado')].map((x) => x.textContent)
    expect(justified).toEqual([...p.porQue.paragraphs, p.compromiso.intro])
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

describe('resguardos: desplegable y mapa', () => {
  const nombres = (MAPAS['lengua-siona']?.resguardos ?? []).map((g) => g.name)

  it.each(langs)(
    'el desplegable sale abierto con todos los resguardos y se opera con el teclado (%s)',
    async (lang, path) => {
      renderAt(<Pagina lang={lang} />, path)
      const d = dict[lang].proyectos.items[0].resguardos
      const boton = screen.getByRole('button', { name: d.disclosure })
      expect(boton).toHaveAttribute('aria-expanded', 'true')
      expect(boton.closest('h3')).not.toBeNull()
      const panel = document.getElementById(boton.getAttribute('aria-controls') ?? '')
      expect(panel).not.toBeNull()
      expect(panel).not.toHaveAttribute('hidden')
      for (const n of nombres) expect(within(panel as HTMLElement).getByText(n)).toBeInTheDocument()
      expect(within(panel as HTMLElement).getAllByRole('listitem')).toHaveLength(nombres.length)

      const user = userEvent.setup()
      boton.focus()
      await user.keyboard('{Enter}')
      expect(boton).toHaveAttribute('aria-expanded', 'false')
      expect(panel).toHaveAttribute('hidden')
      await user.keyboard(' ')
      expect(boton).toHaveAttribute('aria-expanded', 'true')
      expect(panel).not.toHaveAttribute('hidden')
    },
  )

  it('sin JavaScript (HTML del servidor) el desplegable de resguardos sale abierto con su lista', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/proyectos/']}>
        <LangFromUrl>
          <Pagina lang="es" />
        </LangFromUrl>
      </MemoryRouter>,
    )
    expect(html).toContain('id="resguardos-btn"')
    expect(html).toMatch(/id="resguardos-btn"[^>]*aria-expanded="true"/)
    expect(html).not.toMatch(/<div id="resguardos-panel"[^>]*hidden/)
    for (const n of nombres) expect(html).toContain(n)
  })

  it.each(langs)('el mapa es una imagen con descripción que nombra todos los resguardos y ríos (%s)', (lang, path) => {
    const { container } = renderAt(<Pagina lang={lang} />, path)
    const d = dict[lang].proyectos.items[0].resguardos.mapa
    const mapa = screen.getByRole('img', { name: d.desc })
    expect(mapa.tagName.toLowerCase()).toBe('svg')
    for (const n of nombres) expect(d.desc).toContain(n)
    // Un rombo por resguardo (los de la lista del desplegable son <span>, no <path> del SVG).
    expect(mapa.querySelectorAll('g.fill-ocre path')).toHaveLength(nombres.length)
    for (const rio of Object.values(d.rios)) expect(mapa.textContent).toContain(rio)
    expect(container.textContent).toContain(d.nota)
  })

  it('cada río del mapa tiene su nombre en los dos idiomas y cada proyecto tiene mapa', () => {
    for (const lang of ['es', 'en'] as const)
      for (const p of dict[lang].proyectos.items) {
        const mapa = MAPAS[p.slug]
        expect(mapa).toBeDefined()
        for (const r of mapa?.rios ?? []) expect(p.resguardos.mapa.rios[r.id]).toBeTruthy()
      }
  })
})

describe('compromiso y llamado a la acción', () => {
  it.each(langs)('cuatro referencias con iconos decorativos (%s)', (lang, path) => {
    const { container } = renderAt(<Pagina lang={lang} />, path)
    const refs = dict[lang].proyectos.items[0].compromiso.refs
    expect(refs).toHaveLength(4)
    const textos = [...container.querySelectorAll('ul li p')].map((x) => x.textContent)
    for (const r of refs) expect(textos).toContain(r.title)
    // Los rangos de años («2022–2032») no se parten: van en un span con white-space: nowrap.
    const rangos = [...container.querySelectorAll('ul li p span.whitespace-nowrap')].map((x) => x.textContent)
    const conRango = refs.filter((r) => /\d{4}–\d{4}/.test(r.title))
    expect(conRango.length).toBeGreaterThan(0) // la prueba no puede pasar en vacío
    expect(rangos).toHaveLength(conRango.length)
    for (const r of rangos) expect(r).toMatch(/^\d{4}–\d{4}$/)
    const icons = container.querySelectorAll('ul svg')
    expect(icons).toHaveLength(4)
    for (const svg of icons) expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it.each(langs)('el botón del llamado lleva a Donaciones / Alianzas en el idioma de la página (%s)', (lang, path) => {
    renderAt(<Pagina lang={lang} />, path)
    const cta = dict[lang].proyectos.items[0].cta
    const link = screen.getByRole('link', { name: new RegExp(cta.button) })
    expect(link).toHaveAttribute('href', pathFor('colaborar', lang))
    expect(screen.getByRole('heading', { level: 2, name: cta.title })).toBeInTheDocument()
  })
})
