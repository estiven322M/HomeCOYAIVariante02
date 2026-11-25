import type { Content } from '@/content'
import { Diamond } from '@/shared/ui/Diamond'
import { PatternZone } from '@/shared/ui/PatternZone'
import { SubTitle } from '@/shared/ui/SubTitle'
import { TextoCorrido } from '@/shared/ui/TextoCorrido'
import { useIntroduccion } from '@/features/eventos/fuente'

/** Sin introducción, el hero y la agenda son ambos huito: esta fila de rombos marca dónde acaba uno y empieza la otra. */
function Separador() {
  return (
    <div aria-hidden className="eventos-separador bg-huito pt-10 lg:pt-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rombos-separador" />
      </div>
    </div>
  )
}

/**
 * Introducción y cita. Sus textos dependen de la organización: sin título ni párrafos no se muestra la sección (queda un separador), y sin
 * cita no se muestra la columna de la cita. `texts` permite probarla con textos de prueba.
 */
export function Introduccion({ texts }: { texts?: Content['eventos']['intro'] }) {
  const publicada = useIntroduccion()
  const intro = texts ?? publicada
  if (!intro.title || intro.paragraphs.length === 0) return <Separador />

  return (
    <PatternZone as="section" className="bg-crema py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-[7fr_5fr] lg:gap-16">
        <div>
          <SubTitle label={intro.label} />
          <h2 className="mt-6 font-serif text-title-sm font-light md:text-subtitle">{intro.title}</h2>
          <div className="mt-10 space-y-6 text-body text-carbon/85">
            {intro.paragraphs.map((p) => (
              <TextoCorrido key={p}>{p}</TextoCorrido>
            ))}
          </div>
        </div>
        {intro.quote && (
          <figure className="border-t border-carbon/20 pt-8 lg:mt-[4.5rem]">
            <Diamond className="size-3.5 bg-ocre" />
            <blockquote className="mt-5 font-serif text-lead font-light italic text-chagra md:text-quote">
              <p>{intro.quote}</p>
            </blockquote>
            {intro.quoteAuthor && <figcaption className="mt-4 text-ui text-carbon/85">{intro.quoteAuthor}</figcaption>}
          </figure>
        )}
      </div>
    </PatternZone>
  )
}
