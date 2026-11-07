import type { ReactNode } from 'react'

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.3em] ${light ? 'text-calido/70' : 'text-tierra'}`}>{children}</p>
  )
}
