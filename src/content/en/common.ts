import type { common as esCommon } from '@/content/es/common'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
export const common = {
  skip: 'Skip to content',
  switchLabel: 'Switch language to Spanish',
  logoAria: 'ÉCOYAI, home',
  nav: [
    { label: 'About us', desc: 'Origin, purpose and team of ÉCOYAI.' },
    { label: 'Projects', desc: 'Initiatives around the Siona language, the territory and traditional knowledge.' },
    {
      label: 'Health and traditional medicine',
      desc: 'Traditional medicine of the Siona people and its safeguarding.',
    },
    { label: 'Events', desc: 'Gatherings, activities and dates of ÉCOYAI.' },
    { label: 'Gallery', desc: 'Images of the territory, the community and traditional knowledge.' },
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
    explore: 'Explore',
    contact: 'Contact',
    social: 'Social media',
    language: 'Language',
    rights: 'All rights reserved.',
  },
  privacy: { title: 'Privacy policy', description: 'ÉCOYAI’s personal data processing policy.' },
  soon: 'This section will be available soon',
  backHome: 'Back to home',
  video: {
    pause: 'Pause',
    play: 'Play',
    pauseAria: 'Pause background video',
    playAria: 'Play background video',
  },
  notFound: {
    title: 'Page not found',
    text: 'The address does not exist or has moved.',
    otherLang: 'Leer en español',
  },
  errorBoundary: {
    title: 'Something went wrong',
    text: 'The page ran into an unexpected problem. You can try loading it again.',
    reload: 'Reload the page',
  },
} satisfies typeof esCommon
