import type { meta as esMeta } from '@/content/es/meta'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
// Metadatos del documento por página: <title>, meta description y Open Graph.
// Las descripciones SALEN de textos que ya existen (mismas claves, sin copiarlos). La de Proyectos es la del primer
// proyecto de la lista (`content/*/proyectos.ts`).
import { common } from './common'
import { home } from './home'
import { proyectos } from './proyectos'
import { salud } from './salud'

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
      ...proyectos.items[0].meta,
    },
    salud: {
      title: 'Health and traditional medicine — ÉCOYAI',
      description: salud.hero.subtitle,
    },
    eventos: {
      title: 'Events — ÉCOYAI',
      description: navDesc(3),
    },
    galeria: {
      title: 'Gallery — ÉCOYAI',
      description: navDesc(4),
    },
    privacidad: {
      title: 'Privacy policy — ÉCOYAI',
      description: common.privacy.description,
    },
    gracias: {
      title: 'Thank you — ÉCOYAI',
      description: salud.solicitar.gracias.text,
    },
    colaborar: {
      title: 'Donations / Partnerships — ÉCOYAI',
      description: home.colaborar.text,
    },
    contacto: {
      title: 'Contact — ÉCOYAI',
      description: navDesc(6),
    },
  },
  notFound: { title: 'Page not found — ÉCOYAI' },
} satisfies typeof esMeta
