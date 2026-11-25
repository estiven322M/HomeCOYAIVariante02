import { EventosHero } from '@/features/eventos/components/EventosHero'
import { Introduccion } from '@/features/eventos/components/Introduccion'
import { SoonNotice } from '@/shared/ui/SoonNotice'

/** /eventos/ */
export function EventosPage() {
  return (
    <>
      <EventosHero />
      <Introduccion />
      {/* Provisional hasta que lleguen la agenda, la memoria y el llamado. */}
      <SoonNotice />
    </>
  )
}
