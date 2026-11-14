import { Diamond } from '@/shared/ui/Diamond'
import { useLang } from '@/shared/i18n'

/** Franja verde de Historia: «Zio Bain» y la línea de tiempo (siglos → 2024 → 2030). */
export function Territorio() {
  const { t } = useLang()
  const z = t.nosotros.historia.territorio
  return (
    <div className="mt-24 bg-chagra p-8 text-arena-clara md:p-14">
      <div className="grid items-start gap-10 lg:grid-cols-3">
        <div>
          <p className="font-serif text-statement font-light italic text-arena">{z.name}</p>
          <p className="mt-4 text-caption uppercase tracking-[0.25em] text-arena-clara">{z.people}</p>
        </div>
        {/* Vertical (con línea a la izquierda) hasta lg; horizontal con los rombos sobre la línea desde lg. */}
        <ol className="grid gap-8 border-l border-arena-clara/35 lg:col-span-2 lg:grid-cols-3 lg:border-l-0 lg:border-t lg:pt-8">
          {z.timeline.map((item, i) => (
            <li key={item.k} className="relative pl-8 lg:pl-0">
              <Diamond
                className={`absolute left-0 top-2 size-3.5 -translate-x-1/2 lg:-top-[39px] lg:translate-x-0 ${i === z.timeline.length - 1 ? 'bg-ocre' : 'bg-arena-clara'}`}
              />
              <p className="font-serif text-heading">{item.k}</p>
              <p className="mt-3 text-body-sm">{item.t}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
