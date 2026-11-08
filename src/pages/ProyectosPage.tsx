import { Proyecto } from '@/features/home/components/Sections'
import { SoonNotice } from '@/shared/ui/SoonNotice'

/** /proyectos/ — reutiliza el texto del proyecto destacado; el resto está por llegar. */
export function ProyectosPage() {
  return (
    <>
      <Proyecto asPage />
      <SoonNotice />
    </>
  )
}
