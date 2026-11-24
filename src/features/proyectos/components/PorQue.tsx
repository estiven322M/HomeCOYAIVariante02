import type { Proyecto } from '@/content/es/proyectos'
import { IMAGES } from '@/features/proyectos/images'
import { Diamond } from '@/shared/ui/Diamond'
import { FillImage } from '@/shared/ui/FillImage'
import { PatternZone } from '@/shared/ui/PatternZone'
import { SubTitle } from '@/shared/ui/SubTitle'
import { TextoCorrido } from '@/shared/ui/TextoCorrido'

/**
 * «¿Por qué es importante…?»: dos párrafos de texto corrido (justificados), la cita, el retrato 4:5 y la ficha de la
 * lengua (a la izquierda, no justificada). Zona clara con el patrón lateral.
 */
export function PorQue({ data }: { data: Proyecto['porQue'] }) {
  return (
    <PatternZone as="section" className="bg-arena px-6 py-28">
      <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-[7fr_5fr] md:gap-16">
        <div>
          <SubTitle label={data.label} />
          <h2 className="mt-8 font-serif text-title-sm font-light text-huito md:text-title">{data.title}</h2>
          <div className="mt-10 space-y-6 text-body text-huito/80">
            {data.paragraphs.map((p) => (
              <TextoCorrido key={p.slice(0, 24)}>{p}</TextoCorrido>
            ))}
          </div>
          <blockquote className="mt-12 border-t border-huito/20 pt-8">
            <Diamond className="size-3 bg-ocre" />
            <p className="mt-5 font-serif text-heading font-light italic text-chagra">{data.quote}</p>
          </blockquote>
        </div>
        <div>
          <figure className="relative aspect-[4/5] w-full overflow-hidden bg-tierra-suave">
            <FillImage
              spec={IMAGES.retrato}
              tone="claro"
              sizes="(min-width: 768px) 460px, calc(100vw - 48px)"
              alt={data.retratoAlt}
            />
          </figure>
          <section aria-labelledby="ficha-lengua" className="mt-6 border border-huito/15 bg-arena-clara p-6 md:p-8">
            <h3 id="ficha-lengua" className="text-caption uppercase tracking-[0.3em] text-tierra">
              {data.ficha.title}
            </h3>
            <dl className="mt-4">
              {data.ficha.rows.map((row) => (
                <div key={row.label} className="border-t border-huito/15 py-4 first:border-t-0 first:pt-0 last:pb-0">
                  <dt className="text-caption uppercase tracking-[0.2em] text-huito/70">{row.label}</dt>
                  <dd className={`mt-1 font-serif text-lead-sm ${row.destacado ? 'text-tierra' : 'text-huito'}`}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </PatternZone>
  )
}
