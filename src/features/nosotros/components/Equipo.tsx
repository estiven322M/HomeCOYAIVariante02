import { useLang } from '@/shared/i18n'
import { Diamond } from '@/shared/ui/Diamond'
import { SubTitle } from '@/shared/ui/SubTitle'

/** Marcador del retrato mientras no hay foto: iniciales sobre un fondo de la paleta (el nombre va justo debajo). */
function Initials({ initials, tone }: { initials: string; tone: string }) {
  return (
    <div
      aria-hidden
      className={`relative flex aspect-[3/2] items-center min-[520px]:aspect-[4/5] justify-center overflow-hidden ${tone}`}
    >
      <Diamond className="absolute aspect-square h-3/4 bg-arena-clara/10" />
      <span className="relative font-serif text-[4.5rem] font-light tracking-wide text-arena-clara">{initials}</span>
    </div>
  )
}

const TONES = ['bg-chagra', 'bg-achiote', 'bg-chagra', 'bg-achiote']

/** 04 · Nuestro equipo: el Taita (liderazgo ancestral) y la junta directiva. */
export function Equipo() {
  const { t } = useLang()
  const e = t.nosotros.equipo
  const l = e.liderazgo
  return (
    <section id="equipo" className="anchor-section bg-huito py-28 text-arena-clara">
      <div className="mx-auto max-w-6xl px-6">
        <SubTitle n="04" label={e.label} light />
        <h2 className="mt-8 font-serif text-title-sm font-light md:text-title">{e.title}</h2>

        <article className="mt-14 grid items-center gap-10 md:grid-cols-[7fr_5fr] md:gap-16">
          <img
            src="/taita/taita_victoriano.webp"
            srcSet="/nosotros/taita-640.webp 640w, /nosotros/taita-960.webp 960w, /taita/taita_victoriano.webp 1280w"
            sizes="(min-width: 768px) 640px, calc(100vw - 48px)"
            width={1280}
            height={960}
            alt={l.imageAlt}
            loading="lazy"
            decoding="async"
            className="block aspect-[4/3] w-full object-cover"
          />
          <div>
            <p className="text-caption uppercase tracking-[0.3em] text-ocre">{l.label}</p>
            <h3 className="mt-6 font-serif text-list-title font-light md:text-subtitle">{l.name}</h3>
            <p className="mt-6 inline-block border border-ocre/60 px-4 py-1.5 text-caption uppercase tracking-[0.25em] text-ocre">
              {l.role}
            </p>
            <p className="mt-8 font-serif text-lead-sm font-light text-arena-clara/90">{l.text}</p>
          </div>
        </article>

        <div className="mt-24 flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-ocre" />
          <h3 className="text-caption uppercase tracking-[0.3em] text-arena-clara/75">{e.junta.title}</h3>
        </div>
        <ul className="mt-10 grid gap-x-6 gap-y-12 min-[520px]:grid-cols-2 lg:grid-cols-4">
          {e.junta.members.map((m, i) => (
            <li key={m.name}>
              <Initials initials={m.initials} tone={TONES[i % TONES.length] ?? 'bg-chagra'} />
              <h4 className="mt-6 font-serif text-lead leading-tight">{m.name}</h4>
              <p className="mt-3 text-caption uppercase leading-5 tracking-[0.2em] text-ocre">{m.role}</p>
              <p className="mt-4 border-t border-arena-clara/15 pt-4 text-ui text-arena-clara/80">{m.profile}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
