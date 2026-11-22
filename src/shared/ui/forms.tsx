import type { ReactNode, Ref } from 'react'

/** Campos de formulario accesibles para fondos oscuros: etiqueta, ayuda y error enlazados con `aria-describedby`. */

const control =
  'block w-full border border-arena-clara/50 bg-transparent px-4 text-body text-arena-clara placeholder:text-arena-clara/50 focus-visible:outline-ocre aria-[invalid=true]:border-error-claro'

const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(' ') || undefined

/** Campo de texto (o área de texto con `multiline`). `error` es el mensaje de error, si lo hay. */
export function TextField({
  id,
  name,
  label,
  help,
  error,
  autoComplete,
  multiline = false,
  required = false,
  onInput,
}: {
  id: string
  name: string
  label: string
  help?: string
  error?: string
  autoComplete?: string
  multiline?: boolean
  required?: boolean
  onInput?: () => void
}) {
  const shared = {
    id,
    name,
    required,
    autoComplete,
    onInput,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy(help && `${id}-help`, error && `${id}-error`),
  } as const
  return (
    <div>
      <label htmlFor={id} className="block text-ui font-medium text-arena-clara">
        {label}
      </label>
      {help && (
        <p id={`${id}-help`} className="mt-1 text-ui text-arena-clara/75">
          {help}
        </p>
      )}
      {multiline ? (
        <textarea {...shared} rows={4} className={`${control} mt-2 py-3`} />
      ) : (
        <input {...shared} type="text" className={`${control} mt-2 min-h-12`} />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-ui text-error-claro">
          {error}
        </p>
      )}
    </div>
  )
}

/** Casilla con su etiqueta (que puede llevar un enlace). Sin marcar por defecto. */
export function CheckboxField({
  id,
  name,
  error,
  required = false,
  onChange,
  children,
}: {
  id: string
  name: string
  error?: string
  required?: boolean
  onChange?: () => void
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          required={required}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(error && `${id}-error`)}
          className="mt-1 size-5 flex-none accent-ocre focus-visible:outline-ocre"
        />
        <label htmlFor={id} className="text-ui text-arena-clara">
          {children}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-ui text-error-claro">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Resumen de errores: recibe el foco al enviar con errores y enlaza (con un enlace por error) a cada campo. `ref` es el
 * del contenedor, para poder enfocarlo.
 */
export function ErrorSummary({
  ref,
  title,
  items,
}: {
  ref?: Ref<HTMLDivElement>
  title: string
  items: { id: string; message: string }[]
}) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="group"
      aria-labelledby="resumen-errores-titulo"
      className="border border-error-claro p-4 focus-visible:outline-ocre"
    >
      <p id="resumen-errores-titulo" className="text-ui font-medium text-arena-clara">
        {title}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-ui text-error-claro">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="underline focus-visible:outline-ocre"
              onClick={(event) => {
                event.preventDefault()
                document.getElementById(item.id)?.focus()
              }}
            >
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
