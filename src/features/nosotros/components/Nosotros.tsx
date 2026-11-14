import { useLang } from '@/shared/i18n'
import { PatternZone } from '@/shared/ui/PatternZone'
import { CierreLegal } from './CierreLegal'
import { Equipo } from './Equipo'
import { Historia } from './Historia'
import { MisionVision } from './MisionVision'
import { NosotrosHero } from './NosotrosHero'
import { SectionNav } from './SectionNav'
import { Valores } from './Valores'

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
      {/* El contenedor mantiene fija la barra interna hasta el final de la página. */}
      <div className="relative">
        <SectionNav items={items} label={n.navAria} />
        {/* Zonas claras con el patrón lateral: Historia, Misión y Valores (consecutivas) y, tras el bloque oscuro de Equipo, el cierre. */}
        <PatternZone>
          <Historia />
          <MisionVision />
          <Valores />
        </PatternZone>
        <Equipo />
        <CierreLegal />
      </div>
    </>
  )
}
