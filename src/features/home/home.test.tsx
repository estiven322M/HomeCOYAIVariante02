import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { dict } from '@/content'
import { LangProvider, LangSwitch } from '@/shared/i18n'
import { IntroProvider } from '@/shared/intro/intro-context'
import { Hero } from './components/Hero'
import { Colaborar, Explora, Footer, Proyecto, QueEs } from './components/Sections'

function renderHome() {
  return render(
    <LangProvider>
      <IntroProvider>
        <LangSwitch />
        <Hero />
        <QueEs />
        <Proyecto />
        <Explora />
        <Colaborar />
        <Footer />
      </IntroProvider>
    </LangProvider>,
  )
}

describe('feature home', () => {
  it('se renderiza sin errores en español', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(dict.es.hero.title)
    expect(screen.getByRole('heading', { level: 2, name: dict.es.queEs.title })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('es')
  })

  it('cambia a inglés con el selector de idioma', async () => {
    renderHome()
    await userEvent.click(screen.getByRole('switch', { name: dict.es.switchLabel }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(dict.en.hero.title)
    expect(screen.getByRole('heading', { level: 2, name: dict.en.queEs.title })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
  })
})
