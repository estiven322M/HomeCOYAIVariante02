import type { Content } from '@/content'
import { usePathFor } from '@/shared/i18n'
import { Button } from '@/shared/ui/Button'
import { SubTitle } from '@/shared/ui/SubTitle'
import { useLlamado } from '@/features/eventos/fuente'

/**
 * Llamado final sobre chagra: todos los textos en crema al 100 % (AA). La frase depende de la organización y, vacía, no
 * se muestra. `texts` permite probarla.
 */
export function Llamado({ texts }: { texts?: Content['eventos']['llamado'] }) {
  const pathFor = usePathFor()
  const publicados = useLlamado()
  const c = texts ?? publicados

  return (
    <section aria-labelledby="eventos-participa" className="sobre-chagra bg-chagra py-20 text-calido lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-16">
        <div>
          <SubTitle label={c.label} light="full" />
          <h2 id="eventos-participa" className="mt-6 font-serif text-title-sm font-light md:text-statement">
            {c.title}
          </h2>
          {c.text && <p className="mt-5 max-w-xl text-body">{c.text}</p>}
        </div>
        <div className="flex flex-col gap-3">
          <Button href={pathFor('colaborar')} spread>
            {c.collaborate}
          </Button>
          <Button href={pathFor('contacto')} variant="sobreChagra" spread>
            {c.write}
          </Button>
        </div>
      </div>
    </section>
  )
}
