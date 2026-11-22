import type { nosotros as esNosotros } from '@/content/es/nosotros'

// Contenido en inglés: debe satisfacer exactamente el tipo del español.
export const nosotros = {
  eyebrow: 'Who we are',
  hero: {
    subtitle: 'From Siona knowledge, for the living memory of the Amazon.',
  },
  navAria: 'On this page',
  historia: {
    label: 'History and territory',
    title: 'The history of ÉCOYAI',
    paragraphs: [
      'The ÉCOYAI Association (Asëcoyai) was formally founded in March 2024 in Mocoa, in the department of Putumayo, Colombia, as an act of cultural commitment and an urgent response to protect the material, spiritual and linguistic heritage of the Amazon’s native peoples.',
      'The initiative arises from the territory, inspired by the vision of Taita Victoriano Piaguaje Yaiguaje and a team of knowledge keepers and community leaders of the Siona People (Zio Bain) —the “People of the Chagra”— concerned by the rapid, gradual loss of the mother tongue and the weakening of ancestral knowledge.',
      'Dwellers of the banks of the Putumayo River, the Zio Bain have been custodians of a profound worldview, a traditional medicine tied to sacred plants, and a native language that holds the wisdom of biodiversity. Faced with the urgency of preventing the extinction of this intangible wealth, ÉCOYAI was born to build a bridge between the knowledge of the elders and the tools of the contemporary world.',
      'Founded in the heart of Putumayo, the organization works as a vehicle at the service of communities for the safeguarding of traditional medicine, customs and traditions, the revitalization of the Zio Bain language, comprehensive social development, and the defense of the territory and human dignity.',
    ],
    image: {
      alt: 'A boat carrying several people travels down the Putumayo River under a cloudy sky',
      caption: 'Putumayo River',
    },
    territorio: {
      name: 'Zio Bain',
      people: 'Siona People · “People of the Chagra”',
      timeline: [
        {
          k: 'Centuries',
          t: 'The Zio Bain have lived along the banks of the Putumayo River, custodians of their language, their medicine and their worldview.',
        },
        { k: 'March 2024', t: 'The ÉCOYAI Association is formally founded in Mocoa, Putumayo.' },
        {
          k: '2030',
          t: 'To be a regional, national and international reference in safeguarding the culture of the Siona people and other Indigenous peoples of Colombia.',
        },
      ],
    },
  },
  mision: {
    label: 'Mission and vision',
    title: 'Mission and vision',
    purpose: {
      quote: 'To build a bridge between the ancient knowledge of the elders and the tools of the contemporary world.',
      cite: 'The purpose of ÉCOYAI',
    },
    mision: {
      eyebrow: 'Today',
      k: 'Mission',
      t: 'The ÉCOYAI Association works for the protection, safeguarding, conservation and preservation of the ancestral knowledge of traditional medicine, customs and traditions, the mother tongue, the worldview and the life plan of the Siona people and other Indigenous peoples of Colombia, in pursuit of a better quality of life and human dignity.',
      imageAlt: 'Community members gathered in a clearing in the territory',
    },
    vision: {
      eyebrow: 'Toward 2030',
      k: 'Vision',
      t: 'By 2030, the ÉCOYAI Association will be a regional, national and international reference in developing projects for the safeguarding, conservation and preservation of the ancestral culture and worldview of the Siona people and other Indigenous peoples of Colombia.',
      imageAlt: 'Two knowledge keepers wearing a feather crown and traditional necklaces',
    },
  },
  valores: {
    label: 'Values',
    title: 'Institutional values',
    items: [
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
  equipo: {
    label: 'Our Team',
    title: 'Our Team',
    liderazgo: {
      label: 'Ancestral leadership',
      name: 'Taita Victoriano Piaguaje Yaiguaje',
      role: 'Executive Director of ÉCOYAI',
      text: 'Taita and traditional knowledge keeper of the Siona people (Zio Bain). As the organization’s spiritual and community authority, he guides ÉCOYAI’s strategic direction, ensuring that every project and technology respects ancestral wisdom, sacred medicine and the cultural sovereignty of the territory.',
      imageAlt:
        'Taita Victoriano Piaguaje Yaiguaje, wearing a feather crown and traditional necklaces, seated on a bench in the territory',
    },
    junta: {
      title: 'Board of Directors',
      members: [
        {
          name: 'Victoriano Piaguaje Yaiguaje',
          initials: 'VP',
          photoAlt: 'Portrait of Victoriano Piaguaje Yaiguaje, wearing a feather crown and traditional necklaces',
          role: 'Executive Director · Board member and Principal Knowledge Keeper',
          profile: 'Spiritual and strategic guide of ÉCOYAI, ensuring adherence to ancestral principles and worldview.',
        },
        {
          name: 'Franco Ever Yaiguaje Payoguaje',
          initials: 'FY',
          role: 'Board member · Political leadership',
          profile: 'Political, social and territorial leadership and direction of ÉCOYAI.',
        },
        {
          name: 'María Lidia Ron Papa',
          initials: 'MR',
          role: 'Board member',
          profile:
            'Coordination of community projects, safeguarding of the grandmothers’ and the chagra’s knowledge, and strengthening of cultural and social autonomy.',
        },
        {
          name: 'Juanita Mercedes Payoguaje Maniguaje',
          initials: 'JP',
          role: 'Board member',
          profile:
            'Field liaison for recovering oral tradition and the pedagogical revitalization of the mother tongue (Zio Bain).',
        },
      ],
    },
  },
  cierre: {
    link: 'See the legal framework and documents',
  },
} satisfies typeof esNosotros
