import { Agenda } from '@/features/eventos/components/Agenda'
import { EventosHero } from '@/features/eventos/components/EventosHero'
import { Introduccion } from '@/features/eventos/components/Introduccion'
import { Llamado } from '@/features/eventos/components/Llamado'
import { Memoria } from '@/features/eventos/components/Memoria'

/** /eventos/ */
export function EventosPage() {
  return (
    <>
      <EventosHero />
      <Introduccion />
      <Agenda />
      <Memoria />
      <Llamado />
    </>
  )
}
