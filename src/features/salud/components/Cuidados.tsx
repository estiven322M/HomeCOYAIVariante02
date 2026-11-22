import type { ReactNode } from 'react'
import { useLang } from '@/shared/i18n'
import { SubTitle } from '@/shared/ui/SubTitle'

const stroke = {
  width: 40,
  height: 40,
  viewBox: '0 0 40 40',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/** Iconos propios (decorativos), en el mismo orden que `salud.cuidado.items`: hoja, dos personas, brote. */
const ICONS: ReactNode[] = [
  <svg key="hoja" {...stroke}>
    <path d="M10 34C10 20 18 9 33 5C31 19 23 29 10 34Z" />
    <path d="M10 34 25 15M16 27h6M19 23h7" />
  </svg>,
  <svg key="personas" {...stroke}>
    <circle cx="14" cy="13" r="5" />
    <circle cx="27" cy="13" r="5" />
    <path d="M4 34c0-8 5-12 10-12s10 4 10 12M20 24c2-1.3 4.4-2 7-2 5 0 9 4 9 12" />
  </svg>,
  <svg key="brote" {...stroke}>
    <path d="M20 35V19M20 24C12 24 7 19 7 12c8 0 13 4 13 12ZM20 19c0-8 6-13 13-13 0 8-6 13-13 13ZM9 35h22" />
  </svg>,
]

/** Seguridad, ética y acompañamiento: tres tarjetas estrechas con el texto alineado a la izquierda (sin justificar). */
export function Cuidados() {
  const c = useLang().t.salud.cuidado
  return (
    <section className="bg-arena px-6 pt-28 pb-12">
      <div className="mx-auto max-w-6xl">
        <SubTitle label={c.label} />
        <h2 className="mt-8 font-serif text-title-sm font-light text-huito md:text-title">{c.title}</h2>
        <p className="mt-6 max-w-2xl text-body text-huito/80">{c.intro}</p>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {c.items.map((item, i) => (
            <li key={item.title} className="border border-huito/15 bg-arena-clara p-8">
              <span className="text-chagra">{ICONS[i]}</span>
              <h3 className="mt-6 font-serif text-lead leading-tight font-light text-huito">{item.title}</h3>
              <p className="mt-4 text-body-sm text-huito/80">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
