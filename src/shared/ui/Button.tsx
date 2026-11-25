import type { ReactNode } from 'react'
import { Link } from 'react-router'

type BtnProps = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'ghost' | 'dark' | 'outline' | 'hero' | 'heroGhost' | 'sobreChagra'
  /** A todo el ancho, con el texto a la izquierda y la flecha a la derecha. */
  spread?: boolean
}
export function Button({ href, children, variant = 'solid', spread }: BtnProps) {
  const styles = {
    solid: 'bg-calido text-selva hover:bg-arena',
    ghost: 'border border-calido/50 text-calido hover:bg-calido/10 hover:border-calido',
    dark: 'bg-selva text-calido hover:bg-bosque',
    hero: 'hero-btn',
    heroGhost: 'hero-btn-ghost',
    outline: 'border border-carbon/30 text-carbon hover:border-carbon hover:bg-carbon/5',
    // Contorno sobre chagra: borde pleno y un hover que OSCURECE (aclarar con crema bajaría el contraste de AA).
    sobreChagra: 'border border-calido text-calido hover:bg-huito/35',
  }[variant]
  return (
    <Link
      to={href}
      className={`group inline-flex items-center gap-3 px-6 text-sm tracking-wide transition-colors duration-500 ${spread ? 'min-h-14 w-full justify-between' : 'min-h-12 justify-center'} ${styles}`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
        →
      </span>
    </Link>
  )
}
