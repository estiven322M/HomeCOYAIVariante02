/**
 * Geometría del mapa ilustrativo de los resguardos (sin escala: no son ubicaciones reales). Es dato, no código del
 * componente: añadir un resguardo es añadir UNA fila a `resguardos` (nombre, posición y de qué lado va su rótulo), y
 * aparece a la vez en el mapa y en la lista del desplegable. Un proyecto distinto añade su propio mapa por `slug`.
 *
 * Lo traducible (nombre de cada río por `id`, leyenda y descripción accesible) está en `content/{es,en}/proyectos.ts`.
 * Los nombres de los resguardos son nombres propios: no se traducen y por eso viven aquí.
 *
 * Coordenadas en unidades del `viewBox`. `x`, `y`: centro del rombo. `label`: dónde va el rótulo respecto al rombo
 * (`dx`, `dy` hasta la línea base del texto; `anchor` = alineación del texto; `lines` = rótulo en varias líneas).
 */
export type RioMapa = {
  id: string
  /** Trazado del río. */
  d: string
  ancho: number
  /** Rótulo del río (su texto sale de `content` por `id`). */
  rotulo: { x: number; y: number; rotate?: number; anchor?: 'start' | 'middle' | 'end' }
}

export type ResguardoMapa = {
  id: string
  name: string
  x: number
  y: number
  label: { dx: number; dy: number; anchor: 'start' | 'middle' | 'end'; lines?: string[] }
}

export type Mapa = { viewBox: string; rios: RioMapa[]; resguardos: ResguardoMapa[] }

const lenguaSiona: Mapa = {
  viewBox: '0 0 640 440',
  rios: [
    {
      id: 'putumayo',
      d: 'M10 110 C 120 120, 190 190, 290 215 S 470 280, 630 380',
      ancho: 7,
      rotulo: { x: 470, y: 352, rotate: 22 },
    },
    {
      id: 'pinuna',
      d: 'M300 20 C 322 90, 298 150, 366 240',
      ancho: 3.5,
      rotulo: { x: 288, y: 40, anchor: 'end' },
    },
    {
      id: 'cuehembi',
      d: 'M565 80 C 532 165, 566 245, 516 318',
      ancho: 3.5,
      rotulo: { x: 578, y: 72, anchor: 'end' },
    },
  ],
  resguardos: [
    { id: 'buenavista', name: 'Buenavista', x: 150, y: 143, label: { dx: 10, dy: 52, anchor: 'end' } },
    { id: 'pinuna-blanco', name: 'Piñuña Blanco', x: 318, y: 95, label: { dx: 18, dy: 5, anchor: 'start' } },
    {
      id: 'el-hacha',
      name: 'El Hacha',
      x: 440,
      y: 264,
      label: { dx: -12, dy: 40, anchor: 'end' },
    },
    {
      id: 'santa-cruz',
      name: 'Santa Cruz de Piñuña Blanco',
      x: 337,
      y: 185,
      label: { dx: 18, dy: 5, anchor: 'start', lines: ['Santa Cruz de', 'Piñuña Blanco'] },
    },
  ],
}

/** Mapa de cada proyecto, por `slug`. */
export const MAPAS: Record<string, Mapa> = { 'lengua-siona': lenguaSiona }
