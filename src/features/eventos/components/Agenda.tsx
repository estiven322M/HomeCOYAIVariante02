import { useLang, usePathFor } from '@/shared/i18n'
import { Button } from '@/shared/ui/Button'
import { SubTitle } from '@/shared/ui/SubTitle'
import { proximos } from '@/features/eventos/agenda'
import { useEventos, type EventoPublicado } from '@/features/eventos/fuente'
import { useHoy } from '@/features/eventos/useHoy'
import { TarjetaEvento } from './TarjetaEvento'

/** Próximos eventos en tarjetas o, si no queda ninguno, el estado vacío. `eventos` permite probarla con ejemplos. */
export function Agenda({ eventos }: { eventos?: readonly EventoPublicado[] }) {
  const { t } = useLang()
  const publicados = useEventos()
  const hoy = useHoy()
  const a = t.eventos.agenda
  const lista = proximos(eventos ?? publicados, hoy)

  return (
    <section aria-labelledby="eventos-proximos" className="sobre-huito bg-huito py-20 text-calido lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SubTitle label={a.label} light />
        <h2 id="eventos-proximos" className="mt-6 font-serif text-title-sm font-light md:text-subtitle">
          {a.title}
        </h2>
        {lista.length > 0 ? (
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {lista.map((evento) => (
              <li key={evento.id}>
                <TarjetaEvento evento={evento} />
              </li>
            ))}
          </ul>
        ) : (
          <EstadoVacio />
        )}
      </div>
    </section>
  )
}

function EstadoVacio() {
  const { t } = useLang()
  const pathFor = usePathFor()
  const v = t.eventos.agenda.empty
  return (
    <div className="mt-12 grid gap-8 border border-ocre/50 px-6 py-10 md:px-16 md:py-14 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-12">
      <div>
        <div aria-hidden className="rombos-separador w-[8.75rem] opacity-100" />
        <p className="mt-7 font-serif text-heading font-light md:text-title-sm">{v.title}</p>
      </div>
      <div>
        <p className="text-body text-calido/90">{v.text}</p>
        <div className="mt-6 grid sm:block">
          <Button href={pathFor('contacto')}>{v.cta}</Button>
        </div>
      </div>
    </div>
  )
}
