// Contenido en español (fuente de verdad: define el tipo que debe cumplir el inglés).
// Página «Eventos» (/eventos/). Los textos de interfaz están aprobados. Lo que depende de la organización (introducción,
// cita y frase del llamado) queda VACÍO hasta tenerlo: el bloque correspondiente no se muestra. No inventar textos.
import type { EventoId, FotoMemoriaId } from '@/content/agenda'
import { common } from './common'

export type TextoEvento = { nombre: string; lugar: string; tipo: string; descripcion: string; imageAlt?: string }
export type TextoFoto = { pie: string; alt: string }

export const eventos = {
  hero: {
    eyebrow: 'Encuentros y celebraciones',
    title: 'Eventos',
    /** Por ahora, la descripción de la entrada del menú. */
    subtitle: common.nav[3]?.desc ?? '',
  },
  /** Pendiente de la organización. Sin título ni párrafos, la sección no se muestra. */
  intro: {
    label: 'Nuestros encuentros',
    title: '',
    paragraphs: [] as string[],
    quote: '',
    quoteAuthor: '',
  },
  agenda: {
    label: 'Agenda',
    title: 'Próximos eventos',
    place: 'Lugar:',
    more: 'Más información',
    /** Nombre accesible del enlace: «{moreAbout} {nombre}». Empieza por el texto visible. */
    moreAbout: 'Más información sobre',
    /** Fecha completa (solo lectores de pantalla) de un evento de varios días: «{from} … {to} …». */
    range: { from: 'Del', to: 'al' },
    empty: {
      title: 'Pronto anunciaremos los próximos encuentros.',
      text: 'Mientras tanto, escríbenos si quieres participar, proponer un encuentro o recibir noticias de ÉCOYAI.',
      cta: 'Escríbenos',
    },
    items: {} satisfies Record<EventoId, TextoEvento>,
  },
  memoria: {
    label: 'Memoria',
    title: 'Encuentros anteriores',
    gallery: 'Ver la Galería',
    fotos: {} satisfies Record<FotoMemoriaId, TextoFoto>,
  },
  llamado: {
    label: 'Participa',
    title: 'Acompaña o apoya un encuentro',
    /** Pendiente de la organización. */
    text: '',
    collaborate: 'Colaborar',
    write: 'Escríbenos',
  },
}
