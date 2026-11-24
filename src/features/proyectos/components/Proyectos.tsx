import type { Proyecto } from '@/content/es/proyectos'
import { heroImage } from '@/features/proyectos/images'
import { PageHero } from '@/shared/ui/PageHero'
import { EstadoProyecto } from './EstadoProyecto'
import { Iniciativa } from './Iniciativa'
import { PorQue } from './PorQue'

/**
 * Un proyecto como página: hero con línea de estado, por qué importa, la iniciativa, los resguardos, el compromiso y el
 * llamado a la acción. Recibe el proyecto como dato: hoy lo usa `/proyectos/` con el único proyecto; con más de uno
 * servirá igual para cada ruta de proyecto.
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
    </>
  )
}
