/**
 * Franjas laterales con el patrón geométrico (diseño de Figma): ~420 px desde la barra interna, desvanecidas al
 * final. Solo desde 1280 px (`xl`), donde el margen (≥ 64 px) es mayor que la franja (40 px): no le quita ancho al
 * contenido. Decorativas: `aria-hidden`, sin eventos, fuera de la impresión. Sin fondo propio: el único color es el
 * del patrón (máscara) y el resto es transparente, así que deja ver el de cada sección. Van sobre un contenedor
 * `relative`.
 */
export function SidePattern() {
  const base = 'pointer-events-none absolute top-0 z-30 hidden h-[26.5rem] w-10 xl:block print:hidden patron-fundido'
  return (
    <>
      <div aria-hidden className={`${base} left-0`}>
        <div className="patron-lateral h-full w-full" />
      </div>
      <div aria-hidden className={`${base} right-0 -scale-x-100`}>
        <div className="patron-lateral h-full w-full" />
      </div>
    </>
  )
}
