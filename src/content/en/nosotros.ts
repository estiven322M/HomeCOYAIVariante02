import type { nosotros as esNosotros } from '@/content/es/nosotros'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
export const nosotros = {
  eyebrow: 'Who we are',
  historia: {
    label: 'History',
    title: 'The history of ÉCOYAI',
    paragraphs: [
      'The ÉCOYAI Association (Asëcoyai) was formally founded in March 2024 in Mocoa, in the department of Putumayo, Colombia, as an act of cultural commitment and an urgent response to protect the material, spiritual and linguistic heritage of the Amazon’s native peoples.',
      'The initiative arises from the territory, inspired by the vision of Taita Victoriano Piaguaje Yaiguaje and a team of knowledge keepers and community leaders of the Siona People (Zio Bain) —the “People of the Chagra”— concerned by the rapid, gradual loss of the mother tongue and the weakening of ancestral knowledge.',
      'Dwellers of the banks of the Putumayo River for millennia, the Zio Bain have been custodians for centuries of a profound worldview, a traditional medicine tied to sacred plants, and a native language that holds the wisdom of biodiversity. Faced with the urgency of preventing the extinction of this intangible wealth, ÉCOYAI was born to build a bridge between the ancient knowledge of the elders and the tools of the contemporary world.',
      'Founded in the heart of Putumayo, the organization works as a vehicle at the service of communities for the safeguarding of traditional medicine, customs and traditions, the revitalization of the Zio Bain language, comprehensive social development, and the defense of the territory and human dignity.',
    ],
    media: 'Photography — Putumayo riverbank, Siona territory',
    facts: [{ k: 'Zio Bain', v: 'Siona People · “People of the Chagra”' }],
  },
  estrategia: {
    label: 'Strategic direction',
    title: 'Strategic direction',
    mision: {
      k: 'Mission',
      t: 'The ÉCOYAI Association works for the protection, safeguarding, conservation and preservation of the ancestral knowledge of traditional medicine, customs and traditions, the mother tongue, the worldview and the life plan of the Siona people and other Indigenous peoples of Colombia, in pursuit of a better quality of life and human dignity.',
    },
    vision: {
      k: 'Vision',
      t: 'By 2030, the ÉCOYAI Association will be a regional, national and international reference in developing projects for the safeguarding, conservation and preservation of the ancestral culture and worldview of the Siona people and other Indigenous peoples of Colombia.',
    },
    valuesTitle: 'Institutional values',
    values: [
      {
        k: 'Solidarity',
        t: 'Commitment to the collective well-being of Indigenous peoples, promoting mutual support and cooperation to protect their culture and ancestral knowledge.',
      },
      {
        k: 'Commitment',
        t: 'Unwavering dedication to safeguarding and conserving traditional medicine, the mother tongue, the worldview and the Indigenous life plan.',
      },
      {
        k: 'Ethics',
        t: 'Acting with integrity, responsibility and respect for the ancestral principles and values of Indigenous peoples, ensuring consistency between words and practice.',
      },
      {
        k: 'Transparency',
        t: 'Clear and honest management of processes and resources, ensuring the trust of the communities and actors involved in the association’s mission.',
      },
      {
        k: 'Discipline',
        t: 'Perseverance and rigor in carrying out projects and actions that strengthen the identity and well-being of Indigenous peoples.',
      },
      {
        k: 'Teamwork',
        t: 'Fostering collective participation, dialogue and joint construction with communities and strategic allies to reach institutional goals.',
      },
      {
        k: 'Human dignity',
        t: 'Promoting respect for and appreciation of the fundamental rights of Indigenous peoples, ensuring their recognition and cultural autonomy.',
      },
    ],
  },
  liderazgo: {
    label: 'Ancestral leadership',
    title: 'Ancestral leadership',
    name: 'Taita Victoriano Piaguaje Yaiguaje',
    roles: ['Executive Director of ÉCOYAI'],
    text: 'Taita and traditional knowledge keeper of the Siona people (Zio Bain). As the organization’s spiritual and community authority, he guides ÉCOYAI’s strategic direction, ensuring that every project and technology respects ancestral wisdom, sacred medicine and the cultural sovereignty of the territory.',
    media: 'Portrait — Taita Victoriano Piaguaje Yaiguaje',
  },
  legal: {
    label: 'Legal framework and bylaws',
    title: 'Legal framework and bylaws',
    text: 'The ÉCOYAI Association is a non-profit entity (ESAL) legally incorporated under Colombian law, with legal personality, official standing since March 2024 and its seat in Mocoa, Putumayo. It is strictly governed by its bylaws and current regulations to guarantee transparency, self-control and the proper execution of agreements and national and international cooperation projects.',
    badges: ['ESAL', 'Legal personality', 'Since March 2024', 'Mocoa, Putumayo'],
    docsTitle: 'Legal documents',
    docs: ['Bylaws', 'Certificate of existence and legal representation', 'Other legal documents'],
    pending: '[Document to be uploaded]',
  },
  junta: {
    label: 'Our Team',
    title: 'Our Team',
    subtitle: 'Board of Directors',
    mediaPrefix: 'Portrait',
    members: [
      {
        name: 'Victoriano Piaguaje Yaiguaje',
        role: 'Executive Director · Board member and Principal Knowledge Keeper',
        profile: 'Spiritual and strategic guide of ÉCOYAI, ensuring adherence to ancestral principles and worldview.',
      },
      {
        name: 'Franco Ever Yaiguaje Payoguaje',
        role: 'Board member · Political leadership',
        profile: 'Political, social and territorial leadership and direction of ÉCOYAI.',
      },
      {
        name: 'María Lidia Ron Papa',
        role: 'Board member',
        profile:
          'Coordination of community projects, safeguarding of the grandmothers’ and the chagra’s knowledge, and strengthening of cultural and social autonomy.',
      },
      {
        name: 'Juanita Mercedes Payoguaje Maniguaje',
        role: 'Board member',
        profile:
          'Field liaison for recovering oral tradition and the pedagogical revitalization of the mother tongue (Zio Bain).',
      },
    ],
  },
} satisfies typeof esNosotros
