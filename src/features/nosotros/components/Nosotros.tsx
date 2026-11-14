import { useLang } from '@/shared/i18n'
import { CierreLegal } from './CierreLegal'
import { Equipo } from './Equipo'
import { Historia } from './Historia'
import { MisionVision } from './MisionVision'
import { NosotrosHero } from './NosotrosHero'
import { SectionNav } from './SectionNav'
import { SidePattern } from './SidePattern'
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
      {/* Todo el contenido va en un contenedor para que la barra interna siga fija hasta el final de la página. */}
      <div className="relative">
        <SidePattern />
        <SectionNav items={items} label={n.navAria} />
        <Historia />
        <MisionVision />
        <Valores />
        <Equipo />
        <CierreLegal />
      </div>
    </>
  )
}
