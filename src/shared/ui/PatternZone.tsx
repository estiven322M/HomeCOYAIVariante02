import type { ReactNode } from 'react'

/**
 * Zona clara con el patrón geométrico lateral (diseño de Figma). Envuelve una sección clara, o varias **consecutivas**
 * (aunque tengan fondos distintos: las franjas son una sola pieza y no tienen fondo propio), y dibuja en los dos
 * márgenes una franja de 40 px que llega hasta el final de la zona, con el degradado del borde hacia dentro.
 *
 * Reglas:
 * - Solo sobre fondos claros (arena, arena-clara, cálido, crema). Nunca sobre huito, noche, chagra, fotos, el hero ni el
 *   degradado de transición del hero de Inicio: una sección oscura queda **fuera** de la zona (dos zonas separadas).
 * - Solo desde 1280 px (`xl`), donde el margen (≥ 64 px) es mayor que la franja: no quita ancho al contenido, que va en
 *   un contenedor de hasta `max-w-6xl`. `aria-hidden`, sin eventos de puntero y oculto al imprimir.
 * - Por debajo de la barra interna fija de Nosotros (`z-20`) y del encabezado (`z-50`), y por encima de los fondos.
 *
 * Uso: `<PatternZone>…secciones claras…</PatternZone>`, o `<PatternZone as="section" id="x" className="bg-crema py-28">`
 * para que la propia sección sea la zona. Estilos y color: `.patron-lateral` y `--color-patron` en `shared/styles/index.css`.
 */
export function PatternZone({
  as: Tag = 'div',
  className = '',
  id,
  children,
}: {
  as?: 'div' | 'section'
  className?: string
  id?: string
  children: ReactNode
}) {
  const strip = 'pointer-events-none absolute inset-y-0 z-10 hidden w-10 xl:block print:hidden'
  return (
    <Tag id={id} className={`relative ${className}`}>
      <div aria-hidden className={`${strip} left-0`}>
        <div className="patron-lateral size-full" />
      </div>
      {/* El de la derecha es el mismo azulejo espejado. */}
      <div aria-hidden className={`${strip} right-0 -scale-x-100`}>
        <div className="patron-lateral size-full" />
      </div>
      {children}
    </Tag>
  )
}
