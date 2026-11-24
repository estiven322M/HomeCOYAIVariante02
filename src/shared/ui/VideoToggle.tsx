import type { CSSProperties } from 'react'
import type { BackgroundVideoState } from '@/shared/hooks/useBackgroundVideo'

export type VideoToggleLabels = { pause: string; play: string; pauseAria: string; playAria: string }

const ICON_PAUSE = 'M2.5 1.5H5.5V12.5H2.5Z M8.5 1.5H11.5V12.5H8.5Z'
const ICON_PLAY = 'M3 1.5 12 7 3 12.5Z'

/**
 * Botón visible para pausar o reproducir un video de fondo (WCAG 2.2.2). Solo existe en el cliente (sin JavaScript el
 * video no se carga) y desaparece si el video falla. El nombre accesible empieza por el texto visible (WCAG 2.5.3).
 * La posición se da con `className`; va sobre un fondo propio para leerse encima de cualquier fotograma.
 */
export function VideoToggle({
  video,
  labels,
  className = '',
  style,
}: {
  video: Pick<BackgroundVideoState, 'load' | 'playing' | 'failed' | 'toggle'>
  labels: VideoToggleLabels
  className?: string
  style?: CSSProperties
}) {
  if (video.load === null || video.failed) return null
  const { playing } = video
  return (
    <button
      type="button"
      onClick={video.toggle}
      aria-label={playing ? labels.pauseAria : labels.playAria}
      className={`video-toggle inline-flex min-h-11 cursor-pointer items-center gap-2.5 px-4 text-ui tracking-wider ${className}`}
      style={style}
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d={playing ? ICON_PAUSE : ICON_PLAY} />
      </svg>
      {playing ? labels.pause : labels.play}
    </button>
  )
}
