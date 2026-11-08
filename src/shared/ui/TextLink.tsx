import type { ReactNode } from 'react'
import { Link } from 'react-router'

export function TextLink({ href, children, light }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <Link
      to={href}
      className={`group inline-flex items-center gap-3 border-b pb-1 text-sm tracking-wide transition-colors duration-500 ${light ? 'border-calido/40 text-calido hover:border-calido' : 'border-carbon/30 hover:border-tierra hover:text-tierra'}`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
        →
      </span>
    </Link>
  )
}
