import { common } from './common'
import { home } from './home'
import { meta } from './meta'
import { nosotros } from './nosotros'
import { transparencia } from './transparencia'

// Un espacio de nombres por dominio: t.common.*, t.home.*, t.nosotros.*, t.meta.* (una clave repetida entre
// dominios ya no se sobrescribe en silencio).
export const es = { common, home, meta, nosotros, transparencia }

export type Content = typeof es
