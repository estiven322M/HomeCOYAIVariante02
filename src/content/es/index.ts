import { common } from './common'
import { home } from './home'
import { nosotros } from './nosotros'

export const es = { ...common, ...home, ...nosotros }

export type Content = typeof es
