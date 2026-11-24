import type { Proyecto } from '@/content/es/proyectos'
import { Diamond } from '@/shared/ui/Diamond'

/**
 * Línea de estado del hero (sobre la foto: texto claro). No se dibuja nada si `estado.visible` es `false`: un solo
 * interruptor en el contenido la oculta entera mientras los estados no estén confirmados.
 */
export function EstadoProyecto({ estado }: { estado: Proyecto['hero']['estado'] }) {
  if (!estado.visible) return null
  return (
    <div className="hero-text mt-8 max-w-[42rem] border-t border-calido/25 pt-5">
      <p className="text-caption uppercase tracking-[0.3em]">{estado.label}</p>
      <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-ui">
        {estado.items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <Diamond className="size-2 flex-none bg-ocre" />
            <span>
              {item.label}: <strong className="font-medium">{item.value}</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
