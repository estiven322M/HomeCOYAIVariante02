import type { Proyecto } from '@/content/es/proyectos'
import { SubTitle } from '@/shared/ui/SubTitle'
import { TextoCorrido } from '@/shared/ui/TextoCorrido'
import { IconoReferencia } from './iconos'

/**
 * «Nuestro compromiso»: la entradilla es texto corrido (justificado) y las referencias del marco de protección van a
 * la izquierda, con iconos decorativos. Zona clara con el patrón lateral (la envuelve `Proyectos`).
 */
export function Compromiso({ data }: { data: Proyecto['compromiso'] }) {
  return (
    <section className="px-6 pb-28 pt-12">
      <div className="mx-auto max-w-6xl">
        <SubTitle label={data.label} />
        <h2 className="mt-8 font-serif text-title-sm font-light text-huito md:text-title">{data.title}</h2>
        <TextoCorrido className="mt-8 max-w-3xl text-body text-huito/80">{data.intro}</TextoCorrido>
        <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {data.refs.map((r) => (
            <li key={r.title} className="border border-huito/15 bg-arena-clara p-4 sm:p-6">
              <span className="text-chagra">
                <IconoReferencia name={r.icon} />
              </span>
              <p className="mt-5 font-serif text-body text-huito sm:text-lead-sm">{r.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
