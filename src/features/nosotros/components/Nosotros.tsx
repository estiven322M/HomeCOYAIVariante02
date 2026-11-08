import { useState } from 'react'
import { Eyebrow } from '@/shared/ui/Eyebrow'
import { MediaPlaceholder } from '@/shared/ui/MediaPlaceholder'
import { Reveal } from '@/shared/ui/Reveal'
import { SubTitle } from '@/shared/ui/SubTitle'
import { useLang } from '@/shared/i18n'

const TONES = ['forest', 'earth', 'river', 'forest'] as const

/** Foto del Taita: archivo en public/taita/taita_victoriano.webp (4:3). Muestra el placeholder mientras no exista. */
function TaitaPhoto({ label }: { label: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="aspect-[4/3] overflow-hidden">
      {failed ? (
        <MediaPlaceholder label={label} tone="earth" className="h-full w-full" />
      ) : (
        <img
          src="/taita/taita_victoriano.webp"
          loading="lazy"
          alt={label}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  )
}

export function Nosotros() {
  const { t } = useLang()
  const n = t.nosotros
  const { historia: h, estrategia: e, liderazgo: l, junta: j } = n
  const anchors = [
    { id: 'historia', label: h.label },
    { id: 'direccionamiento', label: e.label },
    { id: 'liderazgo', label: l.label },
    { id: 'equipo', label: j.label },
  ]

  return (
    <>
      {/* Encabezado + índice interno */}
      <section className="bg-calido px-6 pb-16 pt-28 lg:pt-40">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>{n.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-serif text-6xl font-light leading-[1.02] lg:text-8xl">{t.common.nav[0]?.label}</h1>
          </Reveal>
          <Reveal delay={150}>
            <ul className="mt-14 flex flex-wrap gap-3">
              {anchors.map((a) => (
                <li key={a.id}>
                  <a
                    href={`#${a.id}`}
                    className="group inline-flex min-h-11 items-center gap-3 border border-carbon/25 px-5 text-sm transition-colors duration-500 hover:border-selva hover:bg-selva hover:text-calido"
                  >
                    {a.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 01 · Historia */}
      <section id="historia" className="scroll-mt-20 bg-crema px-6 py-28 lg:py-36">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SubTitle label={h.label} />
            <h3 className="mt-8 font-serif text-4xl font-light leading-[1.08] lg:text-6xl">{h.title}</h3>
            <p className="mt-10 font-serif text-2xl font-light leading-snug text-carbon/90">{h.paragraphs[0]}</p>
            <div className="mt-8 space-y-6 text-[17px] leading-relaxed text-carbon/80">
              {h.paragraphs.slice(1).map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200} className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
            <div className="aspect-[4/5] overflow-hidden">
              <MediaPlaceholder label={h.media} className="h-full w-full" />
            </div>
          </Reveal>
        </div>
        <Reveal className="mx-auto mt-20 max-w-6xl">
          <dl className="border-t border-carbon/20">
            {h.facts.map((f) => (
              <div key={f.k} className="py-10 text-center">
                <dt className="font-serif text-4xl font-semibold text-bosque">{f.k}</dt>
                <dd className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-carbon/70">{f.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* 02 · Direccionamiento estratégico */}
      <section id="direccionamiento" className="scroll-mt-20 bg-calido px-6 py-28 lg:py-36">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SubTitle label={e.label} />
            <h3 className="mt-8 font-serif text-4xl font-light leading-[1.08] lg:text-6xl">{e.title}</h3>
          </Reveal>
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="h-full bg-selva p-10 text-calido lg:p-14">
                <span className="block h-px w-10 bg-ocre" />
                <h4 className="mt-8 font-serif text-5xl font-light italic text-arena lg:text-6xl">{e.mision.k}</h4>
                <p className="mt-8 text-[17px] leading-relaxed text-calido/85">{e.mision.t}</p>
              </article>
            </Reveal>
            <Reveal delay={200}>
              <article className="h-full bg-bosque p-10 text-calido lg:p-14">
                <span className="block h-px w-10 bg-ocre" />
                <h4 className="mt-8 font-serif text-5xl font-light italic text-arena lg:text-6xl">{e.vision.k}</h4>
                <p className="mt-8 text-[17px] leading-relaxed text-calido/90">{e.vision.t}</p>
              </article>
            </Reveal>
          </div>

          <Reveal className="mt-24">
            <h4 className="font-serif text-3xl font-light lg:text-4xl">{e.valuesTitle}</h4>
          </Reveal>
          <ul className="mt-10 grid gap-x-16 md:grid-cols-2">
            {e.values.map((v, i) => (
              <Reveal key={v.k} delay={(i % 2) * 120}>
                <li className="grid grid-cols-[3rem_1fr] gap-x-2 border-t border-carbon/20 py-8">
                  <span className="pt-1.5 font-serif text-sm text-tierra">0{i + 1}</span>
                  <div>
                    <h5 className="font-serif text-2xl font-light text-bosque">{v.k}</h5>
                    <p className="mt-3 text-[15px] leading-relaxed text-carbon/75">{v.t}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 · Liderazgo ancestral */}
      <section
        id="liderazgo"
        className="scroll-mt-20 relative overflow-hidden bg-selva px-6 py-28 text-calido lg:py-36"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <TaitaPhoto label={l.media} />
          </Reveal>
          <Reveal delay={200} className="lg:col-span-5">
            <SubTitle label={l.label} light />
            <h3 className="mt-8 font-serif text-4xl font-light leading-[1.05] lg:text-5xl">{l.name}</h3>
            <ul className="mt-8 flex flex-wrap justify-center gap-3">
              {l.roles.map((r) => (
                <li
                  key={r}
                  className="border border-ocre/60 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-ocre"
                >
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-10 max-w-xl font-serif text-xl font-light leading-relaxed text-calido/85">{l.text}</p>
          </Reveal>
        </div>
      </section>

      {/* 05 · Estructura de gobierno e integrantes */}
      <section id="equipo" className="scroll-mt-20 bg-calido px-6 py-28 lg:py-36">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <div className="flex justify-center">
              <SubTitle label={j.label} />
            </div>
            <h3 className="mt-8 font-serif text-4xl font-light leading-[1.08] lg:text-6xl">{j.title}</h3>
            <p className="mt-6 text-center text-[11px] uppercase tracking-[0.3em] text-carbon/60">{j.subtitle}</p>
          </Reveal>
          <ul className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {j.members.map((m, i) => (
              <Reveal key={m.name} delay={i * 120}>
                <li>
                  <div className="aspect-[4/5] overflow-hidden">
                    <MediaPlaceholder
                      label={`${j.mediaPrefix} — ${m.name}`}
                      tone={TONES[i % TONES.length]}
                      className="h-full w-full"
                    />
                  </div>
                  <h4 className="mt-6 font-serif text-2xl font-light leading-tight">{m.name}</h4>
                  <p className="mt-3 text-[11px] uppercase leading-5 tracking-[0.2em] text-bosque">{m.role}</p>
                  <p className="mt-4 border-t border-carbon/15 pt-4 text-sm leading-relaxed text-carbon/75">
                    {m.profile}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
