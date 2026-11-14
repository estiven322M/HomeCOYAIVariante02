export type PatternVariant = 'zona' | 'fundido'

/**
 * Franjas laterales con el patrón geométrico (diseño de Figma), en los márgenes del contenido claro. Solo desde
 * 1280 px (`xl`), donde el margen (≥ 64 px) es mayor que la franja (40 px): no le quita ancho al contenido.
 * Decorativas: `aria-hidden`, sin eventos, fuera de la impresión. Van sobre un contenedor `relative`.
 *
 * - `zona`: acompañan toda la zona clara (el contenedor), hasta que empieza el bloque oscuro.
 * - `fundido`: ~420 px desde la barra interna (como en Figma), desvanecidos al final.
 */
export function SidePattern({ variant }: { variant: PatternVariant }) {
  const size = variant === 'fundido' ? 'h-[26.5rem] patron-fundido' : 'h-full'
  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 z-30 hidden w-10 xl:block print:hidden ${size}`}
      >
        <div className="patron-lateral h-full w-full" />
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute right-0 top-0 z-30 hidden w-10 -scale-x-100 xl:block print:hidden ${size}`}
      >
        <div className="patron-lateral h-full w-full" />
      </div>
    </>
  )
}
