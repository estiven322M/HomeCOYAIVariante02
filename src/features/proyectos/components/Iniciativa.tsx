import type { Proyecto } from '@/content/es/proyectos'
import { IMAGES } from '@/features/proyectos/images'
import { FillImage } from '@/shared/ui/FillImage'
import { SubTitle } from '@/shared/ui/SubTitle'
import { IconoFrente } from './iconos'

/**
 * «¿En qué consiste nuestra iniciativa?»: sección oscura (fuera de la zona del patrón). La entradilla es serif grande,
 * sin justificar, como la de Historia. Tres tarjetas (foto 4:3, icono decorativo, número, h3 y texto a la izquierda).
 */
export function Iniciativa({ data }: { data: Proyecto['iniciativa'] }) {
  return (
    <section className="bg-huito px-6 py-28 text-calido">
      <div className="mx-auto max-w-6xl">
        <SubTitle label={data.label} light />
        <h2 className="mt-8 font-serif text-title-sm font-light md:text-title">{data.title}</h2>
        <p className="mt-8 max-w-3xl font-serif text-lead font-light text-calido/85">{data.intro}</p>
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {data.frentes.map((f, i) => (
            <li key={f.title} className="flex flex-col border border-calido/10 bg-calido/5">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-huito">
                <FillImage
                  spec={IMAGES.frentes[i] ?? IMAGES.frentes[0]}
                  tone="huito"
                  sizes="(min-width: 1152px) 360px, (min-width: 768px) 30vw, calc(100vw - 48px)"
                  alt={f.imageAlt}
                />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between text-ocre">
                  <IconoFrente name={f.icon} />
                  <span aria-hidden className="font-serif text-ui text-calido/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-lead font-light">{f.title}</h3>
                <p className="mt-4 text-body-sm text-calido/80">{f.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
