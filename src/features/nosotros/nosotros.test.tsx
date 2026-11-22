import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { LangSwitch } from '@/shared/i18n'
import { NOMBRES_PROPIOS, TextoCorrido } from '@/shared/ui/TextoCorrido'
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

  it.each(['es', 'en'] as const)('la frase del pie de foto reutiliza home.queEs.quote (%s)', (lang) => {
    renderNosotros(lang === 'es' ? '/' : '/en/')
    expect(screen.getByText(dict[lang].home.queEs.quote)).toBeInTheDocument()
  })

  it.each(['es', 'en'] as const)('la junta son tres integrantes con iniciales (%s)', (lang) => {
    const { container } = renderNosotros(lang === 'es' ? '/' : '/en/')
    const members = dict[lang].nosotros.equipo.junta.members
    expect(members).toHaveLength(3)
    for (const m of members) {
      expect(screen.getByRole('heading', { level: 4, name: m.name })).toBeInTheDocument()
      // Iniciales decorativas (el nombre ya está en el encabezado).
      expect(screen.getByText(m.initials).parentElement).toHaveAttribute('aria-hidden', 'true')
    }
    // Victoriano figura como Taita (liderazgo), no como tarjeta de la junta.
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(3)
    expect(container.querySelectorAll('section#mision figure blockquote')).toHaveLength(1)
  })

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

  it('los nombres propios del contenido de Nosotros y Inicio quedan protegidos', () => {
    for (const lang of ['es', 'en'] as const) {
      const textos = [
        ...dict[lang].nosotros.historia.paragraphs,
        dict[lang].nosotros.mision.mision.t,
        dict[lang].home.queEs.p2,
      ]
      const { container } = render(
        <>
          {textos.map((t) => (
            <TextoCorrido key={t.slice(0, 20)}>{t}</TextoCorrido>
          ))}
        </>,
      )
      for (const span of container.querySelectorAll('span.hyphens-none')) {
        expect(NOMBRES_PROPIOS).toContain(span.textContent)
      }
      // Ningún nombre propio queda fuera de un <span> protegido.
      const sinProteger = [...container.querySelectorAll('p')].flatMap((p) =>
        [...p.childNodes]
          .filter((n) => n.nodeType === 3)
          .filter((n) =>
            NOMBRES_PROPIOS.filter((x) => x !== 'Zio Bain').some((x) => (n.textContent ?? '').includes(x)),
          ),
      )
      expect(sinProteger).toHaveLength(0)
    }
  })

  it('la entradilla de Historia no se justifica y los párrafos de cuerpo sí', () => {
    const { container } = renderNosotros('/')
    const ps = [...container.querySelectorAll('#historia p')].filter((p) => p.textContent && p.textContent.length > 120)
    expect(ps[0]?.className).not.toContain('justificado')
    expect(ps.slice(1, 4).every((p) => p.classList.contains('justificado'))).toBe(true)
  })

  it('las zonas claras llevan el patrón y el bloque oscuro de Equipo no', () => {
    const { container } = renderNosotros('/')
    const zones = [...container.querySelectorAll('.patron-lateral')].map((s) => s.parentElement?.parentElement)
    expect(new Set(zones).size).toBe(1) // Historia–Valores
    expect(zones.some((z) => z?.querySelector('#historia') && z.querySelector('#valores'))).toBe(true)
    expect(zones.every((z) => !z?.querySelector('#equipo'))).toBe(true)
  })
})
