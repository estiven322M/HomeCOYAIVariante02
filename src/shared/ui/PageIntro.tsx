import type { ReactNode } from 'react'

/** Cabecera oscura de página con su <h1> (para páginas cuyo contenido es solo un título y un texto breve). */
export function PageIntro({ title, lead, children }: { title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="bg-selva px-6 pb-20 pt-36 text-calido lg:pb-28 lg:pt-48">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-5xl font-light leading-[1.05] lg:text-7xl">{title}</h1>
        {lead && <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-calido/80">{lead}</p>}
        {children}
      </div>
    </section>
  )
}
