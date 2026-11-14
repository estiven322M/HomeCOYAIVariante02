import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { LangSwitch } from '@/shared/i18n'
import { pathFor } from '@/shared/i18n/routes'
import { Nosotros } from './components/Nosotros'

const esTitle = dict.es.common.nav[0]?.label ?? ''
const enTitle = dict.en.common.nav[0]?.label ?? ''

function renderNosotros(path: string) {
  return renderAt(
    <>
      <LangSwitch />
      <Nosotros />
    </>,
    path,
  )
}

describe('feature nosotros', () => {
  it('se renderiza sin errores en español', () => {
    renderNosotros('/')
    expect(esTitle).not.toBe('')
    expect(screen.getByRole('heading', { level: 1, name: esTitle })).toBeInTheDocument()
  })

  it('cambia a inglés al seguir el enlace del selector de idioma', async () => {
    renderNosotros('/')
    await userEvent.click(screen.getByRole('link', { name: dict.es.common.switchLabel }))
    expect(screen.getByRole('heading', { level: 1, name: enTitle })).toBeInTheDocument()
  })

  it('la barra interna enlaza a cuatro anclas que existen (los mismos ids en español e inglés)', () => {
    for (const lang of ['es', 'en'] as const) {
      const { container, unmount } = renderNosotros(lang === 'es' ? '/' : '/en/')
      const nav = screen.getByRole('navigation', { name: dict[lang].nosotros.navAria })
      const ids = within(nav)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')?.slice(1))
      expect(ids).toEqual(['historia', 'mision', 'valores', 'equipo'])
      for (const id of ids) expect(container.querySelector(`#${id}`)).not.toBeNull()
      expect(nav.querySelector('[aria-current]')).toBeNull() // el render inicial no marca ninguna (prerender)
      unmount()
    }
  })

  it('la imagen del hero es decorativa, con prioridad y sin lazy; sin textos entre corchetes', () => {
    const { container } = renderNosotros('/')
    const hero = container.querySelector('img')
    expect(hero?.getAttribute('alt')).toBe('')
    expect(hero?.getAttribute('fetchpriority')).toBe('high')
    expect(hero?.getAttribute('loading')).toBeNull()
    expect(container.textContent).not.toMatch(/[[^]]+]/)
  })

  it.each(['es', 'en'] as const)('la cita del propósito es un fragmento literal del tercer párrafo (%s)', (lang) => {
    const n = dict[lang].nosotros
    const quote = n.mision.purpose.quote
    const fragment = quote.charAt(0).toLowerCase() + quote.slice(1)
    expect(n.historia.paragraphs[2]).toContain(fragment)
  })

  it.each(['es', 'en'] as const)('la frase del pie de foto reutiliza home.queEs.quote (%s)', (lang) => {
    renderNosotros(lang === 'es' ? '/' : '/en/')
    expect(screen.getByText(dict[lang].home.queEs.quote)).toBeInTheDocument()
  })

  it.each(['es', 'en'] as const)(
    'el cierre enlaza a Transparencia y la junta usa foto o iniciales según haya retrato (%s)',
    (lang) => {
      const { container } = renderNosotros(lang === 'es' ? '/' : '/en/')
      const href = pathFor('transparencia', lang) + '#marco-legal'
      expect(screen.getByRole('link', { name: new RegExp(dict[lang].nosotros.cierre.link) })).toHaveAttribute(
        'href',
        href,
      )
      for (const m of dict[lang].nosotros.equipo.junta.members) {
        expect(screen.getByRole('heading', { level: 4, name: m.name })).toBeInTheDocument()
        if (m.photoAlt) {
          // Con foto: imagen con su alt, sin marcador de iniciales.
          expect(screen.getByRole('img', { name: m.photoAlt })).toBeInTheDocument()
          expect(screen.queryByText(m.initials)).toBeNull()
        } else {
          // Sin foto: iniciales decorativas (el nombre ya está en el encabezado).
          expect(screen.getByText(m.initials).parentElement).toHaveAttribute('aria-hidden', 'true')
        }
      }
      expect(container.querySelectorAll('section#mision figure blockquote')).toHaveLength(1)
    },
  )

  it.each(['es', 'en'] as const)(
    'valores: siete tarjetas, sin numeración ni imagen, la última ocupa dos columnas (%s)',
    (lang) => {
      const { container } = renderNosotros(lang === 'es' ? '/' : '/en/')
      const items = container.querySelectorAll('#valores ul > li')
      expect(items).toHaveLength(dict[lang].nosotros.valores.items.length)
      expect(items).toHaveLength(7)
      items.forEach((li, i) => {
        // El título es lo primero de la tarjeta; nada de «01»…«07» ni rombos.
        expect(li.firstElementChild?.tagName).toBe('H3')
        expect(li.textContent).toBe(
          `${dict[lang].nosotros.valores.items[i]?.k}${dict[lang].nosotros.valores.items[i]?.t}`,
        )
        expect(li.querySelector('img, svg, [aria-hidden]')).toBeNull()
      })
      expect(container.querySelector('#valores img')).toBeNull()
      expect(items[6]?.className).toContain('last:col-span-2')
    },
  )

  it('las zonas claras llevan el patrón y el bloque oscuro de Equipo no', () => {
    const { container } = renderNosotros('/')
    const zones = [...container.querySelectorAll('.patron-lateral')].map((s) => s.parentElement?.parentElement)
    expect(new Set(zones).size).toBe(2) // Historia–Valores y el cierre legal
    expect(zones.some((z) => z?.querySelector('#historia') && z.querySelector('#valores'))).toBe(true)
    expect(zones.every((z) => !z?.querySelector('#equipo'))).toBe(true)
  })
})
