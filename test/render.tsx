import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { LangFromUrl } from '@/shared/i18n'

/**
 * Renderiza con un router en memoria y el idioma tomado de la URL, igual que en la app:
 * `renderAt(ui, '/en/')` ve el sitio en inglés.
 */
export function renderAt(ui: ReactElement, path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LangFromUrl>{ui}</LangFromUrl>
    </MemoryRouter>,
  )
}
