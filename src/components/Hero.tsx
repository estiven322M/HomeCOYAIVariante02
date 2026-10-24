import { useState } from 'react'
import { Button, Eyebrow, useScrollY } from './ui'
import { useLang } from '../i18n'

/** Putumayo rainforest footage: file lives in public/video/. The gradient shows until it loads. */
const VIDEO_SRC = '/video/video-hero.mp4'
const POSTER_SRC = ''

export function Hero() {
  const h = useLang().t.hero
  const y = useScrollY()
  const [ready, setReady] = useState(false)
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const p = Math.min(y / vh, 1)

  return (
    <section id="inicio" aria-label={h.aria} className="relative h-[100svh] min-h-[600px] overflow-hidden bg-selva">
      {/* Video layer: recedes gradually as the story begins */}
      <div className="absolute inset-0" style={{ transform: `scale(${1 + p * 0.06})`, opacity: 1 - p * 0.55 }}>
        {/* Fallback while the video loads (or if the file is missing) */}
        <div className="drift absolute inset-0" aria-hidden
          style={{ background: 'radial-gradient(70% 55% at 62% 48%, #718b5a 0%, #4e6b3a 35%, #1c2233 70%, #1c2233 100%), #1c2233' }}>
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #718b5a 0 8%, transparent 9%), radial-gradient(circle at 70% 70%, #4e6b3a 0 10%, transparent 11%), radial-gradient(circle at 45% 60%, #718b5a 0 6%, transparent 7%), radial-gradient(circle at 85% 25%, #4e6b3a 0 9%, transparent 10%)', backgroundSize: '220px 220px' }} />
          <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M-5 78 C 20 70, 30 88, 50 72 S 80 55, 105 62" stroke="#d8c8ac" strokeWidth="0.6" fill="none" />
          </svg>
        </div>
        {VIDEO_SRC && (
          <video className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ${ready ? 'opacity-100' : 'opacity-0'}`}
            src={VIDEO_SRC} poster={POSTER_SRC || undefined} autoPlay loop muted playsInline onCanPlay={() => setReady(true)} aria-hidden />
        )}
      </div>
      {/* Subtle legibility veil */}
      <div className="absolute inset-0 bg-gradient-to-t from-selva/80 via-selva/10 to-selva/30" />

      {/* Editorial content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-28 lg:px-16 lg:pb-24"
        style={{ transform: `translateY(${p * -40}px)`, opacity: 1 - p * 1.2 }}>
        <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
          <Eyebrow light>{h.eyebrow}</Eyebrow>
          <h1 className="mt-6 font-serif text-5xl font-light leading-[1.02] tracking-tight text-calido sm:text-6xl xl:text-7xl">
            {h.title} <em className="italic text-arena">{h.titleEm}</em>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-calido/80">
            {h.text}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#que-es">{h.cta1}</Button>
            <Button href="#proyecto" variant="ghost">{h.cta2}</Button>
          </div>
        </div>
      </div>

      {/* Context markers */}
      <div className="absolute bottom-8 right-6 z-10 hidden text-right text-[10px] uppercase leading-5 tracking-[0.3em] text-calido/60 md:block lg:right-16">
        <p>Putumayo</p><p>Colombia</p>
      </div>
      <p className="absolute right-6 top-1/2 z-10 hidden origin-right -translate-y-1/2 translate-x-[calc(50%-6px)] rotate-90 text-[10px] uppercase tracking-[0.4em] text-calido/45 xl:block">
        {h.keywords}
      </p>
      <a href="#que-es" className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-calido/70 hover:text-calido">
        {h.explore} <span aria-hidden className="bob text-base">↓</span>
      </a>
    </section>
  )
}
