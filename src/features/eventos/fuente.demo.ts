// DATOS DE EJEMPLO para revisar el diseño. Solo entran en el build de demostración local (`EVENTOS_DEMO=1 pnpm build`);
// `pnpm verify:build` falla si un «[EJEMPLO]» llega al build publicado. No son eventos reales.
import type { Content, Lang } from '@/content'
import { useLang } from '@/shared/i18n'
import type { EventoPublicado } from './fuente'

export type { EventoPublicado }

const TEXTOS = {
  es: {
    nombre: '[EJEMPLO] Nombre del evento',
    lugar: '[EJEMPLO] Resguardo o municipio',
    descripcion: '[EJEMPLO] Descripción breve del evento en una o dos líneas: qué se hará y a quién está dirigido.',
    tipos: ['[EJEMPLO] Encuentro comunitario', '[EJEMPLO] Jornada de saberes', '[EJEMPLO] Celebración'],
    pasado: '[EJEMPLO] Evento pasado: no debe verse',
  },
  en: {
    nombre: '[EXAMPLE] Event name',
    lugar: '[EXAMPLE] Reservation or municipality',
    descripcion: '[EXAMPLE] Short description of the event in one or two lines: what will happen and who it is for.',
    tipos: ['[EXAMPLE] Community gathering', '[EXAMPLE] Knowledge day', '[EXAMPLE] Celebration'],
    pasado: '[EXAMPLE] Past event: must not show',
  },
} satisfies Record<Lang, unknown>

export function eventosDeEjemplo(lang: Lang): EventoPublicado[] {
  const t = TEXTOS[lang]
  const comun = { nombre: t.nombre, lugar: t.lugar, descripcion: t.descripcion }
  return [
    // Desordenados a propósito: la página los ordena por fecha.
    { id: 'ejemplo-2', fecha: '2027-04-02', ...comun, tipo: t.tipos[1] ?? '' },
    {
      id: 'ejemplo-1',
      fecha: '2027-03-14',
      ...comun,
      tipo: t.tipos[0] ?? '',
      // Para revisar la tarjeta con imagen.
      imagen: { available: true, base: '/nosotros/rio-putumayo', widths: [640, 1280], width: 1280, height: 960 },
      imageAlt: lang === 'es' ? '[EJEMPLO] Texto alternativo de la imagen' : '[EXAMPLE] Image alternative text',
    },
    { id: 'ejemplo-3', fecha: '2027-05-07', fechaFin: '2027-05-09', ...comun, tipo: t.tipos[2] ?? '' },
    { id: 'ejemplo-pasado', fecha: '2026-03-01', ...comun, nombre: t.pasado, tipo: t.tipos[0] ?? '' },
  ]
}

export function useEventos(): EventoPublicado[] {
  return eventosDeEjemplo(useLang().lang)
}

export function useIntroduccion(): Content['eventos']['intro'] {
  const { lang, t } = useLang()
  const marca = lang === 'es' ? '[EJEMPLO]' : '[EXAMPLE]'
  const parrafo =
    lang === 'es'
      ? 'Texto de introducción de ejemplo, para revisar la maquetación: qué tipo de eventos se realizan y con quién.'
      : 'Sample introduction text to review the layout: what kind of events take place and with whom.'
  return {
    ...t.eventos.intro,
    title: `${marca} ${lang === 'es' ? 'Título de la introducción' : 'Introduction title'}`,
    paragraphs: [`${marca} ${parrafo}`, `${marca} ${parrafo} `],
    quote: `${marca} ${lang === 'es' ? 'Frase destacada sobre el sentido de los encuentros.' : 'Pull quote about the meaning of the gatherings.'}`,
    quoteAuthor: '',
  }
}
