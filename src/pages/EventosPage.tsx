import { Agenda } from '@/features/eventos/components/Agenda'
import { EventosHero } from '@/features/eventos/components/EventosHero'
import { Introduccion } from '@/features/eventos/components/Introduccion'
import { SoonNotice } from '@/shared/ui/SoonNotice'

/** /eventos/ */
export function EventosPage() {
  return (
    <>
      <EventosHero />
      <Introduccion />
      <Agenda />
      {/* Provisional hasta que lleguen la memoria y el llamado. */}
      <SoonNotice />
    </>
  )
}
