import { useState } from 'react'

export type FormStatus = 'idle' | 'sending' | 'success' | 'error'

/** Codifica los campos del formulario como `application/x-www-form-urlencoded` (lo que espera Netlify Forms). */
export function encodeForm(data: FormData): string {
  const params = new URLSearchParams()
  for (const [key, value] of data.entries()) {
    if (typeof value === 'string') params.append(key, value)
  }
  return params.toString()
}

/**
 * Envío por `fetch` de un formulario de Netlify Forms (el formulario debe existir en el HTML prerenderizado con
 * `data-netlify="true"` y un campo oculto `form-name`). Devuelve el estado (`idle`, `sending`, `success`, `error`) y
 * `submit(form)`, que resuelve `true` si el envío fue aceptado. Ver ADR 0009.
 */
export function useNetlifyForm() {
  const [status, setStatus] = useState<FormStatus>('idle')

  async function submit(form: HTMLFormElement): Promise<boolean> {
    setStatus('sending')
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm(new FormData(form)),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setStatus('success')
      return true
    } catch {
      setStatus('error')
      return false
    }
  }

  return { status, submit }
}
