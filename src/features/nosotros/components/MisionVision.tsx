import { useLang } from '@/shared/i18n'
import { SubTitle } from '@/shared/ui/SubTitle'

/** 02 · Misión y visión: la cita del propósito y las dos tarjetas (Hoy · Misión, Hacia 2030 · Visión). */
export function MisionVision() {
  const { t } = useLang()
  const m = t.nosotros.mision
  const cards = [
    {
      d: m.mision,
      box: 'bg-huito',
      eyebrow: 'text-ocre',
      rule: 'bg-ocre',
    },
    {
      d: m.vision,
      box: 'bg-chagra',
      eyebrow: 'text-arena-clara',
      rule: 'bg-arena-clara',
    },
  ]
  return (
    <section id="mision" className="anchor-section bg-arena-clara py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SubTitle n="02" label={m.label} />
        <h2 className="mt-8 font-serif text-title-sm font-light text-huito md:text-title">{m.title}</h2>
        <figure className="mt-14 bg-achiote px-6 py-10 text-arena-clara md:px-14 md:py-12">
          <blockquote>
            <p className="max-w-[44rem] font-serif text-heading font-light italic md:text-quote">{m.purpose.quote}</p>
          </blockquote>
          <figcaption className="mt-5 text-caption uppercase tracking-[0.3em]">{m.purpose.cite}</figcaption>
        </figure>
        <div className="relative mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {cards.map(({ d, box, eyebrow, rule }) => (
              <article key={d.k} className={`flex flex-col p-8 text-arena-clara md:p-14 ${box}`}>
                <div>
                  <p className={`text-caption uppercase tracking-[0.3em] ${eyebrow}`}>{d.eyebrow}</p>
                  <h3 className="mt-4 font-serif text-list-title font-light italic text-arena md:text-statement">
                    {d.k}
                  </h3>
                </div>
                <span aria-hidden className={`mt-8 block h-px w-10 ${rule}`} />
                <p className="mt-8 text-body">{d.t}</p>
              </article>
            ))}
          </div>
          {/* Junta decorativa entre las dos tarjetas (solo cuando están lado a lado). */}
          <div
            aria-hidden
            className="absolute left-1/2 top-24 hidden size-14 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center bg-ocre md:flex"
          >
            <span className="block size-5 bg-huito" />
          </div>
        </div>
      </div>
    </section>
  )
}
