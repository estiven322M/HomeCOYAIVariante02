import type { ReactNode } from 'react'

/**
 * Elemento de acordeón accesible: un encabezado (`<h2>`/`<h3>`) con un `<button>` que ocupa toda la fila (mínimo 44 px de
 * alto, `aria-expanded`, `aria-controls`) y su panel (`role="region"`). El estado vive en quien lo usa. Con `locked`
 * (el único abierto de un grupo que siempre mantiene uno abierto) el botón queda `aria-disabled` y no hace nada.
 * El panel cerrado usa `hidden`; quien renderiza en el servidor decide qué paneles salen abiertos (sin JavaScript,
 * todos).
 */
export function Disclosure({
  id,
  level = 3,
  open,
  locked = false,
  onToggle,
  header,
  indicator,
  className = '',
  buttonClassName = '',
  children,
}: {
  id: string
  level?: 2 | 3
  open: boolean
  locked?: boolean
  onToggle: () => void
  /** Contenido de la fila (se renderiza dentro del botón; solo texto y elementos decorativos). */
  header: ReactNode
  /** Indicador decorativo del estado (se oculta a los lectores de pantalla). */
  indicator?: ReactNode
  className?: string
  buttonClassName?: string
  children: ReactNode
}) {
  const Heading = level === 2 ? 'h2' : 'h3'
  return (
    <div className={className}>
      <Heading>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          aria-disabled={locked || undefined}
          onClick={() => {
            if (!locked) onToggle()
          }}
          className={`flex min-h-11 w-full items-center gap-4 text-left ${locked ? 'cursor-default' : 'cursor-pointer'} ${buttonClassName}`}
        >
          {header}
          {indicator && (
            <span aria-hidden className="ml-auto flex-none">
              {indicator}
            </span>
          )}
        </button>
      </Heading>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} hidden={!open}>
        {children}
      </div>
    </div>
  )
}

/** Signo + (cerrado) o − (abierto) de un acordeón, dentro de un recuadro de 28 px. Hereda el color del texto. */
export function PlusMinus({ open }: { open: boolean }) {
  return (
    <span className="grid size-7 place-items-center border border-current/40">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d={open ? 'M2 7H12' : 'M2 7H12M7 2V12'} />
      </svg>
    </span>
  )
}
