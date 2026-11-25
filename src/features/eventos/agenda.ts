// Reglas de fechas de la agenda. Funciones puras: sirven igual en el build (prerender) y en el cliente.
import type { Lang } from '@/content'
import type { EventoAgenda } from '@/content/agenda'

const BOGOTA = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Bogota',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** La fecha de hoy en Colombia ('AAAA-MM-DD'), sea cual sea la zona horaria del visitante o del servidor de build. */
export const hoyEnBogota = (ahora: Date) => BOGOTA.format(ahora)

/** Un evento sigue siendo «próximo» hasta que termina su último día. Del más cercano al más lejano. */
export function proximos<T extends Pick<EventoAgenda, 'fecha' | 'fechaFin'>>(eventos: readonly T[], hoy: string): T[] {
  // Las fechas ISO se ordenan como texto.
  return eventos.filter((e) => (e.fechaFin ?? e.fecha) >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha))
}

// Nombres fijos (no `Intl`): el HTML del build y el del cliente deben ser idénticos en cualquier navegador.
const MESES = {
  es: 'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split(' '),
  en: 'January February March April May June July August September October November December'.split(' '),
} satisfies Record<Lang, string[]>

function partes(iso: string) {
  const [, anio, mes, dia] = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) ?? []
  if (!anio || !mes || !dia) throw new Error(`Fecha de evento no válida (AAAA-MM-DD): ${iso}`)
  return { anio, mes: Number(mes), dia }
}

/** Piezas de la insignia: «14», «mar» (las mayúsculas las pone el CSS) y «2027». */
export function insignia(iso: string, lang: Lang) {
  const { anio, mes, dia } = partes(iso)
  return { dia, mes: (MESES[lang][mes - 1] ?? '').slice(0, 3), anio }
}

/** Un trozo del texto de un intervalo; con `iso` es una fecha (va en su propio `<time>`). */
export type TrozoIntervalo = { texto: string; iso?: string }

/**
 * Intervalo compacto de un evento de varios días; no repite lo que comparten las dos fechas:
 * «Del 7 al 9 de mayo de 2027» · «Del 30 de abril al 2 de mayo de 2027» ·
 * «Del 28 de diciembre de 2026 al 3 de enero de 2027» · «May 7–9, 2027» · «April 30 – May 2, 2027» ·
 * «December 28, 2026 – January 3, 2027».
 */
export function intervalo(inicio: string, fin: string, lang: Lang): TrozoIntervalo[] {
  const a = partes(inicio)
  const b = partes(fin)
  const mesA = MESES[lang][a.mes - 1] ?? ''
  const mesB = MESES[lang][b.mes - 1] ?? ''
  const mismoAnio = a.anio === b.anio
  const mismoMes = mismoAnio && a.mes === b.mes
  const de = (iso: string, texto: string) => ({ iso, texto })

  if (lang === 'es') {
    const primero = mismoMes
      ? `${Number(a.dia)}`
      : mismoAnio
        ? `${Number(a.dia)} de ${mesA}`
        : fechaCompleta(inicio, lang)
    return [{ texto: 'Del ' }, de(inicio, primero), { texto: ' al ' }, de(fin, fechaCompleta(fin, lang))]
  }
  if (mismoMes) return [de(inicio, `${mesA} ${Number(a.dia)}`), { texto: '–' }, de(fin, `${Number(b.dia)}, ${b.anio}`)]
  const primero = mismoAnio ? `${mesA} ${Number(a.dia)}` : fechaCompleta(inicio, lang)
  return [de(inicio, primero), { texto: ' – ' }, de(fin, `${mesB} ${Number(b.dia)}, ${b.anio}`)]
}

/** «14 de marzo de 2027» · «March 14, 2027». */
export function fechaCompleta(iso: string, lang: Lang) {
  const { anio, mes, dia } = partes(iso)
  const nombre = MESES[lang][mes - 1] ?? ''
  return lang === 'es' ? `${Number(dia)} de ${nombre} de ${anio}` : `${nombre} ${Number(dia)}, ${anio}`
}
