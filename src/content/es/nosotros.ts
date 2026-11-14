// Contenido en español (fuente de verdad: define el tipo que debe cumplir el inglés).
// Página Nosotros: hero, historia y territorio, misión y visión, valores, equipo y cierre (marco legal → Transparencia).
export const nosotros = {
  eyebrow: 'Quiénes somos',
  hero: {
    subtitle: 'Desde el pueblo Siona, para la memoria de la Amazonía.',
  },
  /** aria-label de la barra interna; los rótulos de los enlaces son los `label` de cada sección. */
  navAria: 'En esta página',
  historia: {
    label: 'Historia y territorio',
    title: 'Historia de ÉCOYAI',
    paragraphs: [
      'La Asociación ÉCOYAI (Asëcoyai) nació formalmente en marzo de 2024 en Mocoa, departamento del Putumayo, Colombia, como un acto de compromiso cultural y una respuesta urgente para proteger el patrimonio material, espiritual y lingüístico de los pueblos originarios de la Amazonía.',
      'Esta iniciativa surge desde el territorio, inspirada por la visión del Taita Victoriano Piaguaje Yaiguaje y un equipo de sabedores y líderes comunitarios del Pueblo Siona (Zio Bain) —la «Gente de la Chagra»— preocupados por la rápida pérdida paulatina de la lengua materna y el debilitamiento de los conocimientos ancestrales.',
      'Habitantes milenarios de las riberas del río Putumayo, los Zio Bain han sido custodios durante siglos de una cosmovisión profunda, una medicina tradicional ligada a las plantas sagradas y un idioma nativo que alberga la sabiduría de la biodiversidad. Ante la urgencia de evitar la extinción de esta riqueza inmaterial, nace ÉCOYAI con el propósito de tender un puente entre el saber milenario de los abuelos y las herramientas del mundo contemporáneo.',
      'Fundada en el corazón del Putumayo, la organización trabaja como un vehículo al servicio de las comunidades para la salvaguarda de la medicina tradicional, los usos y costumbres, la revitalización del idioma Zio Bain, el desarrollo social integral y la defensa del territorio y la dignidad humana.',
    ],
    image: {
      alt: 'Una embarcación con varias personas navega el río Putumayo bajo un cielo nublado',
      caption: 'Río Putumayo',
    },
    territorio: {
      name: 'Zio Bain',
      /** Espacios de no separación: «Gente de la Chagra» no se parte entre líneas. */
      people: 'Pueblo Siona · «Gente de la Chagra»',
      timeline: [
        {
          k: 'Siglos',
          t: 'Los Zio Bain habitan las riberas del río Putumayo, custodios de su lengua, su medicina y su cosmovisión.',
        },
        { k: 'Marzo de 2024', t: 'Nace formalmente la Asociación ÉCOYAI en Mocoa, Putumayo.' },
        {
          k: '2030',
          t: 'Ser referente regional, nacional e internacional en la salvaguarda de la cultura Siona y de los demás pueblos indígenas de Colombia.',
        },
      ],
    },
  },
  mision: {
    label: 'Misión y visión',
    title: 'Misión y visión',
    /** Cita del propósito: fragmento literal del tercer párrafo de la historia (un test lo comprueba). */
    purpose: {
      quote: 'Tender un puente entre el saber milenario de los abuelos y las herramientas del mundo contemporáneo.',
      cite: 'El propósito de ÉCOYAI',
    },
    mision: {
      eyebrow: 'Hoy',
      k: 'Misión',
      t: 'La Asociación ÉCOYAI trabaja por la protección, salvaguarda, conservación y preservación de los conocimientos ancestrales de la medicina tradicional, los usos y costumbres, la lengua materna, la cosmovisión y el plan de vida del pueblo Siona y demás pueblos indígenas de Colombia, en procura del mejoramiento de la calidad de vida y la dignidad humana.',
      imageAlt: 'Integrantes de la comunidad reunidos en un claro del territorio',
    },
    vision: {
      eyebrow: 'Hacia 2030',
      k: 'Visión',
      t: 'Para el año 2030 la Asociación ÉCOYAI será un referente a nivel regional, nacional e internacional en el desarrollo de proyectos para la salvaguarda, conservación y preservación de la cultura y cosmovisión ancestral del pueblo Siona y demás pueblos indígenas de Colombia.',
      imageAlt: 'Dos sabedores con corona de plumas y collares tradicionales',
    },
  },
  valores: {
    label: 'Valores',
    title: 'Valores institucionales',
    imageAlt: 'Detalle de una corona de plumas tradicional con cuentas',
    items: [
      {
        k: 'Solidaridad',
        t: 'Compromiso con el bienestar colectivo de los pueblos indígenas, promoviendo el apoyo mutuo y la cooperación para la protección de su cultura y conocimientos ancestrales.',
      },
      {
        k: 'Compromiso',
        t: 'Dedicación inquebrantable a la salvaguarda y conservación de la medicina tradicional, la lengua materna, la cosmovisión y el plan de vida indígena.',
      },
      {
        k: 'Ética',
        t: 'Actuar con integridad, responsabilidad y respeto hacia los principios y valores ancestrales de los pueblos indígenas, garantizando la coherencia entre el discurso y la práctica.',
      },
      {
        k: 'Transparencia',
        t: 'Gestión clara y honesta de los procesos y recursos, asegurando la confianza de las comunidades y actores involucrados en la misión de la asociación.',
      },
      {
        k: 'Disciplina',
        t: 'Perseverancia y rigor en la ejecución de proyectos y acciones que fortalezcan la identidad y el bienestar de los pueblos indígenas.',
      },
      {
        k: 'Trabajo en equipo',
        t: 'Fomentar la participación colectiva, el diálogo y la construcción conjunta con las comunidades y aliados estratégicos para alcanzar los objetivos institucionales.',
      },
      {
        k: 'Dignidad humana',
        t: 'Promoción del respeto y la valoración de los derechos fundamentales de los pueblos indígenas, asegurando su reconocimiento y autonomía cultural.',
      },
    ],
  },
  equipo: {
    label: 'Nuestro equipo',
    title: 'Nuestro equipo',
    liderazgo: {
      label: 'Liderazgo ancestral',
      name: 'Taita Victoriano Piaguaje Yaiguaje',
      role: 'Director Ejecutivo de ÉCOYAI',
      text: 'Taita y sabedor tradicional del pueblo Siona (Zio Bain). Como autoridad espiritual y comunitaria de la organización, guía el direccionamiento estratégico de ÉCOYAI, asegurando que cada proyecto y tecnología respete la sabiduría ancestral, la medicina sagrada y la soberanía cultural del territorio.',
      imageAlt:
        'El Taita Victoriano Piaguaje Yaiguaje, con corona de plumas y collares tradicionales, sentado en un banco en el territorio',
    },
    junta: {
      title: 'Junta directiva',
      /** `initials` es el marcador del retrato mientras no haya foto. */
      members: [
        {
          name: 'Victoriano Piaguaje Yaiguaje',
          initials: 'VP',
          role: 'Director Ejecutivo · Miembro de junta directiva y Sabedor Principal',
          profile:
            'Guía espiritual y estratégica de ÉCOYAI, garantizando el apego a los principios y la cosmovisión ancestral.',
        },
        {
          name: 'Franco Ever Yaiguaje Payoguaje',
          initials: 'FY',
          role: 'Miembro de la Junta Directiva · Dirección política',
          profile: 'Liderazgo y dirección política, social y territorial de ÉCOYAI.',
        },
        {
          name: 'María Lidia Ron Papa',
          initials: 'MR',
          role: 'Miembro de junta directiva',
          profile:
            'Coordinación de proyectos comunitarios, salvaguarda de los saberes de las abuelas y de la chagra, y fortalecimiento de la autonomía cultural y social.',
        },
        {
          name: 'Juanita Mercedes Payoguaje Maniguaje',
          initials: 'JP',
          role: 'Miembro de junta directiva',
          profile:
            'Enlace en territorio para la recuperación de la tradición oral y la revitalización pedagógica de la lengua materna (Zio Bain).',
        },
      ],
    },
  },
  /** Cierre: el marco legal vive en /transparencia/; aquí solo se enlaza. */
  cierre: {
    link: 'Ver marco legal y documentos',
  },
}
