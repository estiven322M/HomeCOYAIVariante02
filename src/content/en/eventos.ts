import type { eventos as esEventos } from '@/content/es/eventos'
import { common } from './common'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
export const eventos = {
  hero: {
    eyebrow: 'Gatherings and celebrations',
    title: 'Events',
    subtitle: common.nav[3]?.desc ?? '',
  },
  intro: {
    label: 'Our gatherings',
    title: '',
    paragraphs: [],
    quote: '',
    quoteAuthor: '',
  },
  agenda: {
    label: 'Calendar',
    title: 'Upcoming events',
    place: 'Location:',
    more: 'More information',
    moreAbout: 'More information about',
    empty: {
      title: 'We’ll announce our next gatherings soon.',
      text: 'In the meantime, write to us if you would like to take part, propose a gathering or receive news from ÉCOYAI.',
      cta: 'Write to us',
    },
    items: {},
  },
  memoria: {
    label: 'Memories',
    title: 'Past gatherings',
    gallery: 'View the gallery',
    fotos: {},
  },
  llamado: {
    label: 'Take part',
    title: 'Join or support a gathering',
    text: '',
    // La etiqueta de esa página en el menú, el pie y su título.
    collaborate: common.nav[5]?.label ?? '',
    write: 'Write to us',
  },
} satisfies typeof esEventos
