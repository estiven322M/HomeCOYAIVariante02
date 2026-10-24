import { useEffect, useState } from 'react'
import { Logo, NAV } from './ui'

export function SideNav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  useEffect(() => {
    const on = () => setActive(window.location.hash)
    on()
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const links = (
    <ul className="flex flex-col gap-1">
      {NAV.map((i) => {
        const isActive = active === i.href
        return (
          <li key={i.n}>
            <a href={i.href} onClick={() => setOpen(false)} aria-current={isActive ? 'page' : undefined}
              className={`group flex items-baseline gap-4 py-2.5 text-sm transition-colors duration-500 ${isActive ? 'text-calido' : 'text-calido/65 hover:text-calido'}`}>
              <span className="w-5 font-serif text-xs text-arena/60">{i.n}</span>
              <span className="relative">
                {i.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-tierra transition-all duration-500 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )

  return (
    <>
      {/* Desktop */}
      <nav aria-label="Principal" className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col justify-between border-r border-calido/10 bg-selva/25 px-9 py-10 backdrop-blur-[6px] lg:flex">
        <Logo />
        {links}
        <div className="flex flex-col gap-6">
          <a href="#colaborar" className="group inline-flex min-h-12 items-center justify-between border border-calido/40 px-5 text-sm text-calido transition-colors duration-500 hover:border-calido hover:bg-calido hover:text-selva">
            Colaborar <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </a>
          <p className="text-[10px] uppercase tracking-[0.3em] text-calido/45">Putumayo · Colombia</p>
        </div>
      </nav>

      {/* Mobile */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-selva/30 px-5 py-4 backdrop-blur-[6px] lg:hidden">
        <Logo />
        <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu"
          className="flex min-h-11 items-center gap-3 px-2 text-xs uppercase tracking-[0.25em] text-calido">
          {open ? 'Cerrar' : 'Menú'}
          <span aria-hidden className="flex w-5 flex-col gap-1.5">
            <span className={`h-px bg-calido transition-transform duration-500 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`h-px bg-calido transition-transform duration-500 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </span>
        </button>
      </div>
      <div id="mobile-menu" className={`fixed inset-0 z-30 flex flex-col justify-center gap-10 bg-selva/95 px-8 backdrop-blur transition-opacity duration-700 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="[&_a]:text-lg">{links}</div>
        <a href="#colaborar" onClick={() => setOpen(false)} className="inline-flex min-h-12 items-center justify-center bg-calido text-sm text-selva">Colaborar →</a>
      </div>
    </>
  )
}
