import type { salud as esSalud } from '@/content/es/salud'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
export const salud = {
  hero: {
    eyebrow: 'Health, spirituality and traditional medicine',
    title: 'Traditional healing gatherings and the ancestral wisdom of yagé (ayahuasca)',
    subtitle:
      'Sacred spaces to harmonize spirit, mind and body, guided by taitas and knowledge keepers of Putumayo for seekers from around the world.',
  },
  llamado: {
    label: 'The call',
    title: 'The medicine of the rainforest in service of humanity',
    paragraphs: [
      'For the Siona people (Zio Bain) and the native peoples of the Colombian Amazon, traditional medicine is an age-old path of reconnection with life, nature and spiritual purpose. Safeguarded by the taitas and elders of the territory, this wisdom understands the human being as a whole: healing the physical body requires first harmonizing the mind and the spirit.',
      'From the ÉCOYAI Association, we open a safe, legitimate and deeply respectful space to share this legacy with people from different parts of the world who seek in sacred plants an authentic source of healing, clarity and ancestral wisdom.',
    ],
    quote: '“Healing the physical body requires first harmonizing the mind and the spirit.”',
  },
} satisfies typeof esSalud
