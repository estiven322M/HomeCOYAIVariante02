import type { meta as esMeta } from '@/content/es/meta'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
export const meta = {
  meta: {
    siteName: 'ÉCOYAI',
    ogLocale: 'en_US',
    pages: {
      home: {
        title: 'ÉCOYAI — Home / Variant 02 / Immersive Territorial',
        description:
          'Offers an immersive, cinematic homepage showcasing the Putumayo territory to connect users with cultural memory, language preservation, and technology.',
      },
    },
  },
} satisfies typeof esMeta
