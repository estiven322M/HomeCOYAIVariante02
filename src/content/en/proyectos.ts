import { NBSP, type Proyecto } from '@/content/es/proyectos'

// Contenido en inglés: debe satisfacer exactamente el tipo del español. Nombres propios (Zio Bain, Putumayo, Puerto Asís,
// Puerto Leguízamo, Piñuña Blanco, Cuehembí y los resguardos) sin traducir; «chagra» y «resguardos» llevan glosa en su
// primera aparición en el cuerpo (párrafo 1 de `porQue`).
export const proyectos: { items: [Proyecto, ...Proyecto[]] } = {
  items: [
    {
      slug: 'lengua-siona',
      meta: {
        title: 'Projects: the Siona language — ÉCOYAI',
        description:
          'Project to preserve the Siona language (Zio Bain): an oral corpus, artificial intelligence and community training with the elders of Putumayo.',
      },
      hero: {
        eyebrow: 'Ancestral knowledge and mother tongue',
        title: `Preserving and revitalizing the Siona language (Zio${NBSP}Bain)`,
        subtitle:
          'Bringing together the ancestral wisdom of the elders in the Putumayo resguardos with educational and artificial intelligence tools, to keep the voice of the “People of the Chagra” alive for new generations.',
        estado: {
          visible: false,
          label: 'Project status:',
          items: [
            { label: 'Oral corpus', value: 'under construction' },
            { label: 'AI model', value: 'in development' },
            { label: 'App', value: 'in design' },
          ],
        },
      },
      porQue: {
        label: 'Living language',
        title: 'Why does protecting the Siona language matter?',
        paragraphs: [
          'The Siona Indigenous people —who call themselves Zio Bain, the people of the chagra (the traditional Amazonian garden plot)— live in several resguardos (collectively owned Indigenous territories) located mainly in the department of Putumayo, in the municipalities of Puerto Asís and Puerto Leguízamo, along the Putumayo, Piñuña Blanco and Cuehembí rivers. Their native language, part of the Western Tukanoan family, is the living vehicle of their worldview, their traditional medicine, their sacred stories and their spiritual relationship with the Amazon rainforest.',
          'Today, this language faces a critical risk of disappearing. The decline in active speakers —mostly elderly adults— and the limits of formal teaching have weakened its transmission to children and young people in the different resguardos. Protecting the Siona language means safeguarding an entire system of thought and the intangible cultural heritage of humanity.',
        ],
        quote: '“Protecting the Siona language means safeguarding an entire system of thought.”',
        retratoAlt: '',
        ficha: {
          title: 'Language profile',
          rows: [
            { label: 'Language family', value: 'Western Tukanoan' },
            { label: 'Municipalities', value: 'Puerto Asís and Puerto Leguízamo' },
            { label: 'Rivers', value: 'Putumayo, Piñuña Blanco and Cuehembí' },
            { label: 'Status', value: 'At critical risk of disappearing', destacado: true },
          ],
        },
      },
      iniciativa: {
        label: 'Our initiative',
        title: 'What does our initiative involve?',
        intro:
          'From the ÉCOYAI Association, we are advancing a comprehensive, participatory strategy together with traditional knowledge keepers and community instructors to revitalize everyday use of the Siona language in the resguardos. Our work is organized around three main areas:',
        frentes: [
          {
            icon: 'voz',
            title: 'Building a digital oral corpus',
            text: 'Respectful collection, documentation and digitization of myths, vocabulary, expressions and oral narratives, recorded directly from the voices of native speakers and elders in the Siona resguardos.',
            imageAlt: '',
          },
          {
            icon: 'ia',
            title: 'Artificial intelligence and a mobile and web app',
            text: 'Development of an artificial intelligence model for Siona–Spanish transcription and translation, built into a mobile and web app that will support self-directed learning and bring the language closer to the digital worlds of children, young people and researchers.',
            imageAlt: '',
          },
          {
            icon: 'libro',
            title: 'Intergenerational community training',
            text: 'Courses and teaching materials led by local knowledge keepers and instructors, to strengthen the community’s skills in listening, speaking, reading and writing its own language.',
            imageAlt: '',
          },
        ],
      },
      resguardos: {
        label: 'Territory',
        title: 'The resguardos',
        disclosure: 'See the participating resguardos',
        mapa: {
          rios: { putumayo: 'Putumayo River', pinuna: 'Piñuña Blanco River', cuehembi: 'Cuehembí River' },
          caption: 'Illustrative map',
          nota: 'Drawing not to scale; it does not show exact locations.',
          desc: 'Illustrative map, not to scale: the Putumayo River runs from west to east and is joined by the Piñuña Blanco and Cuehembí rivers; the Buenavista, Piñuña Blanco, Santa Cruz de Piñuña Blanco and El Hacha resguardos appear as ochre diamonds next to the rivers.',
        },
      },
      compromiso: {
        label: 'Protection framework',
        title: 'Our commitment',
        intro:
          'This initiative is carried out in harmony with the national and international framework for protecting native languages, ensuring that the communities of the resguardos are the protagonists and guardians of their own knowledge.',
        refs: [
          { icon: 'documento', title: 'Law 1381 of 2010' },
          { icon: 'calendario', title: 'Ten-Year Plan for Native Languages 2022–2032' },
          { icon: 'globo', title: 'ILO Convention 169' },
          { icon: 'globo', title: 'International Decade of Indigenous Languages 2022–2032 (UNESCO)' },
        ],
      },
      cta: {
        label: 'Donations and partnerships',
        title: 'Find out how to support this initiative',
        button: 'Support the initiative',
      },
    },
  ],
}
