import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { LangSwitch } from '@/shared/i18n'
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
})
