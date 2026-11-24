import { useState } from 'react'
import type { Proyecto } from '@/content/es/proyectos'
import { MAPAS } from '@/features/proyectos/mapa'
import { Diamond } from '@/shared/ui/Diamond'
import { Disclosure, PlusMinus } from '@/shared/ui/Disclosure'
import { SubTitle } from '@/shared/ui/SubTitle'
import { MapaResguardos } from './MapaResguardos'

/**
 * «Los resguardos»: desplegable con la lista de resguardos participantes y el mapa ilustrativo. El desplegable
 * (`Disclosure` compartido) sale ABIERTO en el HTML y en el primer render del cliente: sin JavaScript se ve la lista
 * completa. Lista y mapa salen de los mismos datos (`features/proyectos/mapa.ts`). Va en la zona clara con el patrón
 * lateral (la envuelve `Proyectos`).
 */
export function Resguardos({ slug, data }: { slug: string; data: Proyecto['resguardos'] }) {
  const [open, setOpen] = useState(true)
  const mapa = MAPAS[slug]
  if (!mapa) return null
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SubTitle label={data.label} />
        <h2 className="mt-8 font-serif text-title-sm font-light text-huito md:text-title">{data.title}</h2>
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <Disclosure
            id="resguardos"
            level={3}
            open={open}
            onToggle={() => setOpen((o) => !o)}
            className="border border-huito/20 bg-arena-clara"
            buttonClassName="px-5 text-body text-huito"
            header={data.disclosure}
            indicator={<PlusMinus open={open} />}
          >
            <ul className="px-5 pb-3">
              {mapa.resguardos.map((g) => (
                <li key={g.id} className="flex items-center gap-4 border-t border-huito/15 py-4">
                  <Diamond className="size-3 flex-none bg-ocre" />
                  <span className="font-serif text-lead-sm text-huito">{g.name}</span>
                </li>
              ))}
            </ul>
          </Disclosure>
          <figure className="border border-huito/15 bg-arena-clara p-4 sm:p-6">
            <MapaResguardos mapa={mapa} rios={data.mapa.rios} desc={data.mapa.desc} />
            <figcaption className="mt-4 flex flex-col gap-1 border-t border-huito/15 pt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <span className="text-caption uppercase tracking-[0.3em] text-tierra">{data.mapa.caption}</span>
              <span className="text-ui text-huito/70">{data.mapa.nota}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
