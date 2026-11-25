import type { ReactNode } from 'react'

/** `light`: sobre fondo oscuro. `'full'` va en crema al 100 % (sobre chagra, el 70 % no llega a AA). */
export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean | 'full' }) {
  const color = light === 'full' ? 'text-calido' : light ? 'text-calido/70' : 'text-tierra'
  return <p className={`text-caption uppercase tracking-[0.3em] ${color}`}>{children}</p>
}
