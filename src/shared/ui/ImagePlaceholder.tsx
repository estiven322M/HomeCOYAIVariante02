/**
 * Marcador de una imagen que aún no existe: un degradado de la paleta, sin texto visible y oculto a los lectores de
 * pantalla (las imágenes reales llevan su propio `alt`). Rellena a su contenedor (`absolute inset-0` por defecto).
 */
const TONES = {
  /** Selva oscura, para héroes y fondos con texto claro encima. */
  oscuro: 'radial-gradient(120% 90% at 25% 20%, var(--color-chagra) 0%, var(--color-noche) 70%)',
  /** Tono arena, para retratos sobre fondo claro. */
  claro: 'radial-gradient(120% 90% at 30% 20%, var(--color-arena-clara) 0%, var(--color-tierra-suave) 100%)',
  /** Azul huito, para imágenes sobre fondo oscuro. */
  huito: 'radial-gradient(120% 90% at 70% 15%, #4a5063 0%, var(--color-huito) 85%)',
}

export function ImagePlaceholder({
  tone = 'oscuro',
  className = 'absolute inset-0',
}: {
  tone?: keyof typeof TONES
  className?: string
}) {
  return <div aria-hidden className={className} style={{ background: TONES[tone] }} />
}
