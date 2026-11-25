import { describe, expect, it } from 'vitest'
import { EVENTOS } from '@/content/agenda'
import { fechaCompleta, hoyEnBogota, insignia, intervalo, proximos } from './agenda'

describe('agenda: hoy en Bogotá (UTC−5)', () => {
  it.each([
    ['2027-03-15T04:59:59Z', '2027-03-14'],
    ['2027-03-15T05:00:00Z', '2027-03-15'],
    ['2027-01-01T02:00:00Z', '2026-12-31'],
  ])('a las %s es %s', (instante, dia) => {
    expect(hoyEnBogota(new Date(instante))).toBe(dia)
  })
})

describe('agenda: próximos eventos', () => {
  const lista = [
    { id: 'abril', fecha: '2027-04-02' },
    { id: 'ayer', fecha: '2027-03-13' },
    { id: 'hoy', fecha: '2027-03-14' },
    { id: 'en-curso', fecha: '2027-03-12', fechaFin: '2027-03-15' },
    { id: 'terminado', fecha: '2027-03-10', fechaFin: '2027-03-13' },
    { id: 'otro-anio', fecha: '2028-01-05' },
  ]

  it('incluye hoy y los de varios días sin terminar, ordenados por su primer día', () => {
    expect(proximos(lista, '2027-03-14').map((e) => e.id)).toEqual(['en-curso', 'hoy', 'abril', 'otro-anio'])
  })

  it('no modifica la lista original', () => {
    const copia = [...lista]
    proximos(lista, '2027-03-14')
    expect(lista).toEqual(copia)
  })

  it('las fechas publicadas son válidas y no terminan antes de empezar', () => {
    for (const e of EVENTOS as readonly { fecha: string; fechaFin?: string }[]) {
      expect(() => fechaCompleta(e.fecha, 'es')).not.toThrow()
      if (e.fechaFin) expect(e.fechaFin >= e.fecha).toBe(true)
    }
  })
})

describe('agenda: formato', () => {
  it('insignia con año', () => {
    expect(insignia('2027-03-14', 'es')).toEqual({ dia: '14', mes: 'mar', anio: '2027' })
    expect(insignia('2027-04-02', 'en')).toEqual({ dia: '02', mes: 'Apr', anio: '2027' })
    expect(insignia('2027-01-09', 'es').mes).toBe('ene')
  })

  it('fecha completa en cada idioma', () => {
    expect(fechaCompleta('2027-04-02', 'es')).toBe('2 de abril de 2027')
    expect(fechaCompleta('2027-04-02', 'en')).toBe('April 2, 2027')
  })

  it.each([
    ['mismo mes', '2027-05-07', '2027-05-09', 'Del 7 al 9 de mayo de 2027', 'May 7–9, 2027'],
    ['distinto mes', '2027-04-30', '2027-05-02', 'Del 30 de abril al 2 de mayo de 2027', 'April 30 – May 2, 2027'],
    [
      'distinto año',
      '2026-12-28',
      '2027-01-03',
      'Del 28 de diciembre de 2026 al 3 de enero de 2027',
      'December 28, 2026 – January 3, 2027',
    ],
  ])('intervalo compacto: %s', (_caso, inicio, fin, es, en) => {
    for (const [lang, esperado] of [
      ['es', es],
      ['en', en],
    ] as const) {
      const trozos = intervalo(inicio, fin, lang)
      expect(trozos.map((t) => t.texto).join('')).toBe(esperado)
      // Cada extremo es una fecha con su ISO completo, aunque el texto no repita el mes o el año.
      expect(trozos.flatMap((t) => t.iso ?? [])).toEqual([inicio, fin])
    }
  })

  it('rechaza una fecha sin año', () => {
    expect(() => insignia('03-14', 'es')).toThrow(/AAAA-MM-DD/)
  })
})
