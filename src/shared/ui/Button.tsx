import type { ReactNode } from 'react'
import { Link } from 'react-router'

type BtnProps = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'ghost' | 'dark' | 'outline' | 'hero' | 'heroGhost'
}
export function Button({ href, children, variant = 'solid' }: BtnProps) {
  const styles = {
    solid: 'bg-calido text-selva hover:bg-arena',
    ghost: 'border border-calido/50 text-calido hover:bg-calido/10 hover:border-calido',
    dark: 'bg-selva text-calido hover:bg-bosque',
    hero: 'hero-btn',
    heroGhost: 'hero-btn-ghost',
    outline: 'border border-carbon/30 text-carbon hover:border-carbon hover:bg-carbon/5',
  }[variant]
  return (
    <Link
      to={href}
      className={`group inline-flex min-h-12 items-center justify-center gap-3 px-6 text-sm tracking-wide transition-colors duration-500 ${styles}`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
        →
      </span>
    </Link>
  )
}
