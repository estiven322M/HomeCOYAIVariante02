// De dónde salen los datos de la página: el contenido publicado. El build de demostración (solo local) sustituye este
// módulo por fuente.demo.ts (ver vite.config.ts). Impórtalo siempre como `@/features/eventos/fuente`.
import type { Content } from '@/content'
import { EVENTOS, type EventoAgenda } from '@/content/agenda'
import type { TextoEvento } from '@/content/es/eventos'
import { useLang } from '@/shared/i18n'

/** Un evento con sus textos en el idioma actual. */
export type EventoPublicado = EventoAgenda & TextoEvento

export function useEventos(): EventoPublicado[] {
  const textos: Record<string, TextoEvento | undefined> = useLang().t.eventos.agenda.items
  // El typecheck exige textos para cada id en los dos idiomas.
  return (EVENTOS as readonly EventoAgenda[]).flatMap((evento) => {
    const texto = textos[evento.id]
    return texto ? [{ ...evento, ...texto }] : []
  })
}

export function useIntroduccion(): Content['eventos']['intro'] {
  return useLang().t.eventos.intro
}
