import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { LangSwitch } from '@/shared/i18n'
import { IntroProvider } from '@/shared/intro/intro-context'
import { Hero } from './components/Hero'
import { Colaborar, Explora, Footer, Proyecto, QueEs } from './components/Sections'

function renderHome(path: string) {
  return renderAt(
    <IntroProvider>
      <LangSwitch />
      <Hero />
      <QueEs />
      <Proyecto />
      <Explora />
      <Colaborar />
      <Footer />
    </IntroProvider>,
    path,
  )
}

describe('feature home', () => {
  it('se renderiza sin errores en español en «/»', () => {
    renderHome('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(dict.es.hero.title)
    expect(screen.getByRole('heading', { level: 2, name: dict.es.queEs.title })).toBeInTheDocument()
  })

  it('se renderiza en inglés en «/en/», sin leer localStorage ni navigator', () => {
    localStorage.setItem('ecoyai-lang', 'es') // ya no influye: el idioma sale de la URL
    renderHome('/en/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(dict.en.hero.title)
  })

  it('el selector de idioma es un enlace a la misma página en el otro idioma', async () => {
    renderHome('/')
    const link = screen.getByRole('link', { name: dict.es.switchLabel })
    expect(link).toHaveAttribute('href', '/en/')
    await userEvent.click(link)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(dict.en.hero.title)
    expect(screen.getByRole('link', { name: dict.en.switchLabel })).toHaveAttribute('href', '/')
  })
})
