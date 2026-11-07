import { common } from './common'
import { home } from './home'
import { meta } from './meta'
import { nosotros } from './nosotros'

export const es = { ...common, ...home, ...meta, ...nosotros }

export type Content = typeof es
