import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { dict } from '@/content'
import { DocumentHead } from './DocumentHead'

const q = (selector: string) => document.head.querySelector(selector)

describe('DocumentHead', () => {
  it('en «/» pone título, descripción, canonical y hreflang en español', () => {
    render(<DocumentHead pathname="/" />)
    expect(document.title).toBe(dict.es.meta.pages.home.title)
    expect(q('meta[name="description"]')).toHaveAttribute('content', dict.es.meta.pages.home.description)
    expect(q('link[rel="canonical"]')).toHaveAttribute('href', '/')
    expect(q('link[hreflang="es"]')).toHaveAttribute('href', '/')
    expect(q('link[hreflang="en"]')).toHaveAttribute('href', '/en/')
    expect(q('link[hreflang="x-default"]')).toHaveAttribute('href', '/')
    expect(q('meta[property="og:locale"]')).toHaveAttribute('content', 'es_CO')
  })

  it('en «/en/» usa los textos en inglés y su propia URL canónica', () => {
    render(<DocumentHead pathname="/en/" />)
    expect(document.title).toBe(dict.en.meta.pages.home.title)
    expect(q('meta[name="description"]')).toHaveAttribute('content', dict.en.meta.pages.home.description)
    expect(q('link[rel="canonical"]')).toHaveAttribute('href', '/en/')
    expect(q('link[hreflang="x-default"]')).toHaveAttribute('href', '/')
    expect(q('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US')
  })

  it('con el sitio no indexable (por defecto) añade noindex', () => {
    render(<DocumentHead pathname="/" />)
    expect(q('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  })

  it('en una URL desconocida no inventa canonical ni hreflang', () => {
    render(<DocumentHead pathname="/no-existe/" />)
    expect(q('link[rel="canonical"]')).toBeNull()
    expect(q('link[hreflang]')).toBeNull()
  })
})
