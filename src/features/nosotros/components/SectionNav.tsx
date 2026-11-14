import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/shared/lib/reduced-motion'

export type SectionNavItem = { id: string; label: string }

/**
 * Índice interno de la página: enlaces (`<a href="#id">`) a las secciones, que están todas visibles en la misma
 * página (por eso es una `<nav>` y no unas pestañas). Fija bajo el encabezado desde `md`; en móvil queda en el
 * flujo y se desplaza en horizontal. Marca la sección actual con `aria-current="location"`.
 *
 * Prerender: el render inicial no marca ninguna; la sección actual se decide en un efecto (solo cliente).
 */
export function SectionNav({ items, label }: { items: SectionNavItem[]; label: string }) {
  const [active, setActive] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return
    const visible = new Set<string>()
    // Franja de lectura: entre el 30 % y el 40 % de la altura de la ventana.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        const current = targets.find((t) => visible.has(t.id))
        if (current) setActive(current.id)
        else if ((targets[0]?.getBoundingClientRect().top ?? 0) > 0) setActive(null) // aún por encima de la primera
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [items])

  // En móvil la fila se desplaza: el enlace activo se centra.
  useEffect(() => {
    const list = listRef.current
    if (!active || !list || list.scrollWidth <= list.clientWidth) return
    const li = list.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (!li) return
    list.scrollTo({
      left: li.offsetLeft - (list.clientWidth - li.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [active])

  return (
    <nav aria-label={label} className="z-20 border-b border-huito/15 bg-arena md:sticky md:top-(--header-h)">
      <ul
        ref={listRef}
        className="mx-auto flex max-w-6xl snap-x gap-3 overflow-x-auto px-6 py-5 [mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-20px),transparent)] [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible md:py-2 md:[mask-image:none]"
      >
        {items.map((item, i) => (
          <li key={item.id} data-id={item.id} className="shrink-0 snap-center">
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              className="group inline-flex min-h-11 items-center gap-3 whitespace-nowrap border border-huito/25 px-5 text-ui tracking-wide text-huito transition-colors duration-500 hover:border-huito hover:bg-huito hover:text-arena-clara aria-[current=location]:border-huito aria-[current=location]:bg-huito aria-[current=location]:text-arena-clara"
            >
              <span className="font-serif text-ui text-achiote transition-colors duration-500 group-hover:text-ocre group-aria-[current=location]:text-ocre">
                {String(i + 1).padStart(2, '0')}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
