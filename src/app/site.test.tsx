// Pruebas de todo el sitio: cada página en cada idioma y TODOS sus enlaces internos.
import { screen } from '@testing-library/react'
import type { ComponentType } from 'react'
import { describe, expect, it } from 'vitest'
import { renderAt } from '@test/render'
import { dict } from '@/content'
import { ColaborarPage } from '@/pages/ColaborarPage'
import { ContactoPage } from '@/pages/ContactoPage'
import { HomePage } from '@/pages/HomePage'
import { NosotrosPage } from '@/pages/NosotrosPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProyectosPage } from '@/pages/ProyectosPage'
import { TransparenciaPage } from '@/pages/TransparenciaPage'
import { LANGS, NOT_FOUND, ROUTES, pathFor, type RouteKey } from '@/shared/i18n/routes'
import { IntroProvider } from '@/shared/intro/intro-context'
import { RootLayout } from './layout/RootLayout'

const PAGES: Record<RouteKey, ComponentType> = {
  home: HomePage,
  nosotros: NosotrosPage,
  proyectos: ProyectosPage,
  transparencia: TransparenciaPage,
  colaborar: ColaborarPage,
  contacto: ContactoPage,
}

/** Texto que debe contener el h1 de cada página. */
const h1Of = (key: RouteKey, lang: 'es' | 'en') => {
  const t = dict[lang]
  return {
    home: t.home.hero.title,
    nosotros: t.common.nav[0]?.label,
    proyectos: t.home.proyecto.title,
    transparencia: t.common.nav[2]?.label,
    colaborar: t.home.colaborar.title,
    contacto: t.common.nav[4]?.label,
  }[key]
}

type Case = { name: string; path: string; Page: ComponentType; h1: string }
const cases: Case[] = [
  ...(Object.keys(ROUTES) as RouteKey[]).flatMap((key) =>
    LANGS.map((lang) => ({
      name: `${key} · ${lang}`,
      path: pathFor(key, lang),
      Page: PAGES[key],
      h1: h1Of(key, lang) ?? '',
    })),
  ),
  ...LANGS.map((lang) => ({
    name: `404 · ${lang}`,
    path: NOT_FOUND[lang],
    Page: NotFoundPage,
    h1: dict[lang].common.notFound.title,
  })),
  // Una URL desconocida cualquiera también es la 404.
  { name: 'URL desconocida · es', path: '/no-existe/', Page: NotFoundPage, h1: dict.es.common.notFound.title },
  { name: 'URL desconocida · en', path: '/en/no-existe/', Page: NotFoundPage, h1: dict.en.common.notFound.title },
]

function renderPage({ path, Page }: Case) {
  return renderAt(
    <IntroProvider>
      <RootLayout>
        <Page />
      </RootLayout>
    </IntroProvider>,
    path,
  )
}

const normalize = (p: string) => (p.endsWith('/') ? p : `${p}/`)

describe('prueba de humo por página e idioma', () => {
  it.each(cases)('$name: un solo h1, un <main id="contenido"> y un pie', (c) => {
    renderPage(c)
    const h1 = screen.getAllByRole('heading', { level: 1 })
    expect(h1).toHaveLength(1)
    expect(h1[0]).toHaveTextContent(c.h1)
    const mains = document.querySelectorAll('main')
    expect(mains).toHaveLength(1)
    expect(mains[0]).toHaveAttribute('id', 'contenido')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})

describe('enlaces internos', () => {
  type Link = { href: string; inMain: boolean }
  // Se renderiza cada página una vez y se recogen sus id y sus enlaces.
  const idsByPath = new Map<string, Set<string>>()
  const linksByCase = new Map<string, Link[]>()

  const collect = () => {
    if (linksByCase.size > 0) return
    for (const c of cases) {
      const { unmount } = renderPage(c)
      idsByPath.set(normalize(c.path), new Set([...document.querySelectorAll('[id]')].map((e) => e.id)))
      linksByCase.set(
        c.name,
        [...document.querySelectorAll('a[href]')].map((a) => ({
          href: a.getAttribute('href') ?? '',
          inMain: a.closest('main') !== null,
        })),
      )
      unmount()
    }
  }

  it('todo enlace interno apunta a una ruta de la tabla (o a la 404) y a un ancla que existe', () => {
    collect()
    const problems: string[] = []
    let checked = 0
    for (const c of cases) {
      for (const { href } of linksByCase.get(c.name) ?? []) {
        if (/^(https?:|mailto:|tel:)/.test(href)) continue
        checked++
        const [rawPath = '', hash = ''] = href.split('#')
        const target = rawPath === '' ? normalize(c.path) : normalize(rawPath)
        if (!idsByPath.has(target)) {
          problems.push(`${c.name}: «${href}» no está en la tabla de rutas`)
          continue
        }
        if (hash && !idsByPath.get(target)?.has(hash))
          problems.push(`${c.name}: «${href}» apunta a un ancla inexistente`)
      }
    }
    expect(checked).toBeGreaterThan(100)
    expect(problems).toEqual([])
  })

  it('ninguna página enlaza a sí misma desde su contenido (salvo anclas internas)', () => {
    collect()
    const problems: string[] = []
    for (const c of cases) {
      for (const { href, inMain } of linksByCase.get(c.name) ?? []) {
        if (!inMain || href.includes('#')) continue
        if (normalize(href) === normalize(c.path)) problems.push(`${c.name}: enlaza a sí misma («${href}»)`)
      }
    }
    expect(problems).toEqual([])
  })

  it('el pie y el menú enlazan a todas las páginas principales', () => {
    collect()
    for (const lang of LANGS) {
      const hrefs = (linksByCase.get(`home · ${lang}`) ?? []).map((l) => l.href)
      for (const key of ['nosotros', 'proyectos', 'transparencia', 'colaborar', 'contacto'] as const) {
        expect(hrefs, `${key} · ${lang}`).toContain(pathFor(key, lang))
      }
    }
  })
})
