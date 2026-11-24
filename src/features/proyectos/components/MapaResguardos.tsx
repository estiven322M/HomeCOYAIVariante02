import type { Mapa } from '@/features/proyectos/mapa'

/**
 * Mapa ilustrativo en SVG inline (sin escala). Es una imagen (`role="img"`) con su descripción accesible (`desc`): la
 * lista del desplegable ya da los nombres, así que el texto del dibujo queda fuera del árbol de accesibilidad.
 * Toda la geometría sale de `mapa` (datos); aquí solo se dibuja. En móvil el texto del dibujo se agranda (unidades del
 * `viewBox`) para que siga siendo legible al reducirse el mapa.
 */
export function MapaResguardos({
  mapa,
  rios,
  desc,
}: {
  mapa: Mapa
  /** Nombre de cada río por `id`. */
  rios: Record<string, string>
  desc: string
}) {
  return (
    <svg role="img" aria-label={desc} viewBox={mapa.viewBox} className="block h-auto w-full">
      {mapa.rios.map((r) => (
        <path key={r.id} d={r.d} fill="none" stroke="var(--color-chagra)" strokeWidth={r.ancho} strokeLinecap="round" />
      ))}
      {mapa.rios.map((r) => (
        <text
          key={r.id}
          x={r.rotulo.x}
          y={r.rotulo.y}
          transform={r.rotulo.rotate ? `rotate(${r.rotulo.rotate} ${r.rotulo.x} ${r.rotulo.y})` : undefined}
          textAnchor={r.rotulo.anchor}
          className="fill-huito font-serif text-[24px] italic sm:text-[14px]"
        >
          {rios[r.id] ?? r.id}
        </text>
      ))}
      <g className="fill-ocre stroke-huito" strokeWidth={1.5}>
        {mapa.resguardos.map((g) => (
          <path key={g.id} d={`M${g.x} ${g.y - 9} L${g.x + 9} ${g.y} L${g.x} ${g.y + 9} L${g.x - 9} ${g.y} Z`} />
        ))}
      </g>
      <g className="fill-huito font-sans text-[25px] sm:text-[13px]">
        {mapa.resguardos.map((g) => {
          const x = g.x + g.label.dx
          const y = g.y + g.label.dy
          const lines = g.label.lines ?? [g.name]
          return (
            <text key={g.id} x={x} y={y} textAnchor={g.label.anchor}>
              {lines.map((line, i) => (
                <tspan key={line} x={x} dy={i === 0 ? 0 : '1.2em'}>
                  {line}
                </tspan>
              ))}
            </text>
          )
        })}
      </g>
    </svg>
  )
}
