import { useEffect, useState } from 'react'
import { Logo, useScrollY } from './ui'
import { LangSwitch, useLang, useNav } from '../i18n'

/** Top bar with a toggle button + retractable menu panel (same behaviour on desktop and mobile). */
export function SideNav() {
  const { t } = useLang()
  const NAV = useNav()
  const y = useScrollY()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const on = () => setActive(window.location.hash)
    on()
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  // Escape closes the menu; page scroll is locked while it is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = prev
    }
  }, [open])

  const solid = y > 40 && !open

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-3 transition-colors duration-500 lg:px-8 ${solid ? 'bg-selva/90 backdrop-blur-[6px]' : 'bg-transparent'}`}>
        <div className="flex items-center gap-4 sm:gap-6">
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-menu"
            aria-label={open ? t.sideNav.close : t.sideNav.menu}
            className="flex h-11 w-11 items-center justify-center border border-calido/40 text-calido transition-colors duration-500 hover:border-calido hover:bg-calido/10">
            <span aria-hidden className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-full bg-calido transition-all duration-500 ${open ? 'top-1/2 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1/2 h-px w-full bg-calido transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 h-px w-full bg-calido transition-all duration-500 ${open ? 'top-1/2 -rotate-45' : 'top-full'}`} />
            </span>          </button>
          <Logo />
        </div>
        <LangSwitch />
      </header>

      {/* Scrim: click outside the panel to close */}
      <div onClick={() => setOpen(false)} aria-hidden
        className={`fixed inset-0 z-30 bg-selva/60 backdrop-blur-[2px] transition-opacity duration-500 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />

      <nav id="site-menu" aria-label={t.sideNav.aria} inert={!open}
        className={`fixed inset-y-0 left-0 z-40 flex w-full max-w-md flex-col justify-between bg-selva px-8 pb-10 pt-28 transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <ul className="flex flex-col gap-1">
          {NAV.map((i) => {
            const isActive = active === i.href
            return (
              <li key={i.href}>
                <a href={i.href} onClick={() => setOpen(false)} aria-current={isActive ? 'page' : undefined}
                  className={`group flex items-baseline py-3 font-serif text-2xl font-light transition-colors duration-500 ${isActive ? 'text-calido' : 'text-calido/70 hover:text-calido'}`}>
                  <span className="relative">
                    {i.label}
                    <span className={`absolute -bottom-1 left-0 h-px bg-ocre transition-all duration-500 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
        <div className="flex flex-col gap-6">
          <a href="#colaborar" onClick={() => setOpen(false)} className="group inline-flex min-h-12 items-center justify-between border border-calido/40 px-5 text-sm text-calido transition-colors duration-500 hover:border-calido hover:bg-calido hover:text-selva">
            {t.sideNav.collaborate} <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </a>
          <p className="text-[10px] uppercase tracking-[0.3em] text-calido/45">{t.sideNav.place}</p>
        </div>
      </nav>
    </>
  )
}
