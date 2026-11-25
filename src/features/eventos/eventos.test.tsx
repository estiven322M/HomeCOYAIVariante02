import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { EventosHero } from './components/EventosHero'
import { Introduccion } from './components/Introduccion'
import { HERO_MEDIA, MARCA_TIGRE } from './media'

const sources = () => [...document.querySelectorAll('video source')].map((s) => s.getAttribute('src'))

describe('Eventos · hero', () => {
  it('la textura de rombos es decorativa', () => {
    renderAt(<EventosHero />, '/eventos/')
    expect(document.querySelector('.eventos-textura')).toHaveAttribute('aria-hidden', 'true')
  })

  it('el tigre es decorativo, va detrás de los rombos y su interruptor no los toca', () => {
    expect(MARCA_TIGRE).toBe(true)
    const { unmount } = renderAt(<EventosHero />, '/eventos/')
    const tigre = document.querySelector('.eventos-tigre')
    expect(tigre).toHaveAttribute('aria-hidden', 'true')
    expect(tigre?.nextElementSibling).toHaveClass('eventos-textura')
    unmount()
    renderAt(<EventosHero tigre={false} />, '/eventos/')
    expect(document.querySelector('.eventos-tigre')).toBeNull()
    expect(document.querySelector('.eventos-textura')).not.toBeNull()
  })

  it('el video está activado por defecto', () => {
    expect(HERO_MEDIA.video).toBe(true)
  })

  it.each([
    ['es', '/eventos/'],
    ['en', '/en/events/'],
  ] as const)('h1, rótulo, bajada y video con su botón (%s)', (lang, path) => {
    renderAt(<EventosHero />, path)
    const h = dict[lang].eventos.hero
    expect(screen.getByRole('heading', { level: 1, name: h.title })).toBeInTheDocument()
    expect(screen.getByText(h.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(dict[lang].common.nav[3]?.desc ?? '')).toBeInTheDocument()
    expect(sources()).toEqual(['/video/eventos-hero.webm', '/video/eventos-hero.mp4'])
    expect(document.querySelector('video')).toHaveAttribute('poster', '/video/eventos-poster.jpg')
    // jsdom no reproduce (no emite «play»): el botón queda en «Reproducir». Sus estados se prueban en BackgroundVideo.
    expect(screen.getByRole('button', { name: dict[lang].common.video.playAria })).toBeInTheDocument()
  })

  it('con el video apagado muestra solo el póster, sin video ni botón', () => {
    renderAt(<EventosHero media={{ ...HERO_MEDIA, video: false }} />, '/eventos/')
    expect(document.querySelector('video')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
    expect(document.querySelector('img')).toHaveAttribute('src', HERO_MEDIA.posterSrc)
    expect(document.querySelector('img')).toHaveAttribute('alt', '')
  })

  it('con video y póster apagados no usa ningún archivo del video', () => {
    renderAt(<EventosHero media={{ ...HERO_MEDIA, video: false, poster: false }} />, '/eventos/')
    expect(document.querySelector('video, img')).toBeNull()
    expect(document.body.innerHTML).not.toContain('/video/')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('Eventos · introducción', () => {
  const base = dict.es.eventos.intro
  const prueba = {
    ...base,
    title: '[EJEMPLO] Título',
    paragraphs: ['[EJEMPLO] Primer párrafo.', '[EJEMPLO] Segundo párrafo.'],
  }

  it.each(['es', 'en'] as const)('sin textos aprobados no se muestra (%s)', (lang) => {
    const { container } = renderAt(<Introduccion />, lang === 'es' ? '/eventos/' : '/en/events/')
    expect(container).toBeEmptyDOMElement()
  })

  it('con textos muestra título y párrafos; sin cita no hay columna de cita', () => {
    renderAt(<Introduccion texts={prueba} />, '/eventos/')
    expect(screen.getByRole('heading', { level: 2, name: prueba.title })).toBeInTheDocument()
    expect(screen.getByText(base.label)).toBeInTheDocument()
    expect(document.querySelectorAll('p.justificado')).toHaveLength(2)
    expect(document.querySelector('blockquote')).toBeNull()
  })

  it('con cita la muestra con su autoría', () => {
    renderAt(<Introduccion texts={{ ...prueba, quote: '[EJEMPLO] Cita.', quoteAuthor: '[EJEMPLO] Autoría' }} />)
    expect(document.querySelector('blockquote')).toHaveTextContent('[EJEMPLO] Cita.')
    expect(document.querySelector('figcaption')).toHaveTextContent('[EJEMPLO] Autoría')
  })
})
