import type { common as esCommon, Social } from '@/content/es/common'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
export const common = {
  skip: 'Skip to content',
  switchLabel: 'Switch language to Spanish',
  logoAria: 'ÉCOYAI, home',
  nav: [
    { label: 'About us', desc: 'Origin, purpose and team of ÉCOYAI.' },
    { label: 'Projects', desc: 'Initiatives around the Siona language, the territory and traditional knowledge.' },
    {
      label: 'Transparency and Governance',
      desc: 'How we organize ourselves and remain accountable. [Content to be defined]',
    },
    { label: 'Donations / Partnerships', desc: 'Ways to support and strengthen the work of ÉCOYAI.' },
    { label: 'Contact', desc: 'Write to us to talk, collaborate or learn more.' },
  ],
  sideNav: { aria: 'Main', collaborate: 'Collaborate', menu: 'Menu', close: 'Close', place: 'Putumayo · Colombia' },
  intro: {
    phrase: 'From the territory, toward the future.',
    loading: 'Loading the territory',
    skip: 'Skip',
    aria: 'Welcome screen',
    tigerAlt: 'Jaguar, ÉCOYAI emblem',
  },
  footer: {
    tagline: 'From the territory, toward the future.',
    navAria: 'Footer',
    social: 'Social media',
    rights: 'All rights reserved.',
    // Redes: {name, url}. Mientras la lista esté vacía el bloque no se muestra (sin marcadores entre corchetes).
    socials: [] as Social[],
  },
  soon: 'This section will be available soon',
  backHome: 'Back to home',
  notFound: {
    title: 'Page not found',
    text: 'The address does not exist or has moved.',
    otherLang: 'Leer en español',
    pages: 'Main pages',
  },
  errorBoundary: {
    title: 'Something went wrong',
    text: 'The page ran into an unexpected problem. You can try loading it again.',
    reload: 'Reload the page',
  },
} satisfies typeof esCommon
