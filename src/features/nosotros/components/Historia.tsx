import { useLang } from '@/shared/i18n'
import { SubTitle } from '@/shared/ui/SubTitle'

/** 01 · Historia. El primer párrafo es el destacado; el resto, texto corrido. */
export function Historia() {
  const { t } = useLang()
  const h = t.nosotros.historia
  const [lead, ...rest] = h.paragraphs
  return (
    <section id="historia" className="anchor-section bg-arena py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SubTitle n="01" label={h.label} />
        <h2 className="mt-8 font-serif text-title-sm font-light text-huito md:text-title">{h.title}</h2>
        <div className="mt-14 grid items-start gap-10 md:grid-cols-[7fr_5fr] md:gap-16">
          <div>
            <p className="justificado font-serif text-lead font-light text-huito">{lead}</p>
            <div className="mt-8 space-y-6 text-body text-huito/80">
              {rest.map((p) => (
                <p key={p.slice(0, 24)} className="justificado">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <figure>
            <img
              src="/nosotros/rio-putumayo-1280.webp"
              srcSet="/nosotros/rio-putumayo-640.webp 640w, /nosotros/rio-putumayo-1280.webp 1280w"
              sizes="(min-width: 768px) 460px, calc(100vw - 48px)"
              width={1280}
              height={960}
              alt={h.image.alt}
              loading="lazy"
              decoding="async"
              className="block aspect-[4/5] w-full object-cover object-[72%_50%]"
            />
            <figcaption className="mt-5 flex flex-col gap-2 border-t border-huito/15 pt-4 md:flex-row md:items-start md:justify-between md:gap-6">
              <span className="text-caption uppercase tracking-[0.3em] text-huito/70">{h.image.caption}</span>
              {/* La frase es la de «¿Qué es ÉCOYAI?» de la portada (`home.queEs.quote`): una sola clave. */}
              <span className="font-serif text-note italic text-chagra md:max-w-60 md:text-right">
                {t.home.queEs.quote}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
