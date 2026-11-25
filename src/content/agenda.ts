// Agenda y memoria de Eventos: los datos que NO dependen del idioma (fechas, imágenes, enlaces), una sola vez para que
// español e inglés no se desincronicen. Los textos de cada `id` van en content/{es,en}/eventos.ts; el typecheck exige
// que estén en los dos. Hoy no hay eventos ni fotos aprobados: las listas están vacías y la página lo contempla.

/** Imagen derivada por `pnpm images` (`<base>-<ancho>.webp`); misma forma que `ImageSpec` de shared/ui. */
export type ImagenAgenda = { available: boolean; base: string; widths: number[]; width: number; height: number }

export type EventoAgenda = {
  id: string
  /** Primer día, ISO con año: 'AAAA-MM-DD'. Es la fecha del calendario en Colombia, sin hora. */
  fecha: string
  /** Último día, si dura varios. */
  fechaFin?: string
  imagen?: ImagenAgenda
  /** Enlace propio del evento (inscripción, publicación). Sin él, «Más información» lleva a Contacto. */
  enlace?: string
}

export type AnioMemoria = { anio: number; fotos: readonly { id: string; imagen: ImagenAgenda }[] }

export const EVENTOS = [] as const satisfies readonly EventoAgenda[]
export const MEMORIA = [] as const satisfies readonly AnioMemoria[]

export type EventoId = (typeof EVENTOS)[number]['id']
export type FotoMemoriaId = (typeof MEMORIA)[number]['fotos'][number]['id']
