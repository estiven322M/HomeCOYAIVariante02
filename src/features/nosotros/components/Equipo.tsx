import { useLang } from '@/shared/i18n'
import { SubTitle } from '@/shared/ui/SubTitle'

/**
 * Marcador del retrato: las iniciales en un tono neutro y suave (decorativas: el nombre va justo al lado). En móvil es
 * un avatar pequeño a la izquierda; desde `md`, un bloque 3:2 sobre el nombre.
 */
function Portrait({ initials }: { initials: string }) {
  return (
    <div
      aria-hidden
      className="flex size-[4.5rem] flex-none items-center justify-center overflow-hidden bg-tierra-suave/15 md:aspect-[3/2] md:size-auto md:w-full"
    >
      <span className="font-serif text-lead font-light tracking-wide text-tierra-suave md:text-subtitle">
        {initials}
      </span>
    </div>
  )
}

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
            {/* Cargo largo: texto normal (sin mayúsculas ni tracking amplio), en el mismo recuadro, hasta dos líneas. */}
            <p className="mt-6 inline-block max-w-md border border-ocre/60 px-4 py-2 text-ui leading-snug text-ocre">
              {l.role}
            </p>
            <p className="mt-8 font-serif text-lead-sm font-light text-arena-clara/90">{l.text}</p>
          </div>
        </article>

        <div className="mt-24 flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-ocre" />
          <h3 className="text-caption uppercase tracking-[0.3em] text-arena-clara/75">{e.junta.title}</h3>
        </div>
        <ul className="mt-10 grid gap-x-6 gap-y-8 md:grid-cols-3 md:gap-x-10">
          {e.junta.members.map((m) => (
            <li key={m.name} className="flex gap-4 md:block">
              <Portrait initials={m.initials} />
              <div className="min-w-0 md:mt-6">
                <h4 className="font-serif text-lead leading-tight">{m.name}</h4>
                <p className="mt-2 text-ui leading-snug text-ocre">{m.role}</p>
                <p className="mt-3 border-t border-arena-clara/15 pt-3 text-ui text-arena-clara/80 md:mt-4 md:pt-4">
                  {m.profile}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
