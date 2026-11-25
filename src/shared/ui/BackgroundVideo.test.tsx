import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useBackgroundVideo } from '@/shared/hooks/useBackgroundVideo'
import { BackgroundVideo } from './BackgroundVideo'
import { VideoToggle } from './VideoToggle'

const SOURCES = [
  { src: '/v.webm', type: 'video/webm' },
  { src: '/v.mp4', type: 'video/mp4' },
]
const LABELS = { pause: 'Pausar', play: 'Reproducir', pauseAria: 'Pausar el video', playAria: 'Reproducir el video' }

function Demo({ onReady }: { onReady?: () => void }) {
  const video = useBackgroundVideo()
  return (
    <>
      <BackgroundVideo video={video} sources={SOURCES} poster="/p.jpg" onReady={onReady} />
      <VideoToggle video={video} labels={LABELS} />
    </>
  )
}

const videoEl = () => document.querySelector('video') as HTMLVideoElement
const sources = () => [...document.querySelectorAll('source')].map((s) => s.getAttribute('src'))
const button = () => screen.getByRole('button')

const reducedMotion = (on: boolean) =>
  vi
    .spyOn(window, 'matchMedia')
    .mockImplementation(
      (query) => ({ matches: on && query.includes('reduced-motion'), media: query }) as MediaQueryList,
    )
const connection = (value: object | undefined) =>
  Object.defineProperty(navigator, 'connection', { value, configurable: true })

// jsdom no reproduce: play y pause cambian `paused` y emiten sus eventos, como un navegador.
let paused = true
const play = vi.fn(function (this: HTMLMediaElement) {
  paused = false
  this.dispatchEvent(new Event('play'))
  return Promise.resolve()
})
const pause = vi.fn(function (this: HTMLMediaElement) {
  paused = true
  this.dispatchEvent(new Event('pause'))
})

beforeEach(() => {
  paused = true
  play.mockClear()
  pause.mockClear()
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play)
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pause)
  vi.spyOn(HTMLMediaElement.prototype, 'paused', 'get').mockImplementation(() => paused)
})
afterEach(() => {
  vi.restoreAllMocks()
  connection(undefined)
})

describe('BackgroundVideo y VideoToggle', () => {
  it('el HTML del servidor lleva solo el póster: sin fuentes, sin autoplay y sin botón', () => {
    const html = renderToString(<Demo />)
    expect(html).toContain('poster="/p.jpg"')
    expect(html).toContain('preload="none"')
    expect(html).not.toMatch(/<source|autoplay|<button/i)
  })

  it('con conexión normal carga las fuentes en orden, reproduce y ofrece «Pausar»', () => {
    render(<Demo />)
    expect(sources()).toEqual(['/v.webm', '/v.mp4'])
    expect(play).toHaveBeenCalledTimes(1)
    expect(button()).toHaveTextContent('Pausar')
    expect(button()).toHaveAccessibleName('Pausar el video')
    expect(videoEl()).toHaveAttribute('aria-hidden', 'true')
  })

  it('el botón pausa y vuelve a reproducir', async () => {
    render(<Demo />)
    await userEvent.click(button())
    expect(pause).toHaveBeenCalledTimes(1)
    expect(button()).toHaveAccessibleName('Reproducir el video')
    await userEvent.click(button())
    expect(play).toHaveBeenCalledTimes(2)
    expect(button()).toHaveTextContent('Pausar')
  })

  it.each([
    ['movimiento reducido', true, undefined],
    ['ahorro de datos', false, { saveData: true, effectiveType: '4g' }],
    ['conexión slow-2g', false, { effectiveType: 'slow-2g' }],
    ['conexión 2g', false, { effectiveType: '2g' }],
    ['conexión 3g', false, { effectiveType: '3g' }],
  ])('con %s no carga el video hasta que se pulsa «Reproducir»', async (_name, reduced, net) => {
    reducedMotion(reduced)
    connection(net)
    const onReady = vi.fn()
    render(<Demo onReady={onReady} />)
    expect(sources()).toEqual([])
    expect(play).not.toHaveBeenCalled()
    expect(onReady).toHaveBeenCalled() // no hay nada que esperar
    expect(button()).toHaveTextContent('Reproducir')
    await userEvent.click(button())
    expect(sources()).toHaveLength(2)
    expect(play).toHaveBeenCalledTimes(1)
    expect(button()).toHaveTextContent('Pausar')
  })

  it('si el navegador rechaza play(), el botón queda en «Reproducir»', async () => {
    play.mockImplementationOnce(() => Promise.reject(new Error('NotAllowedError')))
    await act(async () => {
      render(<Demo />)
    })
    expect(button()).toHaveTextContent('Reproducir')
  })

  it('el botón sigue al video: si el navegador lo pausa, ofrece «Reproducir»', () => {
    render(<Demo />)
    fireEvent.pause(videoEl())
    expect(button()).toHaveTextContent('Reproducir')
  })

  it('canplay avisa que está listo', () => {
    const onReady = vi.fn()
    render(<Demo onReady={onReady} />)
    expect(onReady).not.toHaveBeenCalled()
    fireEvent.canPlay(videoEl())
    expect(onReady).toHaveBeenCalledTimes(1)
  })

  it('si falla la última fuente, avisa y quita el botón (queda el póster)', () => {
    const onReady = vi.fn()
    render(<Demo onReady={onReady} />)
    const [first, last] = [...document.querySelectorAll('source')]
    fireEvent.error(first as Element)
    expect(button()).toBeInTheDocument()
    fireEvent.error(last as Element)
    expect(screen.queryByRole('button')).toBeNull()
    expect(onReady).toHaveBeenCalled()
  })
})
