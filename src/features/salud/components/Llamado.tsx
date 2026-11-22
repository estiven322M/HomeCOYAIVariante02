import { useLang } from '@/shared/i18n'
import { Diamond } from '@/shared/ui/Diamond'
import { PatternZone } from '@/shared/ui/PatternZone'
import { SubTitle } from '@/shared/ui/SubTitle'
import { TextoCorrido } from '@/shared/ui/TextoCorrido'
import { SaludImage } from './SaludImage'

/** El llamado: texto justificado, cita destacada y retrato 4:5. Zona clara con el patrón lateral. */
export function Llamado() {
  const l = useLang().t.salud.llamado
  return (
    <PatternZone as="section" className="bg-arena px-6 py-28">
      <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-[7fr_5fr] md:gap-16">
        <div>
          <SubTitle label={l.label} />
          <h2 className="mt-8 font-serif text-title-sm font-light text-huito md:text-title">{l.title}</h2>
          <div className="mt-10 space-y-6 text-body text-huito/80">
            {l.paragraphs.map((p) => (
              <TextoCorrido key={p.slice(0, 24)}>{p}</TextoCorrido>
            ))}
          </div>
          <blockquote className="mt-12 border-t border-huito/20 pt-8">
            <Diamond className="size-3 bg-ocre" />
            <p className="mt-5 font-serif text-heading font-light italic text-chagra">{l.quote}</p>
          </blockquote>
        </div>
        <figure className="relative aspect-[4/5] w-full overflow-hidden bg-tierra-suave">
          <SaludImage id="llamado" tone="claro" sizes="(min-width: 768px) 460px, calc(100vw - 48px)" alt={l.imageAlt} />
        </figure>
      </div>
    </PatternZone>
  )
}
