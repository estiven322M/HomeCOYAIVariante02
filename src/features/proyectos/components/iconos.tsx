/** Iconos de línea de la página Proyectos. Decorativos (`aria-hidden`): el texto que los acompaña dice lo mismo. Heredan el color. */
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, 'aria-hidden': true } as const

/** Icono de un frente de la iniciativa (40 px): voz (micrófono), IA (teléfono con onda) o libro. */
export function IconoFrente({ name }: { name: 'voz' | 'ia' | 'libro' }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" strokeLinecap="round" strokeLinejoin="round" {...base}>
      {name === 'voz' && (
        <>
          <rect x="15" y="5" width="10" height="18" rx="5" />
          <path d="M10 18 C 10 25, 14.5 29, 20 29 C 25.5 29, 30 25, 30 18" />
          <path d="M20 29 V 35 M 14 35 H 26" />
        </>
      )}
      {name === 'ia' && (
        <>
          <rect x="11" y="4" width="18" height="32" />
          <path d="M17 31 H 23" />
          <path d="M14 18 H 16.5 L 18 13 L 21 23 L 22.5 18 H 26" />
        </>
      )}
      {name === 'libro' && (
        <>
          <path d="M20 11 C 15 8, 9 8, 5 10 V 32 C 9 30, 15 30, 20 33 C 25 30, 31 30, 35 32 V 10 C 31 8, 25 8, 20 11 Z" />
          <path d="M20 11 V 33" />
        </>
      )}
    </svg>
  )
}

/** Icono de una referencia del marco de protección (28 px): documento, calendario o globo. */
export function IconoReferencia({ name }: { name: 'documento' | 'calendario' | 'globo' }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" {...base}>
      {name === 'documento' && (
        <>
          <path d="M6 3 H 17 L 22 8 V 25 H 6 Z" />
          <path d="M10 13 H 18 M 10 17 H 18 M 10 21 H 15" />
        </>
      )}
      {name === 'calendario' && (
        <>
          <path d="M4 6 H 24 V 24 H 4 Z" />
          <path d="M4 11 H 24 M 9 3 V 8 M 19 3 V 8" />
          <path d="M9 16 H 19 M 9 20 H 15" />
        </>
      )}
      {name === 'globo' && (
        <>
          <circle cx="14" cy="14" r="10" />
          <path d="M4 14 H 24 M 14 4 C 10 8, 10 20, 14 24 M 14 4 C 18 8, 18 20, 14 24" />
        </>
      )}
    </svg>
  )
}
