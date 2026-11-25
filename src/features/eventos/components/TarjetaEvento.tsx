import { Link } from 'react-router'
import { useLang, usePathFor } from '@/shared/i18n'
import { FillImage } from '@/shared/ui/FillImage'
import { fechaCompleta, insignia, intervalo } from '@/features/eventos/agenda'
import type { EventoPublicado } from '@/features/eventos/fuente'

/**
 * Tarjeta de un próximo evento. Con imagen, la insignia va sobre ella; sin imagen no hay bloque de imagen y la insignia
 * encabeza el texto. La insignia («14 / MAR / 2027») es visual; para lectores de pantalla va la fecha completa dentro
 * del mismo `<time>`. Si dura varios días, la insignia (primer día) es decorativa y el intervalo se lee, visible, bajo
 * el lugar.
 */
export function TarjetaEvento({ evento }: { evento: EventoPublicado }) {
  const { lang, t } = useLang()
  const pathFor = usePathFor()
  const a = t.eventos.agenda
  const { dia, mes, anio } = insignia(evento.fecha, lang)
  const varios = !!evento.fechaFin && evento.fechaFin !== evento.fecha

  const fecha = (
    <>
      <span aria-hidden className="flex flex-col">
        <span className="font-serif text-list-title leading-none">{dia}</span>
        <span className="mt-1.5 text-caption font-semibold uppercase tracking-[0.2em]">{mes}</span>
        <span className="text-caption tracking-[0.1em]">{anio}</span>
      </span>
      {!varios && <span className="sr-only">{fechaCompleta(evento.fecha, lang)}</span>}
    </>
  )

  const conImagen = !!evento.imagen?.available
  const insigniaFecha = (posicion: string) => (
    <p aria-hidden={varios || undefined} className={`${posicion} w-21 bg-ocre py-3 text-center text-huito`}>
      {varios ? fecha : <time dateTime={evento.fecha}>{fecha}</time>}
    </p>
  )

  const masInfo = {
    'aria-label': `${a.moreAbout} ${evento.nombre}`,
    className:
      'mt-auto inline-flex min-h-11 items-center gap-2.5 self-start pt-6 text-ui tracking-wide underline underline-offset-4 hover:text-ocre',
  }
  const textoMasInfo = (
    <>
      {a.more} <span aria-hidden>→</span>
    </>
  )

  return (
    <article className="flex h-full flex-col border border-calido/15 bg-calido/4">
      {conImagen && evento.imagen && (
        <div className="relative aspect-video">
          <FillImage
            spec={evento.imagen}
            tone="huito"
            alt={evento.imageAlt ?? ''}
            sizes="(min-width: 768px) 552px, 100vw"
          />
          {insigniaFecha('absolute left-5 top-5')}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {!conImagen && insigniaFecha('mb-6 self-start')}
        <p className="self-start border border-ocre/70 px-2.5 py-1 text-caption uppercase tracking-[0.15em] text-ocre">
          {evento.tipo}
        </p>
        <h3 className="mt-4.5 font-serif text-heading font-light">{evento.nombre}</h3>
        <p className="mt-2.5 flex items-start gap-2 text-ui text-calido/90">
          <svg
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-ocre"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <path d="M8 14.5s5-5 5-8.3a5 5 0 0 0-10 0c0 3.3 5 8.3 5 8.3Z" />
            <path d="M8 4.2l2 2-2 2-2-2Z" />
          </svg>
          <span>
            <span className="sr-only">{a.place} </span>
            {evento.lugar}
          </span>
        </p>
        {varios && evento.fechaFin && (
          <p className="mt-2 text-ui text-calido/90">
            {intervalo(evento.fecha, evento.fechaFin, lang).map((trozo) =>
              trozo.iso ? (
                <time key={trozo.iso} dateTime={trozo.iso}>
                  {trozo.texto}
                </time>
              ) : (
                trozo.texto
              ),
            )}
          </p>
        )}
        <p className="mt-3.5 text-body-sm text-calido/90">{evento.descripcion}</p>
        {evento.enlace ? (
          <a href={evento.enlace} {...masInfo}>
            {textoMasInfo}
          </a>
        ) : (
          <Link to={pathFor('contacto')} {...masInfo}>
            {textoMasInfo}
          </Link>
        )}
      </div>
    </article>
  )
}
