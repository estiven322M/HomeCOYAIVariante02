/** Rombo decorativo (motivo del diseño). Se colorea y dimensiona con `className`; siempre `aria-hidden`. */
export function Diamond({ className = '' }: { className?: string }) {
  return <span aria-hidden className={`block [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] ${className}`} />
}
