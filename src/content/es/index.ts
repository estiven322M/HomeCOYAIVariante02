import { common } from './common'
import { home } from './home'
import { meta } from './meta'
import { nosotros } from './nosotros'
import { proyectos } from './proyectos'
import { salud } from './salud'

// Un espacio de nombres por dominio: t.common.*, t.home.*, t.nosotros.*, t.proyectos.*, t.salud.*, t.meta.* (una clave repetida entre
// dominios ya no se sobrescribe en silencio).
export const es = { common, home, meta, nosotros, proyectos, salud }

export type Content = typeof es
