import { useLayoutEffect, useState } from 'react'
import { useLang } from '@/shared/i18n'
import { Diamond } from '@/shared/ui/Diamond'
import { Disclosure, PlusMinus } from '@/shared/ui/Disclosure'
import { SubTitle } from '@/shared/ui/SubTitle'
import { PRACTICE_IMAGES } from '@/features/salud/images'
import { SaludImage } from './SaludImage'

const number = (i: number) => String(i + 1).padStart(2, '0')

/**
 * ¿Qué vivimos en nuestros encuentros? Cuatro prácticas en acordeón: siempre una sola abierta (la 01 al cargar) y la
 * imagen con su pie corresponde a la práctica abierta. En escritorio la imagen está a un lado y cambia con un fundido
 * (sin transición con movimiento reducido); en móvil y sin JavaScript cada panel lleva su propia imagen.
 *
 * Sin JavaScript todas las prácticas salen abiertas con su texto: el HTML prerenderizado y el primer render del cliente
 * usan `'all'`; tras hidratar (antes de pintar) se pasa a una sola abierta.
 */
export function Practicas() {
  const e = useLang().t.salud.encuentros
  const [open, setOpen] = useState<number | 'all'>('all')
  // Decisión «solo de cliente tras hidratar»: el HTML estático muestra todo abierto.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => setOpen(0), [])
  const hydrated = open !== 'all'
  const current = open === 'all' ? 0 : open

  return (
    <section className="bg-huito px-6 py-28 text-arena-clara">
      <div className="mx-auto max-w-6xl">
        <SubTitle label={e.label} light />
        <h2 className="mt-8 font-serif text-title-sm font-light md:text-title">{e.title}</h2>
        <p className="mt-6 max-w-2xl text-body text-arena-clara/80">{e.intro}</p>
        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <ul>
            {e.items.map((item, i) => {
              const isOpen = open === 'all' || open === i
              return (
                <li key={item.title}>
                  <div aria-hidden className="rombos-separador" />
                  <Disclosure
                    id={`practica-${i + 1}`}
                    open={isOpen}
                    locked={open === i}
                    onToggle={() => setOpen(i)}
                    buttonClassName="py-5 text-arena-clara focus-visible:outline-ocre"
                    header={
                      <>
                        <span aria-hidden className="relative grid size-9 flex-none place-items-center">
                          <Diamond className="absolute inset-0 bg-ocre" />
                          <span className="relative text-caption text-huito">{number(i)}</span>
                        </span>
                        <span className="font-serif text-lead-sm font-light md:text-lead">{item.title}</span>
                      </>
                    }
                    indicator={
                      open === 'all' ? undefined : isOpen ? (
                        // La abierta no se puede cerrar: un rombo de estado (no un «−», que sugeriría una acción inexistente).
                        <span className="grid size-7 place-items-center">
                          <Diamond className="size-3 bg-ocre" />
                        </span>
                      ) : (
                        <PlusMinus open={false} />
                      )
                    }
                  >
                    <div className="pb-6 pl-[3.25rem]">
                      <p className="text-body text-arena-clara/80">{item.text}</p>
                      {/* Móvil y sin JavaScript: la imagen va en el panel. Con JS en escritorio, a un lado. */}
                      <figure
                        className={`relative mt-6 aspect-[4/5] w-full max-w-64 overflow-hidden bg-huito ${hydrated ? 'lg:hidden' : ''}`}
                      >
                        <SaludImage
                          id={PRACTICE_IMAGES[i] ?? 'practica1'}
                          tone="huito"
                          sizes="256px"
                          alt={e.imageAlts[i]}
                        />
                      </figure>
                    </div>
                  </Disclosure>
                </li>
              )
            })}
            <li aria-hidden>
              <div className="rombos-separador" />
            </li>
          </ul>
          {hydrated && (
            <figure className="hidden lg:block">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-huito">
                {e.items.map((item, i) => (
                  <div
                    key={item.title}
                    className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${i === current ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {/* Solo la imagen visible lleva texto alternativo; las otras (opacidad 0) son decorativas. */}
                    <SaludImage
                      id={PRACTICE_IMAGES[i] ?? 'practica1'}
                      tone="huito"
                      sizes="460px"
                      alt={i === current ? e.imageAlts[i] : ''}
                    />
                  </div>
                ))}
              </div>
              <figcaption className="mt-5 flex items-center gap-3 text-ui leading-snug text-ocre">
                <Diamond className="size-2.5 flex-none bg-ocre" />
                <span>
                  {number(current)} · {e.items[current]?.title}
                </span>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}
