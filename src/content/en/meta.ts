import type { meta as esMeta } from '@/content/es/meta'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
// Metadatos del documento por página: <title>, meta description y Open Graph.
// Las descripciones SALEN de textos que ya existen (mismas claves, sin copiarlos). Las dos que se recortan
// (Proyectos y Transparencia, para no pasar de 160 caracteres) lo hacen con `cut`: son un prefijo literal.
import { common } from './common'
import { home } from './home'
import { transparencia } from './transparencia'

/** Corta `text` antes de `marker` y cierra con punto. */
const cut = (text: string, marker: string) => `${text.split(marker)[0]}.`
const navDesc = (i: number) => common.nav[i]?.desc ?? ''

export const meta = {
  siteName: 'ÉCOYAI',
  ogLocale: 'en_US',
  pages: {
    home: {
      title: 'ÉCOYAI — From the territory, toward the future',
      description: home.hero.text,
    },
    nosotros: {
      title: 'About us — ÉCOYAI',
      description: navDesc(0),
    },
    proyectos: {
      title: 'Projects — ÉCOYAI',
      description: cut(home.proyecto.text, ':'),
    },
    transparencia: {
      title: 'Transparency and Governance — ÉCOYAI',
      description: cut(transparencia.legal.text, ', official'),
    },
    colaborar: {
      title: 'Donations / Partnerships — ÉCOYAI',
      description: home.colaborar.text,
    },
    contacto: {
      title: 'Contact — ÉCOYAI',
      description: navDesc(4),
    },
  },
  notFound: { title: 'Page not found — ÉCOYAI' },
} satisfies typeof esMeta
