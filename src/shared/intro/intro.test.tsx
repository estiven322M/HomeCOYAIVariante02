import { act, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { INTRO_BOOT_SCRIPT } from './boot-script'
import { IntroProvider, SEEN_KEY } from './intro-context'

/** El intro solo se muestra si la sesión EMPIEZA en la portada; el script de <head> y IntroProvider deciden igual. */
describe('intro: solo si la sesión empieza en la portada', () => {
  beforeEach(() => {
    sessionStorage.clear()
    document.documentElement.removeAttribute('data-intro')
  })
  afterEach(() => window.history.pushState({}, '', '/'))

  const mount = (path: string) =>
    act(() => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <IntroProvider>{null}</IntroProvider>
        </MemoryRouter>,
      )
    })

  it.each(['/', '/en/'])('IntroProvider: empezar en %s lo activa', (path) => {
    mount(path)
    expect(document.documentElement.dataset.intro).toBe('active')
  })

  it.each(['/nosotros/', '/en/about/', '/404/', '/no-existe/'])(
    'IntroProvider: empezar en %s no lo muestra y lo da por visto',
    (path) => {
      mount(path)
      expect(document.documentElement.dataset.intro).toBe('done')
      expect(sessionStorage.getItem(SEEN_KEY)).toBe('1')
    },
  )

  it('IntroProvider: tras entrar por otra página, la portada ya no lo muestra', () => {
    mount('/nosotros/')
    document.documentElement.removeAttribute('data-intro')
    mount('/')
    expect(document.documentElement.dataset.intro).toBe('done')
  })

  const runBoot = (path: string) => {
    window.history.pushState({}, '', path)
    new Function(INTRO_BOOT_SCRIPT)()
  }

  it.each(['/', '/en/'])('script de <head>: en %s marca data-intro="active"', (path) => {
    runBoot(path)
    expect(document.documentElement.getAttribute('data-intro')).toBe('active')
  })

  it.each(['/nosotros/', '/en/contact/', '/404/'])(
    'script de <head>: en %s no marca nada y da el intro por visto',
    (path) => {
      runBoot(path)
      expect(document.documentElement.hasAttribute('data-intro')).toBe(false)
      expect(sessionStorage.getItem(SEEN_KEY)).toBe('1')
    },
  )

  it('script de <head>: entrar por otra página y luego ir a la portada no lo muestra', () => {
    runBoot('/nosotros/')
    runBoot('/')
    expect(document.documentElement.hasAttribute('data-intro')).toBe(false)
  })
})
