// Contenido en español (fuente de verdad: define el tipo que debe cumplir el inglés).
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
  ogLocale: 'es_CO',
  pages: {
    home: {
      title: 'ÉCOYAI — Desde el territorio, hacia el futuro',
      description: home.hero.text,
    },
    nosotros: {
      title: 'Nosotros — ÉCOYAI',
      description: navDesc(0),
    },
    proyectos: {
      title: 'Proyectos — ÉCOYAI',
      description: cut(home.proyecto.text, ':'),
    },
    transparencia: {
      title: 'Transparencia y Gobernanza — ÉCOYAI',
      description: cut(transparencia.legal.text, ', vigencia'),
    },
    colaborar: {
      title: 'Donaciones / Alianzas — ÉCOYAI',
      description: home.colaborar.text,
    },
    contacto: {
      title: 'Contacto — ÉCOYAI',
      description: navDesc(4),
    },
  },
  notFound: { title: 'Página no encontrada — ÉCOYAI' },
}
