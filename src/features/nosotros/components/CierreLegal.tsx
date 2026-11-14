import { useLang, usePathFor } from '@/shared/i18n'
import { PatternZone } from '@/shared/ui/PatternZone'
import { TextLink } from '@/shared/ui/TextLink'

/**
 * Cierre: el marco legal y los documentos viven en /transparencia/ (una sola fuente); aquí solo se muestra el título
 * y las insignias que ya existen allí (`t.transparencia.legal`) y se enlaza. No es una sección de la barra interna.
 */
export function CierreLegal() {
  const { t } = useLang()
  const pathFor = usePathFor()
  const g = t.transparencia.legal
  return (
    <PatternZone as="section" className="bg-arena py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-serif text-title-sm font-light text-huito md:text-title">{g.title}</h2>
        <ul className="mt-8 flex flex-wrap gap-2">
          {g.badges.map((b) => (
            <li
              key={b}
              className="border border-chagra/40 px-3 py-1.5 text-caption uppercase tracking-[0.2em] text-chagra"
            >
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <TextLink href={`${pathFor('transparencia')}#marco-legal`}>{t.nosotros.cierre.link}</TextLink>
        </div>
      </div>
    </PatternZone>
  )
}
