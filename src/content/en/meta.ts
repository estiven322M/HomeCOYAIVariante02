import type { meta as esMeta } from '@/content/es/meta'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
// Metadatos del documento por página: <title>, meta description y Open Graph.
// Las descripciones SALEN de textos que ya existen (mismas claves, sin copiarlos). La que se recorta
// (Proyectos, para no pasar de 160 caracteres) lo hace con `cut`: es un prefijo literal.
import { common } from './common'
import { home } from './home'

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
    salud: {
      title: 'Health and traditional medicine — ÉCOYAI',
      description: navDesc(2),
    },
    eventos: {
      title: 'Events — ÉCOYAI',
      description: navDesc(3),
    },
    colaborar: {
      title: 'Donations / Partnerships — ÉCOYAI',
      description: home.colaborar.text,
    },
    contacto: {
      title: 'Contact — ÉCOYAI',
      description: navDesc(5),
    },
  },
  notFound: { title: 'Page not found — ÉCOYAI' },
} satisfies typeof esMeta
