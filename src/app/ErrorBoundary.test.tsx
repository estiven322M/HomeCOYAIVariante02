import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { dict } from '@/content'
import { ErrorBoundary } from './ErrorBoundary'

function Boom(): never {
  throw new Error('fallo de prueba')
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    document.documentElement.lang = ''
    vi.restoreAllMocks()
  })

  it('muestra los hijos cuando no hay error', () => {
    render(
      <ErrorBoundary>
        <p>contenido</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('contenido')).toBeInTheDocument()
  })

  it('muestra una pantalla de respaldo accesible en español', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    document.documentElement.lang = 'es'
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: dict.es.errorBoundary.title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: dict.es.errorBoundary.reload })).toBeInTheDocument()
  })

  it('usa el inglés si el documento está en inglés y recarga al pulsar el botón', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    document.documentElement.lang = 'en'
    const reload = vi.fn()
    vi.stubGlobal('location', { ...window.location, reload })
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    await userEvent.click(screen.getByRole('button', { name: dict.en.errorBoundary.reload }))
    expect(reload).toHaveBeenCalledOnce()
    vi.unstubAllGlobals()
  })
})
