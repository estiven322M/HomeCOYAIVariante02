// Contenido en español (fuente de verdad: define el tipo que debe cumplir el inglés).
// Página «Proyectos» (/proyectos/). El contenido es una LISTA de proyectos (cada uno con su `slug`): hoy la página
// muestra el único proyecto; cuando llegue otro, /proyectos/ podrá ser un índice y cada proyecto tendrá su ruta
// sin reescribir componentes. La geometría del mapa (ríos y posición de los resguardos) NO va aquí: está en
// `features/proyectos/mapa.ts`; aquí solo lo traducible (nombres de ríos, leyenda y descripción accesible).

/**
 * Espacio de no separación: une «Zio» y «Bain» en los títulos para que el nombre no se parta entre dos líneas. Solo en
 * títulos de la página; el <title> y la descripción para buscadores van en texto plano (con espacio normal).
 * (Nota: oxfmt convierte la secuencia de escape en el carácter literal; por eso va en una constante con nombre.)
 */
export const NBSP = ' '

export type Proyecto = {
  slug: string
  /** Título y descripción para buscadores (≤ 160 caracteres la descripción). */
  meta: { title: string; description: string }
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    /** Línea de estado. `visible: false` la oculta entera (mientras los estados no estén confirmados). */
    estado: { visible: boolean; label: string; items: { label: string; value: string }[] }
  }
  porQue: {
    label: string
    title: string
    paragraphs: string[]
    quote: string
    /** Texto alternativo del retrato; vacío mientras la foto no exista (el marcador es decorativo). */
    retratoAlt: string
    ficha: { title: string; rows: { label: string; value: string; destacado?: boolean }[] }
  }
  iniciativa: {
    label: string
    title: string
    intro: string
    frentes: { icon: 'voz' | 'ia' | 'libro'; title: string; text: string; imageAlt: string }[]
  }
  resguardos: {
    label: string
    title: string
    disclosure: string
    mapa: {
      /** Nombre de cada río por su `id` en `features/proyectos/mapa.ts`. */
      rios: Record<string, string>
      caption: string
      nota: string
      desc: string
    }
  }
  compromiso: {
    label: string
    title: string
    intro: string
    refs: { icon: 'documento' | 'calendario' | 'escudo' | 'globo'; title: string }[]
  }
  cta: { label: string; title: string; button: string }
}

export const proyectos: { items: [Proyecto, ...Proyecto[]] } = {
  items: [
    {
      slug: 'lengua-siona',
      meta: {
        title: 'Proyectos: lengua Siona — ÉCOYAI',
        description:
          'Proyecto de preservación de la lengua Siona (Zio Bain): corpus oral, inteligencia artificial y formación comunitaria con los mayores del Putumayo.',
      },
      hero: {
        eyebrow: 'Saberes ancestrales y lengua materna',
        title: `Preservación y revitalización de la lengua Siona (Zio${NBSP}Bain)`,
        subtitle:
          'Articulando la sabiduría ancestral de los mayores en los resguardos del Putumayo con herramientas educativas y de inteligencia artificial para mantener viva la voz de la «Gente de la Chagra» en las nuevas generaciones.',
        // Oculta hasta que la organización confirme los estados (ver known-issues).
        estado: {
          visible: false,
          label: 'Estado del proyecto:',
          items: [
            { label: 'Corpus oral', value: 'en construcción' },
            { label: 'Modelo de IA', value: 'en desarrollo' },
            { label: 'Aplicación', value: 'en diseño' },
          ],
        },
      },
      porQue: {
        label: 'Lengua viva',
        title: '¿Por qué es importante proteger la lengua Siona?',
        paragraphs: [
          'El pueblo indígena Siona —que se autodenomina Zio Bain («la gente de la chagra»)— habita en sus distintos resguardos ubicados principalmente en el departamento del Putumayo, en los municipios de Puerto Asís y Puerto Leguízamo, a orillas de los ríos Putumayo, Piñuña Blanco y Cuehembí. Su idioma nativo, perteneciente a la familia lingüística Tukano Occidental, es el vehículo vivo de su cosmovisión, su medicina tradicional, sus relatos sagrados y su relación espiritual con la selva amazónica.',
          'Hoy, esta lengua enfrenta un riesgo crítico de desaparición. La disminución de hablantes activos —concentrados en su mayoría en los adultos mayores— y las limitaciones en los procesos de enseñanza formal han debilitado su transmisión hacia niños y jóvenes en los diferentes resguardos. Proteger la lengua Siona es salvaguardar todo un sistema de pensamiento y el patrimonio cultural inmaterial de la humanidad.',
        ],
        quote: '«Proteger la lengua Siona es salvaguardar todo un sistema de pensamiento.»',
        retratoAlt: '',
        ficha: {
          title: 'Ficha de la lengua',
          rows: [
            { label: 'Familia lingüística', value: 'Tukano Occidental' },
            { label: 'Municipios', value: 'Puerto Asís y Puerto Leguízamo' },
            { label: 'Ríos', value: 'Putumayo, Piñuña Blanco y Cuehembí' },
            { label: 'Estado', value: 'Riesgo crítico de desaparición', destacado: true },
          ],
        },
      },
      iniciativa: {
        label: 'Nuestra iniciativa',
        title: '¿En qué consiste nuestra iniciativa?',
        intro:
          'Desde la Asociación ÉCOYAI, impulsamos una estrategia integral y participativa junto a sabedores tradicionales e instructores comunitarios para revitalizar el uso cotidiano del idioma Siona en los resguardos. Nuestro trabajo se articula en tres frentes principales:',
        frentes: [
          {
            icon: 'voz',
            title: 'Construcción de un corpus oral digital',
            text: 'Recopilación, documentación y digitalización respetuosa de relatos míticos, vocabulario, expresiones y narraciones orales directamente de la voz de los hablantes nativos y mayores de los resguardos Siona.',
            imageAlt: '',
          },
          {
            icon: 'ia',
            title: 'Inteligencia artificial y aplicación móvil y web',
            text: 'Desarrollo de un modelo de inteligencia artificial aplicado a la transcripción y traducción Siona–español, integrado en una aplicación móvil y web que facilitará el aprendizaje autónomo y acercará el idioma a los entornos digitales de niños, jóvenes e investigadores.',
            imageAlt: '',
          },
          {
            icon: 'libro',
            title: 'Formación comunitaria intergeneracional',
            text: 'Implementación de cursos y materiales pedagógicos orientados por sabedores e instructores locales para fortalecer en la comunidad las habilidades de escuchar, hablar, leer y escribir en su lengua propia.',
            imageAlt: '',
          },
        ],
      },
      resguardos: {
        label: 'Territorio',
        title: 'Los resguardos',
        disclosure: 'Ver los resguardos participantes',
        mapa: {
          rios: { putumayo: 'Río Putumayo', pinuna: 'Río Piñuña Blanco', cuehembi: 'Río Cuehembí' },
          caption: 'Mapa ilustrativo',
          nota: 'Dibujo sin escala; no muestra ubicaciones exactas.',
          desc: 'Mapa ilustrativo, no a escala: el río Putumayo corre de oeste a este y recibe los ríos Piñuña Blanco y Cuehembí; los resguardos Buenavista, Piñuña Blanco, Santa Cruz de Piñuña Blanco y El Hacha aparecen como rombos ocre junto a los ríos.',
        },
      },
      compromiso: {
        label: 'Marco de protección',
        title: 'Nuestro compromiso',
        intro:
          'Esta iniciativa se desarrolla en armonía con el marco nacional e internacional de protección de las lenguas nativas, garantizando que las comunidades de los resguardos sean protagonistas y guardianas de su propio conocimiento.',
        refs: [
          { icon: 'documento', title: 'Ley 1381 de 2010' },
          { icon: 'calendario', title: 'Plan Decenal de Lenguas Nativas 2022–2032' },
          { icon: 'escudo', title: 'Convenio 169 de la OIT' },
          { icon: 'globo', title: 'Decenio Internacional de las Lenguas Indígenas 2022–2032 (UNESCO)' },
        ],
      },
      cta: {
        label: 'Donaciones y alianzas',
        title: 'Conoce cómo apoyar esta iniciativa',
        button: 'Apoyar la iniciativa',
      },
    },
  ],
}
