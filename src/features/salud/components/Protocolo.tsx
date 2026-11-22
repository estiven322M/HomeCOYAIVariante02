import { useLayoutEffect, useState } from 'react'
import { useLang } from '@/shared/i18n'
import { Diamond } from '@/shared/ui/Diamond'
import { Disclosure, PlusMinus } from '@/shared/ui/Disclosure'

/**
 * Protocolo de preparación y salud: acordeón que se puede abrir y cerrar. Sin JavaScript sale abierto (es información de
 * salud: debe verse siempre); tras hidratar (antes de pintar) queda cerrado.
 */
export function Protocolo() {
  const p = useLang().t.salud.protocolo
  const [open, setOpen] = useState(true)
  // Decisión «solo de cliente tras hidratar»: el HTML estático muestra el protocolo abierto.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => setOpen(false), [])
  return (
    <section aria-labelledby="protocolo-btn" className="bg-arena px-6 pt-0 pb-28">
      <div className="mx-auto max-w-6xl border border-huito/20 bg-arena-clara">
        <Disclosure
          id="protocolo"
          level={2}
          open={open}
          onToggle={() => setOpen((o) => !o)}
          buttonClassName="px-6 py-4 text-huito"
          header={
            <>
              <Diamond className="size-4 flex-none bg-achiote" />
              <span className="font-serif text-lead-sm font-light">{p.title}</span>
            </>
          }
          indicator={
            <span className="flex items-center gap-3 text-ui text-huito/80">
              <span className="hidden sm:inline">{open ? p.hide : p.show}</span>
              <PlusMinus open={open} />
            </span>
          }
        >
          <ul className="space-y-3 border-t border-huito/15 px-6 py-6">
            {p.points.map((point) => (
              <li key={point} className="flex gap-3 text-body text-huito/80">
                <Diamond className="mt-2.5 size-2 flex-none bg-ocre" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Disclosure>
      </div>
    </section>
  )
}
