import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useLang, usePathFor } from '@/shared/i18n'
import { useNetlifyForm } from '@/shared/hooks/useNetlifyForm'
import { CheckboxField, ErrorSummary, TextField } from '@/shared/ui/forms'

/** Nombre del formulario en Netlify (el mismo en español e inglés: Netlify exige los mismos campos en todas las páginas). */
export const FORM_NAME = 'solicitud-encuentros'

/** Clave de error → `id` del campo al que corresponde (y orden en que se listan). */
const FIELD_IDS = {
  name: 'solicitud-nombre',
  country: 'solicitud-pais',
  contact: 'solicitud-contacto',
  motivation: 'solicitud-motivacion',
  consent: 'solicitud-datos',
} as const

type ErrorKey = keyof typeof FIELD_IDS
type Errors = Partial<Record<ErrorKey, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?[\d\s().-]{7,}$/

/** Un correo válido o un número de WhatsApp (al menos 7 dígitos). */
export function isValidContact(value: string): boolean {
  const v = value.trim()
  return EMAIL.test(v) || (PHONE.test(v) && v.replace(/\D/g, '').length >= 7)
}

/** Claves de los campos inválidos de un envío (vacío = válido). */
export function invalidFields(data: FormData): ErrorKey[] {
  const text = (name: string) => String(data.get(name) ?? '').trim()
  const bad: ErrorKey[] = []
  if (!text('nombre')) bad.push('name')
  if (!text('pais')) bad.push('country')
  if (!isValidContact(text('contacto'))) bad.push('contact')
  if (!text('motivacion')) bad.push('motivation')
  if (data.get('datos') !== 'on') bad.push('consent')
  return bad
}

/**
 * Formulario de solicitud de información (Netlify Forms). El HTML prerenderizado lleva `data-netlify`, el campo oculto
 * `form-name` y un honeypot; sin JavaScript se envía de forma nativa a la página de agradecimiento. Con JavaScript se
 * valida con errores accesibles (junto a cada campo y en un resumen que recibe el foco) y se envía por `fetch`; el estado
 * (enviando, éxito, fallo) se anuncia en una región `aria-live`.
 */
export function SolicitudForm() {
  const { lang, t } = useLang()
  const pathFor = usePathFor()
  const f = t.salud.solicitar.form
  const { status, submit } = useNetlifyForm()
  const [errors, setErrors] = useState<Errors>({})
  const [attempt, setAttempt] = useState(0)
  // Con JavaScript se desactiva la validación nativa (que bloquearía el envío antes de mostrar nuestros errores).
  const [js, setJs] = useState(false)
  // Decisión «solo de cliente tras hidratar»: el HTML estático conserva la validación nativa.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setJs(true), [])
  const summaryRef = useRef<HTMLDivElement>(null)

  // Tras un envío con errores, el foco pasa al resumen.
  useEffect(() => {
    if (attempt > 0) summaryRef.current?.focus()
  }, [attempt])

  const clear = (key: ErrorKey) => () =>
    setErrors((current) => {
      if (!current[key]) return current
      const rest = { ...current }
      delete rest[key]
      return rest
    })

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const bad = invalidFields(new FormData(form))
    if (bad.length > 0) {
      setErrors(Object.fromEntries(bad.map((key) => [key, f.errors[key]])) as Errors)
      setAttempt((n) => n + 1)
      return
    }
    setErrors({})
    if (await submit(form)) form.reset()
  }

  const items = (Object.keys(FIELD_IDS) as ErrorKey[])
    .filter((key) => errors[key])
    .map((key) => ({ id: FIELD_IDS[key], message: errors[key] ?? '' }))
  const message = { idle: '', sending: f.sending, success: f.success, error: f.failure }[status]

  return (
    <form
      name={FORM_NAME}
      method="POST"
      action={pathFor('gracias')}
      data-netlify="true"
      netlify-honeypot="bot-field"
      noValidate={js}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <input type="hidden" name="idioma" value={lang} />
      <p className="hidden">
        <label>
          {f.honeypot} <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      {items.length > 0 && <ErrorSummary ref={summaryRef} title={f.summary} items={items} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id={FIELD_IDS.name}
          name="nombre"
          label={f.name}
          autoComplete="name"
          required
          error={errors.name}
          onInput={clear('name')}
        />
        <TextField
          id={FIELD_IDS.country}
          name="pais"
          label={f.country}
          autoComplete="country-name"
          required
          error={errors.country}
          onInput={clear('country')}
        />
      </div>
      <TextField
        id={FIELD_IDS.contact}
        name="contacto"
        label={f.contact}
        autoComplete="email"
        required
        error={errors.contact}
        onInput={clear('contact')}
      />
      <TextField
        id={FIELD_IDS.motivation}
        name="motivacion"
        label={f.motivation}
        help={f.motivationHelp}
        multiline
        required
        error={errors.motivation}
        onInput={clear('motivation')}
      />
      <CheckboxField id={FIELD_IDS.consent} name="datos" required error={errors.consent} onChange={clear('consent')}>
        {f.consentPre}
        <Link to={pathFor('privacidad')} target="_blank" rel="noopener" className="underline">
          {f.consentLink}
        </Link>{' '}
        <span className="text-arena-clara/75">{f.consentRequired}</span>
      </CheckboxField>

      <div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex min-h-12 items-center justify-center gap-3 bg-calido px-6 text-sm tracking-wide text-selva transition-colors duration-500 hover:bg-arena focus-visible:outline-ocre disabled:opacity-70"
        >
          {f.submit}
          <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </button>
        <p className="mt-4 text-ui text-arena-clara/75">{f.note}</p>
        {/* Región viva: anuncia «Enviando…», el éxito y el fallo. Siempre en el DOM para que se anuncie el cambio. */}
        <p
          role="status"
          aria-live="polite"
          className={`mt-4 text-body ${status === 'error' ? 'text-error-claro' : ''}`}
        >
          {message}
        </p>
      </div>
    </form>
  )
}
