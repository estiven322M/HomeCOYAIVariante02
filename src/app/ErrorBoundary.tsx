import { Component, type ErrorInfo, type ReactNode } from 'react'
import { dict } from '@/content'

type Props = { children: ReactNode }
type State = { failed: boolean }

/**
 * Último recurso: si algo lanza durante el render, muestra una pantalla accesible en lugar de dejar la
 * página en blanco. Vive fuera de los proveedores, así que no usa el contexto de idioma: toma el idioma
 * del <html lang> (que mantiene LangProvider) y, si no hay, español.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error no controlado en la interfaz:', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    const lang = document.documentElement.lang.startsWith('en') ? 'en' : 'es'
    const t = dict[lang].errorBoundary
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-calido px-6 text-carbon">
        <div role="alert" className="max-w-xl text-center">
          <h1 className="font-serif text-4xl font-light lg:text-5xl">{t.title}</h1>
          <p className="mt-6 text-base leading-relaxed">{t.text}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-10 inline-flex min-h-12 items-center justify-center bg-selva px-6 text-sm tracking-wide text-calido transition-colors duration-500 hover:bg-bosque"
          >
            {t.reload}
          </button>
        </div>
      </main>
    )
  }
}
