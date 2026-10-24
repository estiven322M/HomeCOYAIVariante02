import type { ReactNode } from 'react'
import { Button, Eyebrow, MediaPlaceholder, NAV, Reveal, TextLink, useScrollY, Logo } from './ui'

function Parallax({ children, speed = 0.04 }: { children: ReactNode; speed?: number }) {
  const y = useScrollY()
  return <div style={{ transform: `translateY(${(y % 4000) * -speed}px)` }} className="h-full will-change-transform">{children}</div>
}

export function QueEs() {
  return (
    <section id="que-es" className="bg-crema px-6 py-28 lg:py-40">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Eyebrow>INI-02 · Origen</Eyebrow>
          <h2 className="mt-6 font-serif text-5xl font-light leading-[1.05] lg:text-6xl">¿Qué es ÉCOYAI?</h2>
          <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-carbon/80">
            <p>ÉCOYAI es una organización que nace del territorio y trabaja en torno a la identidad cultural, los saberes y la salvaguarda de la lengua Siona.</p>
            <p>Su propósito es poner la tecnología —incluida la inteligencia artificial— al servicio de la memoria, para que aquello que merece permanecer pueda seguir transmitiéndose.</p>
            <p className="text-sm text-carbon/50">[Texto institucional provisional — pendiente de validación por ÉCOYAI]</p>
          </div>
          <div className="mt-10"><TextLink href="#nosotros">Conoce nuestra historia</TextLink></div>
        </Reveal>
        <Reveal delay={200} className="lg:col-span-6 lg:col-start-7">
          <div className="aspect-[4/5] overflow-hidden"><Parallax><MediaPlaceholder label="Fotografía documental — territorio y comunidad" className="h-[110%] w-full" /></Parallax></div>
          <div className="mt-6 flex items-start justify-between gap-6 border-t border-carbon/15 pt-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-carbon/60">Nace en el Putumayo</p>
            <p className="max-w-[16rem] font-serif text-lg italic leading-snug text-bosque">Territorio, memoria y lengua como un mismo tejido.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function MisionVision() {
  const items = [
    { k: 'Misión', t: 'Contribuir a la salvaguarda de la lengua Siona y sus saberes, acompañando su transmisión con herramientas tecnológicas al servicio de la comunidad.' },
    { k: 'Visión', t: 'Un futuro en el que la memoria del territorio siga viva, y la tecnología sea un medio para cuidarla y no un fin en sí misma.' },
  ]
  return (
    <section id="mision" className="bg-calido px-6 py-28 lg:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal><Eyebrow>INI-03 · Propósito</Eyebrow></Reveal>
        <div className="mt-14 grid gap-20 md:grid-cols-2 md:gap-16">
          {items.map((i, idx) => (
            <Reveal key={i.k} delay={idx * 200}>
              <div className="flex items-center gap-4"><span className="h-px w-10 bg-tierra" /><span className="text-[11px] uppercase tracking-[0.3em] text-carbon/60">0{idx + 1}</span></div>
              <h3 className="mt-8 font-serif text-6xl font-light italic text-bosque lg:text-7xl">{i.k}</h3>
              <p className="mt-8 max-w-md font-serif text-2xl font-light leading-snug text-carbon/85">{i.t}</p>
              <p className="mt-4 text-sm text-carbon/45">[Redacción provisional]</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-20 border-t border-carbon/15 pt-8"><TextLink href="#nosotros">Conoce nuestra misión y visión</TextLink></Reveal>
      </div>
    </section>
  )
}

export function Proyecto() {
  return (
    <section id="proyecto" className="relative overflow-hidden bg-selva text-calido">
      <div className="absolute inset-0 opacity-60"><Parallax speed={0.03}><MediaPlaceholder label="Imagen — transmisión oral, comunidad y territorio" tone="river" className="h-[120%] w-full" /></Parallax></div>
      <div className="absolute inset-0 bg-gradient-to-r from-selva via-selva/85 to-selva/20" />
      <div className="relative mx-auto grid min-h-[90vh] max-w-6xl items-center gap-12 px-6 py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Eyebrow light>INI-04 · Proyecto destacado</Eyebrow>
          <h2 className="mt-6 font-serif text-5xl font-light leading-[1.05] lg:text-7xl">Una lengua también guarda <em className="italic text-arena">una memoria.</em></h2>
          <p className="mt-8 max-w-lg text-[17px] leading-relaxed text-calido/80">
            El proyecto de salvaguarda de la lengua Siona explora cómo la inteligencia artificial puede ser una herramienta para contribuir a su preservación y transmisión: registrar, organizar y acompañar el aprendizaje, siempre desde la voz de la comunidad.
          </p>
          <div className="mt-10"><Button href="#proyectos">Conoce el proyecto</Button></div>
        </Reveal>
        <Reveal delay={250} className="lg:col-span-4 lg:col-start-9">
          <ol className="space-y-5 border-l border-calido/20 pl-6 text-sm text-calido/75">
            {['Lengua', 'Memoria', 'Comunidad', 'Transmisión'].map((w, i) => (
              <li key={w} className="flex items-baseline gap-4"><span className="font-serif text-xs text-tierra">0{i + 1}</span><span className="font-serif text-2xl font-light text-calido">{w}</span></li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

export function Explora() {
  return (
    <section id="explora" className="bg-arena/60 px-6 py-28 lg:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>INI-05 · Índice</Eyebrow>
          <h2 className="mt-6 font-serif text-5xl font-light lg:text-6xl">Explora ÉCOYAI</h2>
        </Reveal>
        <ul className="mt-16 border-t border-carbon/20">
          {NAV.map((i, idx) => (
            <Reveal key={i.n} delay={idx * 80}>
              <li id={i.href.slice(1)} className="scroll-mt-24 border-b border-carbon/20">
                <a href={i.href} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-8 transition-all duration-700 hover:bg-selva hover:px-6 hover:text-calido md:grid-cols-[4rem_1.2fr_1fr_auto] md:py-10">
                  <span className="font-serif text-sm text-tierra group-hover:text-arena">{i.n}</span>
                  <span className="font-serif text-3xl font-light transition-transform duration-700 group-hover:translate-x-2 md:text-4xl">{i.label}</span>
                  <span className="col-span-3 col-start-2 row-start-2 text-sm text-carbon/60 group-hover:text-calido/70 md:col-span-1 md:col-start-3 md:row-start-1">{i.desc}</span>
                  <span aria-hidden className="text-2xl transition-transform duration-700 group-hover:translate-x-2">→</span>
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
  return (
    <section id="colaborar" className="relative flex min-h-[90vh] items-center overflow-hidden bg-bosque text-calido">
      <div className="absolute inset-0"><Parallax speed={0.03}><MediaPlaceholder label="Fotografía — territorio del Putumayo al atardecer" tone="earth" className="h-[120%] w-full" /></Parallax></div>
      <div className="absolute inset-0 bg-selva/55" />
      <Reveal className="relative mx-auto max-w-4xl px-6 py-28 text-center">
        <Eyebrow light>INI-06 · Colaborar</Eyebrow>
        <h2 className="mt-8 font-serif text-5xl font-light leading-[1.05] lg:text-7xl">El futuro también se construye <em className="italic text-arena">acompañando.</em></h2>
        <p className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-calido/80">Tu apoyo puede contribuir a fortalecer iniciativas que conectan tecnología, territorio y preservación cultural.</p>
        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="#donaciones">Donar</Button>
          <Button href="#alianzas" variant="ghost">Crear una alianza</Button>
        </div>
      </Reveal>
    </section>
  )
}

export function Footer() {
  return (
    <footer id="contacto" className="bg-selva px-6 pb-10 pt-20 text-calido/70">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-5 max-w-xs font-serif text-lg font-light italic text-calido/60">Desde el territorio, hacia el futuro.</p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="space-y-3 text-sm">{NAV.map((i) => <li key={i.n}><a href={i.href} className="hover:text-calido">{i.label}</a></li>)}</ul>
        </nav>
        <div className="space-y-3 text-sm">
          <p className="text-[11px] uppercase tracking-[0.3em] text-calido/45">Redes sociales</p>
          <p>[Instagram]</p><p>[Facebook]</p><p>[YouTube]</p>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-6xl flex-col justify-between gap-4 border-t border-calido/10 pt-6 text-xs text-calido/45 md:flex-row">
        <p>© {new Date().getFullYear()} ÉCOYAI. Todos los derechos reservados.</p>
        <div className="flex gap-6"><a href="#legal" className="hover:text-calido">Aviso legal</a><a href="#privacidad" className="hover:text-calido">Política de privacidad</a></div>
      </div>
    </footer>
  )
}
