import type { LegalDoc, transparencia as esTransparencia } from '@/content/es/transparencia'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
export const transparencia = {
  legal: {
    label: 'Legal framework and bylaws',
    title: 'Legal framework and bylaws',
    text: 'The ÉCOYAI Association is a non-profit entity (ESAL) legally incorporated under Colombian law, with legal personality, official standing since March 2024 and its seat in Mocoa, Putumayo. It is strictly governed by its bylaws and current regulations to guarantee transparency, self-control and the proper execution of agreements and national and international cooperation projects.',
    badges: ['ESAL', 'Legal personality', 'Since March 2024', 'Mocoa, Putumayo'],
    docsTitle: 'Legal documents',
    docs: [
      { name: 'Bylaws' },
      { name: 'Certificate of existence and legal representation' },
      { name: 'Other legal documents' },
    ] as LegalDoc[],
    pending: 'Document to be uploaded',
  },
} satisfies typeof esTransparencia
