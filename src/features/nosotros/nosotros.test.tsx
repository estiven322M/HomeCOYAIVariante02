import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { dict } from '@/content'
import { LangProvider, LangSwitch } from '@/shared/i18n'
import { Nosotros } from './components/Nosotros'

const esTitle = dict.es.nav[0]?.label ?? ''
const enTitle = dict.en.nav[0]?.label ?? ''

function renderNosotros() {
  return render(
    <LangProvider>
      <LangSwitch />
      <Nosotros />
    </LangProvider>,
  )
}

describe('feature nosotros', () => {
  it('se renderiza sin errores en español', () => {
    renderNosotros()
    expect(esTitle).not.toBe('')
    expect(screen.getByRole('heading', { level: 2, name: esTitle })).toBeInTheDocument()
  })

  it('cambia a inglés con el selector de idioma', async () => {
    renderNosotros()
    await userEvent.click(screen.getByRole('switch', { name: dict.es.switchLabel }))
    expect(screen.getByRole('heading', { level: 2, name: enTitle })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
  })
})
