/** Recorte en rombo; también para imágenes (`<img className={DIAMOND_CLIP}>`). */
export const DIAMOND_CLIP = '[clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]'

/** Rombo decorativo (motivo del diseño). Se colorea y dimensiona con `className`; siempre `aria-hidden`. */
export function Diamond({ className = '' }: { className?: string }) {
  return <span aria-hidden className={`block ${DIAMOND_CLIP} ${className}`} />
}
