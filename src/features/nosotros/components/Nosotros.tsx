import { useLang } from '@/shared/i18n'
import { SubTitle } from '@/shared/ui/SubTitle'
import { Historia } from './Historia'
import { NosotrosHero } from './NosotrosHero'
import { SectionNav } from './SectionNav'
import { SidePattern, type PatternVariant } from './SidePattern'

/** Variante del patrón lateral (se decide en la revisión de la Fase 3). */
const PATTERN: PatternVariant = 'zona'

/** Sección provisional de la Parte 2 de la Fase 3 (solo rótulo y título, sin contenido todavía). */
function Pendiente({
  id,
  n,
  label,
  title,
  dark,
}: {
  id: string
  n: string
  label: string
  title: string
  dark?: boolean
}) {
  return (
    <section id={id} className={`anchor-section py-28 ${dark ? 'bg-huito text-arena-clara' : 'bg-arena-clara'}`}>
      <div className="mx-auto max-w-6xl px-6">
        <SubTitle n={n} label={label} light={dark} />
        <h2 className="mt-8 font-serif text-title-sm font-light md:text-title">{title}</h2>
      </div>
    </section>
  )
}

export function Nosotros() {
  const { t } = useLang()
  const n = t.nosotros
  const items = [
    { id: 'historia', label: n.historia.label },
    { id: 'mision', label: n.mision.label },
    { id: 'valores', label: n.valores.label },
    { id: 'equipo', label: n.equipo.label },
  ]
  return (
    <>
      <NosotrosHero />
      {/* Zona clara: barra interna, historia, misión y valores. Las franjas del patrón la acompañan. */}
      <div className="relative">
        <SidePattern variant={PATTERN} />
        <SectionNav items={items} label={n.navAria} />
        <Historia />
        <Pendiente id="mision" n="02" label={n.mision.label} title={n.mision.title} />
        <Pendiente id="valores" n="03" label={n.valores.label} title={n.valores.title} />
      </div>
      <Pendiente id="equipo" n="04" label={n.equipo.label} title={n.equipo.title} dark />
    </>
  )
}
