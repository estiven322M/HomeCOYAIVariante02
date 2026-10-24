import { useEffect, useRef, useState, type ReactNode } from 'react'

export const NAV = [
  { n: '01', label: 'Nosotros', href: '#nosotros', desc: 'Origen, propósito y equipo de ÉCOYAI. [Contenido por definir]' },
  { n: '02', label: 'Proyectos', href: '#proyectos', desc: 'Iniciativas en torno a la lengua Siona, el territorio y los saberes.' },
  { n: '03', label: 'Transparencia y Gobernanza', href: '#transparencia', desc: 'Cómo nos organizamos y rendimos cuentas. [Contenido por definir]' },
  { n: '04', label: 'Donaciones / Alianzas', href: '#colaborar', desc: 'Formas de acompañar y fortalecer el trabajo de ÉCOYAI.' },
  { n: '05', label: 'Contacto', href: '#contacto', desc: 'Escríbenos para conversar, colaborar o conocer más.' },
]

export function Logo({ light = true }: { light?: boolean }) {
  return (
    <a href="#inicio" aria-label="ÉCOYAI, inicio" className={`font-serif text-2xl tracking-[0.12em] ${light ? 'text-calido' : 'text-carbon'}`}>
      ÉCOYAI
    </a>
  )
}

type BtnProps = { href: string; children: ReactNode; variant?: 'solid' | 'ghost' | 'dark' | 'outline' }
export function Button({ href, children, variant = 'solid' }: BtnProps) {
  const styles = {
    solid: 'bg-calido text-selva hover:bg-arena',
    ghost: 'border border-calido/50 text-calido hover:bg-calido/10 hover:border-calido',
    dark: 'bg-selva text-calido hover:bg-bosque',
    outline: 'border border-carbon/30 text-carbon hover:border-carbon hover:bg-carbon/5',
  }[variant]
  return (
    <a href={href} className={`group inline-flex min-h-12 items-center justify-center gap-3 px-6 text-sm tracking-wide transition-colors duration-500 ${styles}`}>
      {children}
      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
    </a>
  )
}

export function TextLink({ href, children, light }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <a href={href} className={`group inline-flex items-center gap-3 border-b pb-1 text-sm tracking-wide transition-colors duration-500 ${light ? 'border-calido/40 text-calido hover:border-calido' : 'border-carbon/30 hover:border-tierra hover:text-tierra'}`}>
      {children}
      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
    </a>
  )
}

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setInView(true), io.disconnect()), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${inView ? 'in' : ''} ${className}`}>{children}</div>
}

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return <p className={`text-[11px] uppercase tracking-[0.3em] ${light ? 'text-calido/70' : 'text-tierra'}`}>{children}</p>
}

/** Placeholder for documentary photography / footage until real assets are provided. */
export function MediaPlaceholder({ label, tone = 'forest', className = '' }: { label: string; tone?: 'forest' | 'earth' | 'river'; className?: string }) {
  const bg = {
    forest: 'radial-gradient(120% 90% at 30% 20%, #3e5a3f 0%, #1f3324 45%, #0c1810 100%)',
    earth: 'radial-gradient(120% 90% at 70% 30%, #a77a52 0%, #5d4330 50%, #2a1f17 100%)',
    river: 'radial-gradient(100% 80% at 50% 60%, #6f7f68 0%, #2f4434 50%, #111d15 100%)',
  }[tone]
  return (
    <div role="img" aria-label={label} className={`relative overflow-hidden ${className}`} style={{ background: bg }}>
      <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'repeating-radial-gradient(circle at 20% 30%, transparent 0 18px, rgba(255,255,255,.06) 19px 20px)' }} />
      <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.25em] text-calido/70">[{label}]</span>
    </div>
  )
}

export function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const on = () => setY(window.scrollY)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return y
}
