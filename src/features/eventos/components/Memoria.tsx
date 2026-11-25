import { usePathFor, useLang } from '@/shared/i18n'
import { FillImage } from '@/shared/ui/FillImage'
import { PatternZone } from '@/shared/ui/PatternZone'
import { SubTitle } from '@/shared/ui/SubTitle'
import { TextLink } from '@/shared/ui/TextLink'
import { useMemoria, type AnioPublicado } from '@/features/eventos/fuente'

/** Fotos por año: hasta 6 desde `md` y 4 en móvil (2 columnas, sin carrusel). El resto está en la Galería. */
const MAXIMO = 6
const MAXIMO_MOVIL = 4

/**
 * Memoria de encuentros anteriores, del año más reciente al más antiguo. Sin fotos no se muestra. Las fotos no son
 * enlaces: todas llevarían a la misma Galería, que tiene su propio enlace. `anios` permite probarla con ejemplos.
 */
export function Memoria({ anios }: { anios?: readonly AnioPublicado[] }) {
  const { t } = useLang()
  const pathFor = usePathFor()
  const publicados = useMemoria()
  const m = t.eventos.memoria
  const conFotos = [...(anios ?? publicados)].filter((a) => a.fotos.length > 0).sort((a, b) => b.anio - a.anio)
  if (conFotos.length === 0) return null

  return (
    <PatternZone as="section" className="bg-crema py-20 lg:py-28">
      {/* Un solo enlace a la Galería: al final en móvil; desde md, a la derecha del título. */}
      <div className="mx-auto grid max-w-6xl px-6 md:grid-cols-[1fr_auto] md:items-end md:gap-x-6">
        <div>
          <SubTitle label={m.label} />
          <h2 className="mt-6 font-serif text-title-sm font-light md:text-subtitle">{m.title}</h2>
        </div>
        <div className="mt-10 md:col-span-2 md:row-start-2">
          {conFotos.map(({ anio, fotos }) => (
            <div key={anio}>
              <div aria-hidden className="rombos-separador opacity-80" />
              <div className="grid gap-7 py-10 lg:grid-cols-[12.5rem_minmax(0,1fr)] lg:gap-10">
                <h3 className="font-serif text-list-title font-light leading-none text-achiote">{anio}</h3>
                <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
                  {fotos.slice(0, MAXIMO).map((foto, i) => (
                    <li key={foto.id} className={i >= MAXIMO_MOVIL ? 'max-md:hidden' : undefined}>
                      <figure>
                        <div className="relative aspect-4/3">
                          <FillImage
                            spec={foto.imagen}
                            alt={foto.alt}
                            sizes="(min-width: 1024px) 288px, (min-width: 768px) 33vw, 50vw"
                          />
                        </div>
                        <figcaption className="mt-3 font-serif text-note font-light">{foto.pie}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div aria-hidden className="rombos-separador opacity-80" />
        </div>
        <div className="mt-8 md:col-start-2 md:row-start-1 md:mt-0">
          <TextLink href={pathFor('galeria')}>{m.gallery}</TextLink>
        </div>
      </div>
    </PatternZone>
  )
}
