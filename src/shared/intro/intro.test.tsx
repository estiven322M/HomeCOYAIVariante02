import { act, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

  describe('ahorro de datos y conexión lenta (mismas condiciones en el script y en IntroProvider)', () => {
    const setConnection = (c: unknown) =>
      Object.defineProperty(navigator, 'connection', { value: c, configurable: true })
    afterEach(() => Reflect.deleteProperty(navigator, 'connection'))

    it.each([{ saveData: true }, { effectiveType: 'slow-2g' }, { effectiveType: '2g' }, { effectiveType: '3g' }])(
      'sin intro con %o',
      (c) => {
        setConnection(c)
        runBoot('/')
        expect(document.documentElement.hasAttribute('data-intro')).toBe(false)
        mount('/')
        expect(document.documentElement.dataset.intro).toBe('done')
      },
    )

    it.each([{ effectiveType: '4g', saveData: false }, undefined])('con intro con %o', (c) => {
      setConnection(c)
      runBoot('/')
      expect(document.documentElement.getAttribute('data-intro')).toBe('active')
      document.documentElement.removeAttribute('data-intro')
      mount('/')
      expect(document.documentElement.dataset.intro).toBe('active')
    })
  })

  describe('límite de 4 s desde el primer pintado, garantizado por el script', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      delete (window as unknown as { __introReady?: boolean }).__introReady
    })
    afterEach(() => vi.useRealTimers())

    it('si React no hidrata, a los 4 s disuelve, marca visto y llega a done con los mismos tiempos', () => {
      runBoot('/')
      const d = document.documentElement
      vi.advanceTimersByTime(3999)
      expect(d.getAttribute('data-intro')).toBe('active')
      vi.advanceTimersByTime(1)
      expect(d.getAttribute('data-intro')).toBe('leaving')
      expect(sessionStorage.getItem(SEEN_KEY)).toBe('1')
      vi.advanceTimersByTime(500)
      expect(d.getAttribute('data-intro')).toBe('reveal')
      vi.advanceTimersByTime(1500)
      expect(d.getAttribute('data-intro')).toBe('done')
    })

    it('si React hidrata antes, el script cede y no toca nada', () => {
      runBoot('/')
      ;(window as unknown as { __introReady?: boolean }).__introReady = true
      vi.advanceTimersByTime(10_000)
      expect(document.documentElement.getAttribute('data-intro')).toBe('active')
    })

    it('si React hidrata después de que el script terminó, IntroProvider continúa desde su fase y no lo vuelve a mostrar', () => {
      runBoot('/')
      vi.advanceTimersByTime(4000) // leaving
      mount('/')
      expect(document.documentElement.dataset.intro).toBe('leaving')
      act(() => {
        vi.advanceTimersByTime(500)
      })
      expect(document.documentElement.dataset.intro).toBe('reveal')
      act(() => {
        vi.advanceTimersByTime(1500)
      })
      expect(document.documentElement.dataset.intro).toBe('done')
    })
  })
})
