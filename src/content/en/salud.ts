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
  encuentros: {
    label: 'Our gatherings',
    title: 'What happens at our gatherings?',
    intro:
      'Each day is led directly by traditional authorities and ancestral healers of Putumayo, bringing together age-old practices of cleansing and learning.',
    items: [
      {
        title: 'Yagé (ayahuasca) ceremonies',
        text: 'Sacred spaces of prayer, traditional songs (ícaros) and ritual intake of the master plant, accompanied with spiritual rigor for introspection, energetic cleansing and deep healing.',
      },
      {
        title: 'Purges and medicinal baths',
        text: 'Traditional practices of physical and spiritual purification using sacred plants from the forest and the chagra, prepared according to the knowledge of the elders to renew the body’s vitality.',
      },
      {
        title: 'Botany and traditional medicine talks',
        text: 'Educational spaces for open dialogue on the use, cultivation and spiritual meaning of Amazonian medicinal plants, understanding the forest as a living pharmacy.',
      },
      {
        title: 'Exchange of knowledge and living culture',
        text: 'Community gatherings to share the word, the history of the Siona people and everyday practices of caring for the territory, strengthening a bridge of respect between cultures.',
      },
    ],
  },
} satisfies typeof esSalud
