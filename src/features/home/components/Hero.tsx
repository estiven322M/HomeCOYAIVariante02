import type { CSSProperties } from 'react'
import { Button } from '@/shared/ui/Button'
import { useScrollY } from '@/shared/hooks/useScrollY'
import { useLang } from '@/shared/i18n'
import { useIntro } from '@/shared/intro/intro-context'

/** Putumayo rainforest footage: file lives in public/video/. The gradient shows until it loads. */
const VIDEO_SRC = '/video/video-hero.webm'
const POSTER_SRC = '/video/video-poster.jpg'

/** Staggered entrance after the intro: --i × 150 ms (see .intro-item in index.css). */
const item = (i: number) => ({ '--i': i }) as CSSProperties

export function Hero() {
  const h = useLang().t.hero
  const y = useScrollY()
  const { reportVideo } = useIntro()
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const p = Math.min(y / vh, 1)

  return (
    <section
      id="inicio"
      aria-label={h.aria}
      className="hero-scope relative -mb-px h-[100svh] min-h-[600px] overflow-hidden bg-selva"
    >
      {/* Video layer: recedes gradually as the story begins */}
      <div className="absolute inset-0" style={{ transform: `scale(${1 + p * 0.06})`, opacity: 1 - p * 0.55 }}>
        {/* Fallback while the video loads (or if the file is missing) */}
        <div
          className="drift absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(70% 55% at 62% 48%, #718b5a 0%, #4e6b3a 35%, #1c2233 70%, #1c2233 100%), #1c2233',
          }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 30%, #718b5a 0 8%, transparent 9%), radial-gradient(circle at 70% 70%, #4e6b3a 0 10%, transparent 11%), radial-gradient(circle at 45% 60%, #718b5a 0 6%, transparent 7%), radial-gradient(circle at 85% 25%, #4e6b3a 0 9%, transparent 10%)',
              backgroundSize: '220px 220px',
            }}
          />
          <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M-5 78 C 20 70, 30 88, 50 72 S 80 55, 105 62" stroke="#d8c8ac" strokeWidth="0.6" fill="none" />
          </svg>
        </div>
        {VIDEO_SRC && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO_SRC}
            poster={POSTER_SRC || undefined}
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={reportVideo}
            onError={reportVideo}
            aria-hidden
          />
        )}
      </div>
      {/* Legibility gradients (the video keeps full opacity) */}
      <div className="hero-grad-v absolute inset-0" aria-hidden />
      <div className="hero-grad-h absolute inset-0" aria-hidden />
      <div className="hero-grad-top absolute inset-x-0 top-0 h-40" aria-hidden />
      {/* Transición al crema de #origen: solo CSS, sin eventos */}
      <div className="hero-fade pointer-events-none absolute inset-x-0 bottom-0" aria-hidden="true" />

      {/* Editorial content */}
      <div
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-[17rem] lg:px-16 lg:pb-56"
        style={{ transform: `translateY(${p * -40}px)`, opacity: 1 - p * 1.2 }}
      >
        <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
          <p className="intro-item hero-eyebrow text-[11px] uppercase tracking-[0.3em]" style={item(0)}>
            {h.eyebrow}
          </p>
          <h1
            className="intro-item hero-title mt-6 font-serif text-5xl font-light leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl"
            style={item(1)}
          >
            {h.title} <em className="italic">{h.titleEm}</em>
          </h1>
          <p className="intro-item hero-text mt-6 max-w-md text-base leading-relaxed" style={item(2)}>
            {h.text}
          </p>
          <div className="intro-item mt-9 flex flex-col gap-3 sm:flex-row" style={item(3)}>
            <Button href="#origen" variant="hero">
              {h.cta1}
            </Button>
            <Button href="#proyecto" variant="heroGhost">
              {h.cta2}
            </Button>
          </div>
        </div>
      </div>

      {/* Context markers */}
      <div
        className="intro-item hero-meta absolute bottom-[150px] right-6 z-10 hidden text-right text-[10px] uppercase leading-5 tracking-[0.3em] md:block lg:right-16"
        style={item(7)}
      >
        <p>Putumayo</p>
        <p>Colombia</p>
      </div>
      <p
        className="intro-item text-calido/45 absolute right-6 top-1/2 z-10 hidden origin-right -translate-y-1/2 translate-x-[calc(50%-6px)] rotate-90 text-[10px] uppercase tracking-[0.4em] xl:block"
        style={item(7)}
      >
        {h.keywords}
      </p>
      <a
        href="#origen"
        className="intro-item hero-meta hero-link absolute bottom-[140px] left-1/2 z-10 flex min-h-14 min-w-14 -translate-x-1/2 flex-col items-center justify-center gap-1 px-3 text-[10px] uppercase tracking-[0.35em]"
        style={item(6)}
      >
        {h.explore}{' '}
        <span aria-hidden className="bob text-base">
          ↓
        </span>
      </a>
    </section>
  )
}
