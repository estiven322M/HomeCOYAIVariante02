import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { LangSwitch } from '@/shared/i18n'
import { Nosotros } from './components/Nosotros'

const esTitle = dict.es.nav[0]?.label ?? ''
const enTitle = dict.en.nav[0]?.label ?? ''

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
    expect(screen.getByRole('heading', { level: 2, name: esTitle })).toBeInTheDocument()
  })

  it('cambia a inglés al seguir el enlace del selector de idioma', async () => {
    renderNosotros('/')
    await userEvent.click(screen.getByRole('link', { name: dict.es.switchLabel }))
    expect(screen.getByRole('heading', { level: 2, name: enTitle })).toBeInTheDocument()
  })
})
