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
  cuidado: {
    label: 'Care and respect',
    title: 'Safety, ethics and support',
    intro:
      'At ÉCOYAI we honor traditional medicine, far from any commercial or superficial approach. All our gatherings include:',
    items: [
      {
        title: 'Legitimate spiritual guidance',
        text: 'Ceremonies led exclusively by taitas and traditional knowledge keepers recognized for their community standing.',
      },
      {
        title: 'Comprehensive support',
        text: 'Prior preparation (diet and recommendations), constant care during the ceremonies and spaces for integration afterwards for each participant.',
      },
      {
        title: 'Community contribution',
        text: 'The contributions from these gatherings directly strengthen the programs for cultural preservation, mother tongue and well-being of the communities of Putumayo.',
      },
    ],
  },
  protocolo: {
    title: 'Preparation and health protocol',
    show: 'Show details',
    hide: 'Hide',
    points: [
      'Before taking part, each person completes a confidential medical questionnaire.',
      'There are contraindications, such as certain antidepressants or heart conditions.',
      'The gatherings are only for people aged 18 or older.',
      'Traditional medicine does not replace medical care.',
    ],
  },
  solicitar: {
    label: 'Upcoming gatherings',
    title: 'Request information about upcoming gatherings',
    form: {
      name: 'Name',
      country: 'Country',
      contact: 'Email or WhatsApp',
      motivation: 'Motivation',
      motivationHelp: 'Please don’t include medical information; we will discuss it privately.',
      consentPre: 'I accept the ',
      consentLink: 'personal data processing policy',
      consentRequired: '(required)',
      submit: 'Send request',
      note: 'The ÉCOYAI team will contact you for a conversation before confirming your place.',
      honeypot: 'Do not fill in this field',
      summary: 'Please review the marked fields to continue:',
      sending: 'Sending…',
      success: 'Thank you. We received your request; the ÉCOYAI team will contact you.',
      failure: 'We couldn’t send your request. Please try again or write to us from the Contact page.',
      errors: {
        name: 'Enter your name.',
        country: 'Enter your country.',
        contact: 'Enter an email or a WhatsApp number.',
        motivation: 'Tell us briefly about your motivation.',
        consent: 'You must accept the policy to send the request.',
      },
    },
    off: {
      text: 'To ask about upcoming gatherings, write to us from the Contact page.',
      cta: 'Go to Contact',
    },
    gracias: {
      title: 'Thank you',
      text: 'We received your request. The ÉCOYAI team will contact you for a conversation before confirming your place.',
    },
  },
} satisfies typeof esSalud
