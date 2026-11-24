import { Proyectos } from '@/features/proyectos/components/Proyectos'
import { useLang } from '@/shared/i18n'

/** /proyectos/ — hoy muestra el único proyecto de la lista (`t.proyectos.items`). */
export function ProyectosPage() {
  const [project] = useLang().t.proyectos.items
  return <Proyectos project={project} />
}
