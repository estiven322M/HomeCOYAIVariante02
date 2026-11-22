import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { LangFromUrl } from '@/shared/i18n'
import { Solicitar } from './components/Solicitar'
import { FORM_NAME, invalidFields, isValidContact } from './components/SolicitudForm'

// El interruptor se lee de `env` al renderizar: lo hacemos mutable para probar apagado y encendido.
const mockEnv = vi.hoisted(() => ({ FORMS_ENABLED: true }))
vi.mock('@/env', () => ({ env: mockEnv }))

const langs = [
  ['es', '/salud-y-medicina-tradicional/', '/gracias/'],
  ['en', '/en/health-and-traditional-medicine/', '/en/thank-you/'],
] as const

const server = (path: string) =>
  renderToString(
    <MemoryRouter initialEntries={[path]}>
      <LangFromUrl>
        <Solicitar />
      </LangFromUrl>
    </MemoryRouter>,
  )

afterEach(() => {
  mockEnv.FORMS_ENABLED = true
  vi.unstubAllGlobals()
})

describe('interruptor VITE_FORMS_ENABLED', () => {
  it.each(langs)('apagado: mismo título y un botón a Contacto; el formulario no sale en el HTML (%s)', (lang, path) => {
    mockEnv.FORMS_ENABLED = false
    const html = server(path)
    expect(html).not.toContain('data-netlify')
    expect(html).not.toContain('<form')
    renderAt(<Solicitar />, path)
    const s = dict[lang].salud.solicitar
    expect(screen.getByRole('heading', { level: 2, name: s.title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: new RegExp(s.off.cta) })).toHaveAttribute(
      'href',
      lang === 'es' ? '/contacto/' : '/en/contact/',
    )
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it.each(langs)(
    'encendido: el HTML prerenderizado lleva el formulario de Netlify completo (%s)',
    (lang, path, thanks) => {
      const html = server(path)
      expect(html).toContain('data-netlify="true"')
      expect(html).toContain(`name="${FORM_NAME}"`)
      expect(html).toMatch(new RegExp(`<input type="hidden" name="form-name" value="${FORM_NAME}"`))
      expect(html).toContain(`name="idioma" value="${lang}"`)
      expect(html).toContain('netlify-honeypot="bot-field"')
      expect(html).toContain('name="bot-field"')
      expect(html).toContain(`action="${thanks}"`)
      expect(html).toContain('method="POST"')
      // Sin JavaScript: validación nativa (sin novalidate) y casilla sin marcar.
      expect(html).not.toContain('noValidate')
      expect(html).not.toContain('novalidate')
      expect(html).not.toMatch(/name="datos"[^>]*checked/)
      for (const name of ['nombre', 'pais', 'contacto', 'motivacion', 'datos']) {
        expect(html).toMatch(new RegExp(`name="${name}"[^>]*required|required[^>]*name="${name}"`))
      }
    },
  )

  it.each(langs)('encendido: campos con etiqueta, ayuda enlazada y enlace a la política (%s)', (lang, path) => {
    renderAt(<Solicitar />, path)
    const f = dict[lang].salud.solicitar.form
    for (const label of [f.name, f.country, f.contact, f.motivation]) {
      expect(screen.getByLabelText(new RegExp(label))).toBeRequired()
    }
    const motivation = screen.getByLabelText(new RegExp(f.motivation))
    expect(motivation).toHaveAccessibleDescription(f.motivationHelp)
    const consent = screen.getByRole('checkbox')
    expect(consent).not.toBeChecked()
    expect(consent).toBeRequired()
    expect(screen.getByRole('link', { name: f.consentLink })).toHaveAttribute(
      'href',
      lang === 'es' ? '/privacidad/' : '/en/privacy/',
    )
    // Tras hidratar, la validación nativa se desactiva para mostrar los errores accesibles.
    expect(document.querySelector('form')).toHaveAttribute('novalidate')
  })
})

describe('validación', () => {
  it('correo o WhatsApp: correo válido o al menos 7 dígitos', () => {
    for (const ok of ['a@b.co', ' ana@correo.org ', '+57 300 123 4567', '3001234567', '(300) 123-4567']) {
      expect(isValidContact(ok), ok).toBe(true)
    }
    for (const bad of ['', 'ana', 'ana@', '12345', 'abc 1234567x']) expect(isValidContact(bad), bad).toBe(false)
  })

  it('invalidFields detecta cada campo vacío y la casilla sin marcar', () => {
    const data = new FormData()
    expect(invalidFields(data)).toEqual(['name', 'country', 'contact', 'motivation', 'consent'])
    for (const [k, v] of Object.entries({
      nombre: 'Ana',
      pais: 'Chile',
      contacto: 'a@b.co',
      motivacion: 'Quiero saber',
      datos: 'on',
    })) {
      data.set(k, v)
    }
    expect(invalidFields(data)).toEqual([])
  })

  it.each(langs)(
    'enviar vacío: resumen con el foco, errores junto a cada campo y sin envío (%s)',
    async (lang, path) => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)
      renderAt(<Solicitar />, path)
      const f = dict[lang].salud.solicitar.form
      await userEvent.click(screen.getByRole('button', { name: new RegExp(f.submit) }))
      expect(fetchMock).not.toHaveBeenCalled()

      const summary = screen.getByRole('group', { name: f.summary })
      await waitFor(() => expect(summary).toHaveFocus())
      expect(summary.querySelectorAll('a')).toHaveLength(5)

      const name = screen.getByLabelText(new RegExp(f.name))
      expect(name).toHaveAttribute('aria-invalid', 'true')
      expect(name).toHaveAccessibleDescription(f.errors.name)
      expect(screen.getByLabelText(new RegExp(f.motivation))).toHaveAccessibleDescription(
        new RegExp(`${f.motivationHelp.slice(0, 12)}.*${f.errors.motivation}`),
      )
      const consent = screen.getByRole('checkbox')
      expect(consent).toHaveAttribute('aria-invalid', 'true')
      expect(consent).toHaveAccessibleDescription(f.errors.consent)

      // Un enlace del resumen lleva el foco a su campo.
      await userEvent.click(within(summary).getByRole('link', { name: f.errors.country }))
      expect(screen.getByLabelText(new RegExp(f.country))).toHaveFocus()

      // Al escribir en un campo, su error desaparece.
      await userEvent.type(name, 'Ana')
      expect(name).not.toHaveAttribute('aria-invalid')
      expect(screen.queryByText(f.errors.name)).toBeNull()
    },
  )
})

describe('envío simulado', () => {
  const fill = async (lang: 'es' | 'en') => {
    const f = dict[lang].salud.solicitar.form
    await userEvent.type(screen.getByLabelText(new RegExp(f.name)), 'Ana Prueba')
    await userEvent.type(screen.getByLabelText(new RegExp(f.country)), 'Chile')
    await userEvent.type(screen.getByLabelText(new RegExp(f.contact)), 'ana@ejemplo.org')
    await userEvent.type(screen.getByLabelText(new RegExp(f.motivation)), 'Quiero conocer los encuentros')
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: new RegExp(f.submit) }))
  }

  it.each(langs)(
    'éxito: POST urlencoded con form-name e idioma, mensaje en la región viva y formulario limpio (%s)',
    async (lang, path) => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 })
      vi.stubGlobal('fetch', fetchMock)
      renderAt(<Solicitar />, path)
      await fill(lang)
      const f = dict[lang].salud.solicitar.form

      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(f.success))
      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
      expect(url).toBe('/')
      expect(init.method).toBe('POST')
      expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/x-www-form-urlencoded')
      const body = new URLSearchParams(String(init.body))
      expect(body.get('form-name')).toBe(FORM_NAME)
      expect(body.get('idioma')).toBe(lang)
      expect(body.get('nombre')).toBe('Ana Prueba')
      expect(body.get('contacto')).toBe('ana@ejemplo.org')
      expect(body.get('datos')).toBe('on')
      expect(screen.getByLabelText(new RegExp(f.name))).toHaveValue('')
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    },
  )

  it.each(langs)('fallo: mensaje de error en la región viva y se puede reintentar (%s)', async (lang, path) => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, status: 200 })
    vi.stubGlobal('fetch', fetchMock)
    renderAt(<Solicitar />, path)
    await fill(lang)
    const f = dict[lang].salud.solicitar.form
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(f.failure))
    // Los datos siguen en el formulario para reintentar.
    expect(screen.getByLabelText(new RegExp(f.name))).toHaveValue('Ana Prueba')
    await userEvent.click(screen.getByRole('button', { name: new RegExp(f.submit) }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(f.success))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
