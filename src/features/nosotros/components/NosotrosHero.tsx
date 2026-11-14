import { useLang } from '@/shared/i18n'
import { HERO_H, HERO_SIZES, HERO_SRC, HERO_SRCSET, HERO_W } from '@/features/nosotros/hero-image'

/** Hero de la página: foto de la selva (imagen principal: prioridad alta, sin lazy), título y subtítulo. */
export function NosotrosHero() {
  const { t } = useLang()
  const n = t.nosotros
  // «Putumayo · Colombia» se reutiliza de `common.sideNav.place`, partido en dos líneas.
  const place = t.common.sideNav.place.split(' · ')
  return (
    <section className="relative h-[34rem] overflow-hidden bg-(--color-noche) md:h-[40rem]">
      <img
        src={HERO_SRC}
        srcSet={HERO_SRCSET}
        sizes={HERO_SIZES}
        width={HERO_W}
        height={HERO_H}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[55%_center] md:object-center"
      />
      <div aria-hidden className="nosotros-velo-h absolute inset-0" />
      <div aria-hidden className="nosotros-velo-v absolute inset-0" />
      <div aria-hidden className="nosotros-velo-esquina absolute inset-0 hidden sm:block" />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-16 md:pb-24">
        <p className="hero-eyebrow text-caption uppercase tracking-[0.3em]">{n.eyebrow}</p>
        <h1 className="hero-title mt-6 font-serif text-display-sm font-light tracking-tight md:text-display">
          {t.common.nav[0]?.label}
        </h1>
        <p className="hero-text mt-6 max-w-[30rem] font-serif text-lead font-light italic">{n.hero.subtitle}</p>
      </div>
      <p
        aria-hidden
        className="hero-meta absolute bottom-10 right-6 hidden text-right text-caption leading-5 uppercase tracking-[0.3em] sm:block"
      >
        {place.map((line, i) => (
          <span key={line}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
    </section>
  )
}
