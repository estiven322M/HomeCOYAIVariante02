import { useState } from 'react'
import { Button, Eyebrow, useScrollY } from './ui'

/** Replace with the real Putumayo drone footage (e.g. '/video/putumayo-drone.mp4'). */
const VIDEO_SRC = ''
const POSTER_SRC = ''

export function Hero() {
  const y = useScrollY()
  const [ready, setReady] = useState(false)
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const p = Math.min(y / vh, 1)

  return (
    <section id="inicio" aria-label="Territorio" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-selva">
      {/* Video layer: recedes gradually as the story begins */}
      <div className="absolute inset-0" style={{ transform: `scale(${1 + p * 0.06})`, opacity: 1 - p * 0.55 }}>
        {VIDEO_SRC ? (
          <video className={`h-full w-full object-cover transition-opacity duration-[2000ms] ${ready ? 'opacity-100' : 'opacity-0'}`}
            src={VIDEO_SRC} poster={POSTER_SRC || undefined} autoPlay loop muted playsInline onCanPlay={() => setReady(true)} aria-hidden />
        ) : (
          <div className="drift absolute inset-0" aria-hidden
            style={{ background: 'radial-gradient(70% 55% at 62% 48%, #4d6b45 0%, #2b4530 35%, #142619 70%, #08120c 100%), #0f1f17' }}>
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #3b5a37 0 8%, transparent 9%), radial-gradient(circle at 70% 70%, #2f4b2e 0 10%, transparent 11%), radial-gradient(circle at 45% 60%, #456641 0 6%, transparent 7%), radial-gradient(circle at 85% 25%, #34502f 0 9%, transparent 10%)', backgroundSize: '220px 220px' }} />
            <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M-5 78 C 20 70, 30 88, 50 72 S 80 55, 105 62" stroke="#a9b59a" strokeWidth="0.6" fill="none" />
            </svg>
          </div>
        )}
      </div>
      {/* Subtle legibility veil */}
      <div className="absolute inset-0 bg-gradient-to-t from-selva/80 via-selva/10 to-selva/30" />
      {!VIDEO_SRC && (
        <p className="absolute right-6 top-24 z-10 border border-calido/25 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-calido/70 lg:top-10">
          [Video — Selva del Putumayo / Drone]
        </p>
      )}

      {/* Editorial content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-28 lg:pl-[22rem] lg:pr-16 lg:pb-24"
        style={{ transform: `translateY(${p * -40}px)`, opacity: 1 - p * 1.2 }}>
        <div className="max-w-2xl">
          <Eyebrow light>Desde el territorio, hacia el futuro</Eyebrow>
          <h1 className="mt-6 font-serif text-5xl font-light leading-[1.02] tracking-tight text-calido sm:text-6xl xl:text-7xl">
            El territorio guarda una <em className="italic text-arena">memoria viva.</em>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-calido/80">
            ÉCOYAI conecta territorio, saberes y tecnología para contribuir a la salvaguarda de la lengua Siona y su memoria.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#que-es">Conoce ÉCOYAI</Button>
            <Button href="#proyecto" variant="ghost">Explora el proyecto</Button>
          </div>
        </div>
      </div>

      {/* Context markers */}
      <div className="absolute bottom-8 right-6 z-10 hidden text-right text-[10px] uppercase leading-5 tracking-[0.3em] text-calido/60 md:block lg:right-16">
        <p>Putumayo</p><p>Colombia</p>
      </div>
      <p className="absolute right-6 top-1/2 z-10 hidden origin-right -translate-y-1/2 translate-x-[calc(50%-6px)] rotate-90 text-[10px] uppercase tracking-[0.4em] text-calido/45 xl:block">
        Territorio · Identidad · Saberes · Lengua · Tecnología
      </p>
      <a href="#que-es" className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-calido/70 hover:text-calido lg:left-[calc(50%+9rem)]">
        Explora <span aria-hidden className="bob text-base">↓</span>
      </a>
    </section>
  )
}
