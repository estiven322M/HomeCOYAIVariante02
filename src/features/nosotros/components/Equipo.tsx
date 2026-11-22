import { useLang } from '@/shared/i18n'
import { SubTitle } from '@/shared/ui/SubTitle'

/** Retratos disponibles de la junta, por iniciales. Derivados de `pnpm images`; las demás personas usan iniciales. */
const PHOTOS: Record<string, { src: string; srcSet: string }> = {
  VP: {
    src: '/nosotros/taita-junta-512.webp',
    srcSet: '/nosotros/taita-junta-256.webp 256w, /nosotros/taita-junta-512.webp 512w',
  },
}

/**
 * Retrato de la tarjeta: la foto si existe; si no, las iniciales en un tono neutro y suave (discreto, para no competir
 * con las fotos reales; decorativas: el nombre va justo al lado). En móvil es un avatar pequeño a la izquierda.
 */
function Portrait({ initials, photoAlt }: { initials: string; photoAlt?: string }) {
  const box =
    'size-[4.5rem] flex-none overflow-hidden min-[520px]:aspect-[3/2] min-[520px]:size-auto min-[520px]:w-full'
  const photo = PHOTOS[initials]
  if (photo && photoAlt) {
    return (
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes="(min-width: 1024px) 258px, (min-width: 520px) 50vw, 72px"
        width={512}
        height={384}
        alt={photoAlt}
        loading="lazy"
        decoding="async"
        className={`${box} object-cover object-[50%_15%]`}
      />
    )
  }
  return (
    <div aria-hidden className={`flex items-center justify-center bg-tierra-suave/15 ${box}`}>
      <span className="font-serif text-lead font-light tracking-wide text-tierra-suave min-[520px]:text-subtitle">
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
        <ul className="mt-10 grid gap-x-6 gap-y-8 min-[520px]:grid-cols-2 min-[520px]:gap-y-12 lg:grid-cols-4">
          {e.junta.members.map((m) => (
            <li key={m.name} className="flex gap-4 min-[520px]:block">
              <Portrait initials={m.initials} photoAlt={m.photoAlt} />
              <div className="min-w-0 min-[520px]:mt-6">
                <h4 className="font-serif text-lead leading-tight">{m.name}</h4>
                <p className="mt-2 text-ui leading-snug text-ocre">{m.role}</p>
                <p className="mt-3 border-t border-arena-clara/15 pt-3 text-ui text-arena-clara/80 min-[520px]:mt-4 min-[520px]:pt-4">
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
