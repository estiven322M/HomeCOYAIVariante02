import { useLang } from '@/shared/i18n'
import { SubTitle } from '@/shared/ui/SubTitle'

/**
 * 03 · Valores: siete tarjetas, sin numeración. La rejilla es de 1 → 2 → 4 columnas y la última tarjeta ocupa dos
 * (desde 520 px): con 7 no queda ninguna celda vacía ni con 2 columnas (4.ª fila) ni con 4 (2.ª fila: 1 + 1 + 2).
 */
export function Valores() {
  const { t } = useLang()
  const v = t.nosotros.valores
  return (
    <section id="valores" className="anchor-section bg-arena py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SubTitle n="03" label={v.label} />
        <h2 className="mt-8 font-serif text-title-sm font-light text-huito md:text-title">{v.title}</h2>
        {/* `gap-px` sobre un fondo tenue dibuja los filetes entre celdas. */}
        <ul className="mt-14 grid gap-px bg-huito/20 p-px min-[520px]:grid-cols-2 lg:grid-cols-4">
          {v.items.map((item) => (
            <li
              key={item.k}
              className="bg-arena-clara p-8 pt-9 min-[520px]:min-h-[13.5rem] lg:p-6 lg:pt-8 xl:p-8 xl:pt-9 min-[520px]:last:col-span-2"
            >
              <h3 className="font-serif text-heading text-chagra">{item.k}</h3>
              <p className="mt-4 text-body-sm text-huito/80">{item.t}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
