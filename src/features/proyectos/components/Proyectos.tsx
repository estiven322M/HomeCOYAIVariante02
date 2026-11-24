import type { Proyecto } from '@/content/es/proyectos'
import { heroImage } from '@/features/proyectos/images'
import { PageHero } from '@/shared/ui/PageHero'
import { PatternZone } from '@/shared/ui/PatternZone'
import { Compromiso } from './Compromiso'
import { EstadoProyecto } from './EstadoProyecto'
import { Iniciativa } from './Iniciativa'
import { Llamado } from './Llamado'
import { PorQue } from './PorQue'
import { Resguardos } from './Resguardos'

/**
 * Un proyecto como página: hero con línea de estado, por qué importa, la iniciativa, los resguardos, el compromiso y el
 * llamado a la acción. Recibe el proyecto como dato: hoy lo usa `/proyectos/` con el único proyecto; con más de uno
 * servirá igual para cada ruta de proyecto. Zonas claras con el patrón lateral: «por qué» (sola) y «resguardos» +
 * «compromiso» (una sola zona); la sección oscura de la iniciativa y las del hero y el llamado quedan fuera.
 */
export function Proyectos({ project }: { project: Proyecto }) {
  const h = project.hero
  return (
    <>
      <PageHero image={heroImage()} eyebrow={h.eyebrow} title={h.title} subtitle={h.subtitle} size="long">
        <EstadoProyecto estado={h.estado} />
      </PageHero>
      <PorQue data={project.porQue} />
      <Iniciativa data={project.iniciativa} />
      <PatternZone className="bg-arena">
        <Resguardos slug={project.slug} data={project.resguardos} />
        <Compromiso data={project.compromiso} />
      </PatternZone>
      <Llamado data={project.cta} />
    </>
  )
}
