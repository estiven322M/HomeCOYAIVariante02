import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { CONTACTO, type Contacto } from '@/content/contacto'
import { LANGS, NAV_KEYS, NOT_FOUND, PRIVACIDAD_EN_PIE, pathFor } from '@/shared/i18n/routes'
import { Footer } from './Footer'

// Datos ficticios: solo para las pruebas.
const COMPLETO: Contacto = {
  correo: 'hola@example.org',
  whatsapp: '+57 300 000 0000',
  redes: {
    instagram: 'https://example.org/instagram',
    youtube: 'https://example.org/youtube',
    facebook: 'https://example.org/facebook',
  },
}

const footer = () => screen.getByRole('contentinfo')
const rotulos = () =>
  within(footer())
    .getAllByRole('heading')
    .map((h) => `${h.tagName} ${h.textContent}`)
const hrefs = () => [...footer().querySelectorAll('a')].map((a) => a.getAttribute('href'))

describe.each(LANGS)('pie · %s', (lang) => {
  const t = dict[lang].common

  it('«Explora» sale de NAV_KEYS, en orden y con sus etiquetas, y marca la página actual', () => {
    renderAt(<Footer />, pathFor('eventos', lang))
    const links = within(screen.getByRole('navigation', { name: t.footer.navAria })).getAllByRole('link')
    expect(links.map((a) => [a.getAttribute('href'), a.textContent])).toEqual(
      NAV_KEYS.map((key, i) => [pathFor(key, lang), t.nav[i]!.label]),
    )
    expect(links.filter((a) => a.getAttribute('aria-current') === 'page')).toEqual([links[NAV_KEYS.indexOf('eventos')]])
  })

  it('lleva la marca, el lema y la ubicación del menú', () => {
    renderAt(<Footer />, pathFor('home', lang))
    expect(within(footer()).getByRole('link', { name: t.logoAria })).toHaveAttribute('href', pathFor('home', lang))
    expect(footer()).toHaveTextContent(t.footer.tagline)
    expect(footer()).toHaveTextContent(t.sideNav.place)
  })

  it('selector de idioma: el activo no es enlace y el otro lleva a la misma página con su ancla', () => {
    const otro = lang === 'es' ? 'en' : 'es'
    const nombres = { es: 'Español', en: 'English' }
    renderAt(<Footer />, `${pathFor('nosotros', lang)}#equipo`)
    const activo = within(footer()).getByText(nombres[lang])
    expect(activo.tagName).toBe('SPAN')
    expect(activo).toHaveAttribute('aria-current', 'true')
    expect(activo).toHaveAttribute('lang', lang)
    const enlace = within(footer()).getByRole('link', { name: nombres[otro] })
    expect(enlace).toHaveAttribute('href', `${pathFor('nosotros', otro)}#equipo`)
    expect(enlace).toHaveAttribute('lang', otro)
    expect(enlace).toHaveAttribute('hreflang', otro)
  })

  it('en la 404 el otro idioma lleva a su portada', () => {
    const otro = lang === 'es' ? 'en' : 'es'
    renderAt(<Footer />, NOT_FOUND[lang])
    expect(footer().querySelector(`a[hreflang="${otro}"]`)).toHaveAttribute('href', pathFor('home', otro))
  })

  it('sin datos: contacto y redes no existen; solo «Explora» e «Idioma», como <h2>', () => {
    expect(CONTACTO).toEqual({})
    renderAt(<Footer />, pathFor('home', lang))
    expect(rotulos()).toEqual([`H2 ${t.footer.explore}`, `H2 ${t.footer.language}`])
    expect(hrefs().filter((h) => /^(mailto:|https?:)/.test(h ?? ''))).toEqual([])
    expect(footer().textContent).not.toMatch(/\[|PENDIENTE|PENDING/i)
  })

  it('con datos: correo, WhatsApp y cada red con su nombre accesible', () => {
    renderAt(<Footer contacto={COMPLETO} />, pathFor('home', lang))
    expect(rotulos()).toEqual(
      [t.footer.explore, t.footer.contact, t.footer.social, t.footer.language].map((r) => `H2 ${r}`),
    )
    expect(screen.getByRole('link', { name: COMPLETO.correo })).toHaveAttribute('href', `mailto:${COMPLETO.correo}`)
    expect(screen.getByRole('link', { name: `WhatsApp ${COMPLETO.whatsapp}` })).toHaveAttribute(
      'href',
      'https://wa.me/573000000000',
    )
    for (const [nombre, red] of [
      ['Instagram', 'instagram'],
      ['YouTube', 'youtube'],
      ['Facebook', 'facebook'],
    ] as const) {
      expect(screen.getByRole('link', { name: nombre })).toHaveAttribute('href', COMPLETO.redes![red])
    }
  })

  it('con datos parciales solo sale lo que existe; los vacíos no cuentan', () => {
    renderAt(<Footer contacto={{ correo: '', redes: { youtube: 'https://example.org/youtube' } }} />, '/')
    const t0 = dict.es.common.footer
    expect(rotulos()).toEqual([t0.explore, t0.social, t0.language].map((r) => `H2 ${r}`))
    expect(screen.queryByRole('link', { name: 'Instagram' })).toBeNull()
  })

  it('Privacidad: apagada hoy; encendida, enlaza en el idioma actual y marca la página', () => {
    expect(PRIVACIDAD_EN_PIE).toBe(false)
    const { unmount } = renderAt(<Footer />, pathFor('privacidad', lang))
    expect(hrefs()).not.toContain(pathFor('privacidad', lang))
    unmount()
    renderAt(<Footer conPrivacidad />, pathFor('privacidad', lang))
    const enlace = screen.getByRole('link', { name: t.privacy.title })
    expect(enlace).toHaveAttribute('href', pathFor('privacidad', lang))
    expect(enlace).toHaveAttribute('aria-current', 'page')
  })
})
