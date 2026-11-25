import type { eventos as esEventos } from '@/content/es/eventos'
import { common } from './common'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
// Los textos de interfaz en inglés son una propuesta pendiente de revisión.
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
    label: 'Agenda',
    title: 'Upcoming events',
    place: 'Location:',
    more: 'More information',
    moreAbout: 'More information about',
    range: { from: 'From', to: 'to' },
    empty: {
      title: 'We will announce the next gatherings soon.',
      text: 'In the meantime, write to us if you would like to take part, propose a gathering or receive news from ÉCOYAI.',
      cta: 'Write to us',
    },
    items: {},
  },
  memoria: {
    label: 'Memory',
    title: 'Past gatherings',
    gallery: 'See the Gallery',
    fotos: {},
  },
  llamado: {
    label: 'Take part',
    title: 'Join or support a gathering',
    text: '',
    collaborate: 'Collaborate',
    write: 'Write to us',
  },
} satisfies typeof esEventos
