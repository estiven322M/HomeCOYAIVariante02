import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Button } from '@/shared/ui/Button'
import { Eyebrow } from '@/shared/ui/Eyebrow'
import { Logo } from '@/shared/ui/Logo'
import { MediaPlaceholder } from '@/shared/ui/MediaPlaceholder'
import { Reveal } from '@/shared/ui/Reveal'
import { TextLink } from '@/shared/ui/TextLink'
import { useScrollY } from '@/shared/hooks/useScrollY'
import { useLang, useNav } from '@/shared/i18n'

function Parallax({ children, speed = 0.04 }: { children: ReactNode; speed?: number }) {
  const y = useScrollY()
  return (
    <div style={{ transform: `translateY(${(y % 4000) * -speed}px)` }} className="h-full will-change-transform">
      {children}
    </div>
  )
}

const SLIDER_COUNT = 9
const SLIDER_SRCS = Array.from({ length: SLIDER_COUNT }, (_, i) => `/slider/slider${i + 1}.webp`)

/** Dirección del paneo Ken Burns por imagen (se alterna para dar variedad). */
const KEN_BURNS_PANS = [
  ['-1%', '-0.75%'],
  ['1%', '-0.75%'],
  ['-1%', '0.75%'],
  ['1%', '0.75%'],
]

/** Botón del carrusel: 44×44 mínimo, fondo sólido y foco claro sobre la foto. */
const SLIDER_BTN =
  'absolute flex h-11 w-11 items-center justify-center bg-selva text-2xl leading-none text-calido transition hover:bg-bosque focus-visible:outline-calido'

/** Slider de imágenes: toma /slider/slider1.webp … slider9.webp desde public/slider; ignora las que no existan. */
function ImageSlider({ label }: { label: string }) {
  const q = useLang().t.queEs
  const [missing, setMissing] = useState<Set<string>>(new Set())
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  // Con prefers-reduced-motion el avance automático arranca detenido.
  const [userPaused, setUserPaused] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const paused = hovered || userPaused
  const slides = SLIDER_SRCS.filter((s) => !missing.has(s))
  const n = slides.length
  const current = n ? index % n : 0

  useEffect(() => {
    if (n < 2 || paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % n), 5000)
    return () => clearInterval(id)
  }, [n, paused])

  // La imagen que sale conserva su movimiento mientras dura el fundido, para que no pegue un salto.
  const [leaving, setLeaving] = useState<string | null>(null)
  const [shown, setShown] = useState<string | undefined>(undefined)
  const currentSrc = slides[current]
  useEffect(() => {
    if (shown && shown !== currentSrc) {
      setLeaving(shown)
      const t = setTimeout(() => setLeaving(null), 1100)
      setShown(currentSrc)
      return () => clearTimeout(t)
    }
    setShown(currentSrc)
  }, [currentSrc])

  const go = (d: number) => setIndex((current + d + n) % n)

  return (
    <div
      className="relative aspect-[4/5] overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {n === 0 && <MediaPlaceholder label={label} className="h-full w-full" />}
      {SLIDER_SRCS.map((src, i) => {
        const pos = slides.indexOf(src)
        const [kbX, kbY] = KEN_BURNS_PANS[i % KEN_BURNS_PANS.length]
        return (
          <img
            key={src}
            src={src}
            alt=""
            onError={() => setMissing((m) => new Set(m).add(src))}
            style={{ '--kb-x': kbX, '--kb-y': kbY } as CSSProperties}
            className={`${pos === current || src === leaving ? 'kenburns' : ''} absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${pos === current ? 'opacity-100' : 'opacity-0'}`}
          />
        )
      })}
      {n > 1 && (
        <>
          <button
            type="button"
            aria-label={q.prev}
            onClick={() => go(-1)}
            className={`${SLIDER_BTN} left-3 top-1/2 -translate-y-1/2`}
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            aria-label={q.next}
            onClick={() => go(1)}
            className={`${SLIDER_BTN} right-3 top-1/2 -translate-y-1/2`}
          >
            <span aria-hidden>›</span>
          </button>
          <button
            type="button"
            aria-label={userPaused ? q.play : q.pause}
            aria-pressed={userPaused}
            onClick={() => setUserPaused((v) => !v)}
            className={`${SLIDER_BTN} right-3 top-3`}
          >
            <span aria-hidden className="text-base">
              {userPaused ? '▶' : '❚❚'}
            </span>
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            {slides.map((s, i) => (
              <button
                key={s}
                type="button"
                aria-label={`${q.image} ${i + 1}`}
                aria-current={i === current}
                onClick={() => setIndex(i)}
                className="group flex h-11 w-8 items-center justify-center focus-visible:outline-calido"
              >
                <span className={`block h-1.5 w-6 transition ${i === current ? 'bg-calido' : 'bg-calido/40'}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function QueEs() {
  const q = useLang().t.queEs
  return (
    <section id="origen" className="scroll-mt-14 bg-crema px-6 py-28 lg:py-40">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Eyebrow>{q.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-serif text-5xl font-light leading-[1.05] lg:text-6xl">{q.title}</h2>
          <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-carbon/80">
            <p className="font-serif text-2xl italic leading-snug text-bosque">{q.p1}</p>
            <p>{q.p2}</p>
          </div>
          <div className="mt-10">
            <TextLink href="#nosotros">{q.link}</TextLink>
          </div>
        </Reveal>
        <Reveal delay={200} className="lg:col-span-6 lg:col-start-7">
          <ImageSlider label={q.media} />
          <div className="mt-6 flex items-start justify-between gap-6 border-t border-carbon/15 pt-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-carbon/60">{q.caption}</p>
            <p className="max-w-[16rem] font-serif text-lg italic leading-snug text-bosque">{q.quote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Proyecto() {
  const p = useLang().t.proyecto
  return (
    <section id="proyecto" className="relative overflow-hidden bg-selva text-calido">
      <div className="absolute inset-0 opacity-60">
        <Parallax speed={0.03}>
          <MediaPlaceholder label={p.media} tone="river" className="h-[120%] w-full" />
        </Parallax>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-selva via-selva/85 to-selva/20" />
      <div className="relative mx-auto grid min-h-[90vh] max-w-6xl items-center gap-12 px-6 py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Eyebrow light>{p.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-serif text-5xl font-light leading-[1.05] lg:text-7xl">
            {p.title} <em className="italic text-arena">{p.titleEm}</em>
          </h2>
          <p className="mt-8 max-w-lg text-[17px] leading-relaxed text-calido/80">{p.text}</p>
          <div className="mt-10">
            <Button href="#proyectos">{p.cta}</Button>
          </div>
        </Reveal>
        <Reveal delay={250} className="lg:col-span-4 lg:col-start-9">
          <ol className="space-y-5 border-l border-calido/20 pl-6 text-sm text-calido/75">
            {p.words.map((w, i) => (
              <li key={w} className="flex items-baseline gap-4">
                <span className="font-serif text-xs text-tierra">0{i + 1}</span>
                <span className="font-serif text-2xl font-light text-calido">{w}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

export function Explora() {
  const e = useLang().t.explora
  const NAV = useNav()
  return (
    <section id="explora" className="bg-arena/60 px-6 py-28 lg:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>{e.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-serif text-5xl font-light lg:text-6xl">{e.title}</h2>
        </Reveal>
        <ul className="mt-16 border-t border-carbon/20">
          {NAV.map((i, idx) => (
            <Reveal key={i.href} delay={idx * 80}>
              <li
                id={i.href === '#nosotros' ? undefined : i.href.slice(1)}
                className="scroll-mt-24 border-b border-carbon/20"
              >
                <a
                  href={i.href}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 py-8 transition-all duration-700 hover:bg-selva hover:px-6 hover:text-calido md:grid-cols-[1.2fr_1fr_auto] md:py-10"
                >
                  <span className="font-serif text-3xl font-light transition-transform duration-700 group-hover:translate-x-2 md:text-4xl">
                    {i.label}
                  </span>
                  <span className="col-span-2 col-start-1 row-start-2 text-sm text-carbon/60 group-hover:text-calido/70 md:col-span-1 md:col-start-2 md:row-start-1">
                    {i.desc}
                  </span>
                  <span aria-hidden className="text-2xl transition-transform duration-700 group-hover:translate-x-2">
                    →
                  </span>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Colaborar() {
  const c = useLang().t.colaborar
  return (
    <section id="colaborar" className="relative flex min-h-[90vh] items-center overflow-hidden bg-bosque text-calido">
      <div className="absolute inset-0">
        <Parallax speed={0.03}>
          <MediaPlaceholder label={c.media} tone="earth" className="h-[120%] w-full" />
        </Parallax>
      </div>
      <div className="absolute inset-0 bg-selva/55" />
      <Reveal className="relative mx-auto max-w-4xl px-6 py-28 text-center">
        <Eyebrow light>{c.eyebrow}</Eyebrow>
        <h2 className="mt-8 font-serif text-5xl font-light leading-[1.05] lg:text-7xl">
          {c.title} <em className="italic text-arena">{c.titleEm}</em>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-center text-[17px] leading-relaxed text-calido/80">{c.text}</p>
        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="#donaciones">{c.donate}</Button>
          <Button href="#alianzas" variant="ghost">
            {c.alliance}
          </Button>
        </div>
      </Reveal>
    </section>
  )
}

export function Footer() {
  const f = useLang().t.footer
  const NAV = useNav()
  return (
    <footer id="contacto" className="bg-selva px-6 pb-10 pt-20 text-calido/70">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-5 max-w-xs font-serif text-lg font-light italic text-calido/60">{f.tagline}</p>
        </div>
        <nav aria-label={f.navAria}>
          <ul className="space-y-3 text-sm">
            {NAV.map((i) => (
              <li key={i.href}>
                <a href={i.href} className="hover:text-calido">
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-3 text-sm">
          <p className="text-[11px] uppercase tracking-[0.3em] text-calido/45">{f.social}</p>
          <p>[Instagram]</p>
          <p>[Facebook]</p>
          <p>[YouTube]</p>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-6xl flex-col justify-between gap-4 border-t border-calido/10 pt-6 text-xs text-calido/45 md:flex-row">
        <p>
          © {new Date().getFullYear()} ÉCOYAI. {f.rights}
        </p>
        <div className="flex gap-6">
          <a href="#legal" className="hover:text-calido">
            {f.legal}
          </a>
          <a href="#privacidad" className="hover:text-calido">
            {f.privacy}
          </a>
        </div>
      </div>
    </footer>
  )
}
