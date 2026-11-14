import { useLang } from '@/shared/i18n'
import { Diamond } from '@/shared/ui/Diamond'
import { SubTitle } from '@/shared/ui/SubTitle'

/** 03 · Valores: siete valores numerados y una imagen que completa la última celda de la rejilla (4 → 2 → 1 columnas). */
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
          {v.items.map((item, i) => (
            <li key={item.k} className="flex flex-col bg-arena-clara p-8 min-[520px]:min-h-[18.75rem]">
              <div className="flex items-center gap-3">
                <Diamond className="size-2.5 bg-ocre" />
                <span className="font-serif text-ui text-achiote">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-4 font-serif text-heading text-chagra min-[520px]:mt-10">{item.k}</h3>
              <p className="mt-4 text-body-sm text-huito/80">{item.t}</p>
            </li>
          ))}
          <li className="relative aspect-[4/3] bg-huito min-[520px]:aspect-auto min-[520px]:min-h-[18.75rem]">
            <img
              src="/nosotros/valores-480.webp"
              srcSet="/nosotros/valores-480.webp 480w, /nosotros/valores-960.webp 960w"
              sizes="(min-width: 1024px) 270px, (min-width: 520px) 50vw, 100vw"
              width={480}
              height={640}
              alt={v.imageAlt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </li>
        </ul>
      </div>
    </section>
  )
}
