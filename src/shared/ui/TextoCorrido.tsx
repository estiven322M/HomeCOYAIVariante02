import { Fragment } from 'react'

/** Nombres propios que el guionado automático nunca debe partir («Vic-toriano»). Se protegen al renderizar. */
export const NOMBRES_PROPIOS = [
  'Victoriano',
  'Piaguaje',
  'Yaiguaje',
  'ÉCOYAI',
  'Asëcoyai',
  'Zio Bain',
  'Putumayo',
  'Siona',
  'Mocoa',
]

const NOMBRES = new RegExp(`(${NOMBRES_PROPIOS.join('|')})`, 'g')

/** Envuelve cada nombre propio en un `<span>` con `hyphens: none`; el resto del texto queda igual. */
export function protegerNombres(text: string) {
  return text.split(NOMBRES).map((part, i) =>
    // El split con grupo de captura deja los nombres en las posiciones impares.
    i % 2 === 1 ? (
      <span key={i} className="hyphens-none">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/**
 * Párrafo de texto corrido justificado (clase `justificado`, solo desde `md`) con los nombres propios protegidos del
 * guionado. El texto sale de `src/content` tal cual: no lleva marcas. Ver «Texto justificado» en ARCHITECTURE.
 */
export function TextoCorrido({ children, className = '' }: { children: string; className?: string }) {
  return <p className={`justificado ${className}`.trim()}>{protegerNombres(children)}</p>
}
