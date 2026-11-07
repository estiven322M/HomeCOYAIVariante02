import type { Content } from '@/content/es'
import { common } from './common'
import { home } from './home'
import { meta } from './meta'
import { nosotros } from './nosotros'

export const en: Content = { ...common, ...home, ...meta, ...nosotros }
