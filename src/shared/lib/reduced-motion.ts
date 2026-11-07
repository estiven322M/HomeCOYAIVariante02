/** ¿Pidió el visitante movimiento reducido? Solo en el cliente (efectos o manejadores), nunca durante el render. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
