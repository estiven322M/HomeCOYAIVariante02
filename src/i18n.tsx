import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'es' | 'en'

const es = {
  skip: 'Saltar al contenido',
  switchLabel: 'Cambiar idioma a inglés',
  nav: [
    { label: 'Nosotros', desc: 'Origen, propósito y equipo de ÉCOYAI.' },
    { label: 'Proyectos', desc: 'Iniciativas en torno a la lengua Siona, el territorio y los saberes.' },
    { label: 'Transparencia y Gobernanza', desc: 'Cómo nos organizamos y rendimos cuentas. [Contenido por definir]' },
    { label: 'Donaciones / Alianzas', desc: 'Formas de acompañar y fortalecer el trabajo de ÉCOYAI.' },
    { label: 'Contacto', desc: 'Escríbenos para conversar, colaborar o conocer más.' },
  ],
  logoAria: 'ÉCOYAI, inicio',
  sideNav: { aria: 'Principal', collaborate: 'Colaborar', menu: 'Menú', close: 'Cerrar', place: 'Putumayo · Colombia' },
  hero: {
    aria: 'Territorio',
    eyebrow: 'Desde el territorio, hacia el futuro',
    title: 'El territorio guarda una',
    titleEm: 'memoria viva.',
    text: 'ÉCOYAI conecta territorio, saberes y tecnología para contribuir a la salvaguarda de la lengua Siona y su memoria.',
    cta1: 'Conoce ÉCOYAI',
    cta2: 'Explora el proyecto',
    keywords: 'Territorio · Identidad · Saberes · Lengua · Tecnología',
    explore: 'Explora',
  },
  queEs: {
    eyebrow: 'Origen',
    title: '¿Qué es ÉCOYAI?',
    p1: 'ÉCOYAI es una organización que nace del territorio y trabaja en torno a la identidad cultural, los saberes y la salvaguarda de la lengua Siona.',
    p2: 'Su propósito es poner la tecnología —incluida la inteligencia artificial— al servicio de la memoria, para que aquello que merece permanecer pueda seguir transmitiéndose.',
    p3: '[Texto institucional provisional — pendiente de validación por ÉCOYAI]',
    link: 'Conoce nuestra historia',
    media: 'Fotografía documental — territorio y comunidad',
    caption: 'Nace en el Putumayo',
    quote: 'Territorio, memoria y lengua como un mismo tejido.',
  },
  nosotros: {
    eyebrow: 'Quiénes somos',
    historia: {
      label: 'Historia',
      title: 'Historia de ÉCOYAI',
      alias: '(Asëcoyai)',
      paragraphs: [
        'La Asociación ÉCOYAI (Asëcoyai) nació formalmente en marzo de 2024 en Mocoa, departamento del Putumayo, Colombia, como un acto de compromiso cultural y una respuesta urgente para proteger el patrimonio material, espiritual y lingüístico de los pueblos originarios de la Amazonía.',
        'Esta iniciativa surge desde el territorio, inspirada por la visión del Taita Victoriano Piaguaje Yaiguaje y un equipo de sabedores y líderes comunitarios del Pueblo Siona (Zio Bain) —la «Gente de la Chagra»— preocupados por la rápida pérdida paulatina de la lengua materna y el debilitamiento de los conocimientos ancestrales.',
        'Habitantes milenarios de las riberas del río Putumayo, los Zio Bain han sido custodios durante siglos de una cosmovisión profunda, una medicina tradicional ligada a las plantas sagradas y un idioma nativo que alberga la sabiduría de la biodiversidad. Ante la urgencia de evitar la extinción de esta riqueza inmaterial, nace ÉCOYAI con el propósito de tender un puente entre el saber milenario de los abuelos y las herramientas del mundo contemporáneo.',
        'Fundada en el corazón del Putumayo, la organización trabaja como un vehículo al servicio de las comunidades para la salvaguarda de la medicina tradicional, los usos y costumbres, la revitalización del idioma Zio Bain, el desarrollo social integral y la defensa del territorio y la dignidad humana.',
      ],
      media: 'Fotografía — ribera del río Putumayo, territorio Siona',
      facts: [
        { k: 'Marzo 2024', v: 'Fundación formal' },
        { k: 'Mocoa, Putumayo', v: 'Domicilio y origen' },
        { k: 'Zio Bain', v: 'Pueblo Siona · «Gente de la Chagra»' },
      ],
    },
    estrategia: {
      label: 'Direccionamiento estratégico',
      title: 'Direccionamiento estratégico',
      mision: {
        k: 'Misión',
        t: 'La Asociación ÉCOYAI trabaja por la protección, salvaguarda, conservación y preservación de los conocimientos ancestrales de la medicina tradicional, los usos y costumbres, la lengua materna, la cosmovisión y el plan de vida del pueblo Siona y demás pueblos indígenas de Colombia, en procura del mejoramiento de la calidad de vida y la dignidad humana.',
      },
      vision: {
        k: 'Visión',
        t: 'Para el año 2030 la Asociación ÉCOYAI será un referente a nivel regional, nacional e internacional en el desarrollo de proyectos para la salvaguarda, conservación y preservación de la cultura y cosmovisión ancestral del pueblo Siona y demás pueblos indígenas de Colombia.',
      },
      valuesTitle: 'Valores institucionales',
      values: [
        { k: 'Solidaridad', t: 'Compromiso con el bienestar colectivo de los pueblos indígenas, promoviendo el apoyo mutuo y la cooperación para la protección de su cultura y conocimientos ancestrales.' },
        { k: 'Compromiso', t: 'Dedicación inquebrantable a la salvaguarda y conservación de la medicina tradicional, la lengua materna, la cosmovisión y el plan de vida indígena.' },
        { k: 'Ética', t: 'Actuar con integridad, responsabilidad y respeto hacia los principios y valores ancestrales de los pueblos indígenas, garantizando la coherencia entre el discurso y la práctica.' },
        { k: 'Transparencia', t: 'Gestión clara y honesta de los procesos y recursos, asegurando la confianza de las comunidades y actores involucrados en la misión de la asociación.' },
        { k: 'Disciplina', t: 'Perseverancia y rigor en la ejecución de proyectos y acciones que fortalezcan la identidad y el bienestar de los pueblos indígenas.' },
        { k: 'Trabajo en equipo', t: 'Fomentar la participación colectiva, el diálogo y la construcción conjunta con las comunidades y aliados estratégicos para alcanzar los objetivos institucionales.' },
        { k: 'Dignidad humana', t: 'Promoción del respeto y la valoración de los derechos fundamentales de los pueblos indígenas, asegurando su reconocimiento y autonomía cultural.' },
      ],
    },
    liderazgo: {
      label: 'Liderazgo ancestral',
      title: 'Liderazgo ancestral',
      name: 'Taita Victoriano Piaguaje Yaiguaje',
      roles: ['Líder Espiritual', 'Director Ejecutivo de ÉCOYAI'],
      text: 'Taita y sabedor tradicional del pueblo Siona (Zio Bain). Como autoridad espiritual y comunitaria de la organización, guía el direccionamiento estratégico de ÉCOYAI, asegurando que cada proyecto y tecnología respete la sabiduría ancestral, la medicina sagrada y la soberanía cultural del territorio.',
      media: 'Retrato — Taita Victoriano Piaguaje Yaiguaje',
    },
    legal: {
      label: 'Marco legal y estatutos',
      title: 'Marco legal y estatutos',
      text: 'La Asociación ÉCOYAI es una Entidad Sin Ánimo de Lucro (ESAL) legalmente constituida bajo la legislación colombiana, con personería jurídica, vigencia oficial desde marzo de 2024 y domicilio en Mocoa, Putumayo. Se rige estrictamente por sus estatutos sociales y la normatividad vigente para garantizar la transparencia, el autocontrol y la correcta ejecución de convenios y proyectos de cooperación nacional e internacional.',
      badges: ['ESAL', 'Personería jurídica', 'Desde marzo de 2024', 'Mocoa, Putumayo'],
      docsTitle: 'Documentos legales',
      docs: ['Estatutos sociales', 'Certificado de existencia y representación legal', 'Otros documentos legales'],
      pending: '[Documento por cargar]',
    },
    junta: {
      label: 'Estructura de gobierno',
      title: 'Estructura de gobierno e integrantes',
      subtitle: 'Junta directiva',
      mediaPrefix: 'Retrato',
      members: [
        { name: 'Victoriano Piaguaje Yaiguaje', role: 'Director Ejecutivo · Miembro de junta directiva y Sabedor Principal', profile: 'Guía espiritual y estratégica de ÉCOYAI, garantizando el apego a los principios y la cosmovisión ancestral.' },
        { name: 'Franco Ever Yaiguaje Payoguaje', role: 'Miembro de la Junta Directiva · Dirección política', profile: 'Liderazgo y dirección política, social y territorial de ÉCOYAI.' },
        { name: 'María Lidia Ron Papa', role: 'Miembro de junta directiva', profile: 'Coordinación de proyectos comunitarios, salvaguarda de los saberes de las abuelas y de la chagra, y fortalecimiento de la autonomía cultural y social.' },
        { name: 'Juanita Mercedes Payoguaje Maniguaje', role: 'Miembro de junta directiva', profile: 'Enlace en territorio para la recuperación de la tradición oral y la revitalización pedagógica de la lengua materna (Zio Bain).' },
      ],
    },
  },
  proyecto: {
    eyebrow: 'Proyecto destacado',
    title: 'Una lengua también guarda',
    titleEm: 'una memoria.',
    text: 'El proyecto de salvaguarda de la lengua Siona explora cómo la inteligencia artificial puede ser una herramienta para contribuir a su preservación y transmisión: registrar, organizar y acompañar el aprendizaje, siempre desde la voz de la comunidad.',
    cta: 'Conoce el proyecto',
    media: 'Imagen — transmisión oral, comunidad y territorio',
    words: ['Lengua', 'Memoria', 'Comunidad', 'Transmisión'],
  },
  explora: { eyebrow: 'Índice', title: 'Explora ÉCOYAI' },
  colaborar: {
    eyebrow: 'Colaborar',
    title: 'El futuro también se construye',
    titleEm: 'acompañando.',
    text: 'Tu apoyo puede contribuir a fortalecer iniciativas que conectan tecnología, territorio y preservación cultural.',
    donate: 'Donar',
    alliance: 'Crear una alianza',
    media: 'Fotografía — territorio del Putumayo al atardecer',
  },
  footer: {
    tagline: 'Desde el territorio, hacia el futuro.',
    navAria: 'Pie de página',
    social: 'Redes sociales',
    rights: 'Todos los derechos reservados.',
    legal: 'Aviso legal',
    privacy: 'Política de privacidad',
  },
}

const en: typeof es = {
  skip: 'Skip to content',
  switchLabel: 'Switch language to Spanish',
  nav: [
    { label: 'About us', desc: 'Origin, purpose and team of ÉCOYAI.' },
    { label: 'Projects', desc: 'Initiatives around the Siona language, the territory and traditional knowledge.' },
    { label: 'Transparency and Governance', desc: 'How we organize ourselves and remain accountable. [Content to be defined]' },
    { label: 'Donations / Partnerships', desc: 'Ways to support and strengthen the work of ÉCOYAI.' },
    { label: 'Contact', desc: 'Write to us to talk, collaborate or learn more.' },
  ],
  logoAria: 'ÉCOYAI, home',
  sideNav: { aria: 'Main', collaborate: 'Collaborate', menu: 'Menu', close: 'Close', place: 'Putumayo · Colombia' },
  hero: {
    aria: 'Territory',
    eyebrow: 'From the territory, toward the future',
    title: 'The territory holds a',
    titleEm: 'living memory.',
    text: 'ÉCOYAI connects territory, knowledge and technology to help safeguard the Siona language and its memory.',
    cta1: 'Discover ÉCOYAI',
    cta2: 'Explore the project',
    keywords: 'Territory · Identity · Knowledge · Language · Technology',
    explore: 'Explore',
  },
  queEs: {
    eyebrow: 'Origin',
    title: 'What is ÉCOYAI?',
    p1: 'ÉCOYAI is an organization born from the territory that works around cultural identity, traditional knowledge and the safeguarding of the Siona language.',
    p2: 'Its purpose is to put technology —including artificial intelligence— at the service of memory, so that what deserves to endure can continue to be passed on.',
    p3: '[Provisional institutional text — pending validation by ÉCOYAI]',
    link: 'Learn our story',
    media: 'Documentary photography — territory and community',
    caption: 'Born in Putumayo',
    quote: 'Territory, memory and language as a single fabric.',
  },
  nosotros: {
    eyebrow: 'Who we are',
    historia: {
      label: 'History',
      title: 'The history of ÉCOYAI',
      alias: '(Asëcoyai)',
      paragraphs: [
        'The ÉCOYAI Association (Asëcoyai) was formally founded in March 2024 in Mocoa, in the department of Putumayo, Colombia, as an act of cultural commitment and an urgent response to protect the material, spiritual and linguistic heritage of the Amazon’s native peoples.',
        'The initiative arises from the territory, inspired by the vision of Taita Victoriano Piaguaje Yaiguaje and a team of knowledge keepers and community leaders of the Siona People (Zio Bain) —the “People of the Chagra”— concerned by the rapid, gradual loss of the mother tongue and the weakening of ancestral knowledge.',
        'Dwellers of the banks of the Putumayo River for millennia, the Zio Bain have been custodians for centuries of a profound worldview, a traditional medicine tied to sacred plants, and a native language that holds the wisdom of biodiversity. Faced with the urgency of preventing the extinction of this intangible wealth, ÉCOYAI was born to build a bridge between the ancient knowledge of the elders and the tools of the contemporary world.',
        'Founded in the heart of Putumayo, the organization works as a vehicle at the service of communities for the safeguarding of traditional medicine, customs and traditions, the revitalization of the Zio Bain language, comprehensive social development, and the defense of the territory and human dignity.',
      ],
      media: 'Photography — Putumayo riverbank, Siona territory',
      facts: [
        { k: 'March 2024', v: 'Formal founding' },
        { k: 'Mocoa, Putumayo', v: 'Seat and origin' },
        { k: 'Zio Bain', v: 'Siona People · “People of the Chagra”' },
      ],
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
        { k: 'Solidarity', t: 'Commitment to the collective well-being of Indigenous peoples, promoting mutual support and cooperation to protect their culture and ancestral knowledge.' },
        { k: 'Commitment', t: 'Unwavering dedication to safeguarding and conserving traditional medicine, the mother tongue, the worldview and the Indigenous life plan.' },
        { k: 'Ethics', t: 'Acting with integrity, responsibility and respect for the ancestral principles and values of Indigenous peoples, ensuring consistency between words and practice.' },
        { k: 'Transparency', t: 'Clear and honest management of processes and resources, ensuring the trust of the communities and actors involved in the association’s mission.' },
        { k: 'Discipline', t: 'Perseverance and rigor in carrying out projects and actions that strengthen the identity and well-being of Indigenous peoples.' },
        { k: 'Teamwork', t: 'Fostering collective participation, dialogue and joint construction with communities and strategic allies to reach institutional goals.' },
        { k: 'Human dignity', t: 'Promoting respect for and appreciation of the fundamental rights of Indigenous peoples, ensuring their recognition and cultural autonomy.' },
      ],
    },
    liderazgo: {
      label: 'Ancestral leadership',
      title: 'Ancestral leadership',
      name: 'Taita Victoriano Piaguaje Yaiguaje',
      roles: ['Spiritual Leader', 'Executive Director of ÉCOYAI'],
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
      label: 'Governance structure',
      title: 'Governance structure and members',
      subtitle: 'Board of Directors',
      mediaPrefix: 'Portrait',
      members: [
        { name: 'Victoriano Piaguaje Yaiguaje', role: 'Executive Director · Board member and Principal Knowledge Keeper', profile: 'Spiritual and strategic guide of ÉCOYAI, ensuring adherence to ancestral principles and worldview.' },
        { name: 'Franco Ever Yaiguaje Payoguaje', role: 'Board member · Political leadership', profile: 'Political, social and territorial leadership and direction of ÉCOYAI.' },
        { name: 'María Lidia Ron Papa', role: 'Board member', profile: 'Coordination of community projects, safeguarding of the grandmothers’ and the chagra’s knowledge, and strengthening of cultural and social autonomy.' },
        { name: 'Juanita Mercedes Payoguaje Maniguaje', role: 'Board member', profile: 'Field liaison for recovering oral tradition and the pedagogical revitalization of the mother tongue (Zio Bain).' },
      ],
    },
  },
  proyecto: {
    eyebrow: 'Featured project',
    title: 'A language also holds',
    titleEm: 'a memory.',
    text: 'The Siona language safeguarding project explores how artificial intelligence can be a tool to help preserve and transmit it: recording, organizing and supporting learning, always from the community’s own voice.',
    cta: 'Discover the project',
    media: 'Image — oral transmission, community and territory',
    words: ['Language', 'Memory', 'Community', 'Transmission'],
  },
  explora: { eyebrow: 'Index', title: 'Explore ÉCOYAI' },
  colaborar: {
    eyebrow: 'Collaborate',
    title: 'The future is also built by',
    titleEm: 'walking alongside.',
    text: 'Your support can help strengthen initiatives that connect technology, territory and cultural preservation.',
    donate: 'Donate',
    alliance: 'Create a partnership',
    media: 'Photography — Putumayo territory at sunset',
  },
  footer: {
    tagline: 'From the territory, toward the future.',
    navAria: 'Footer',
    social: 'Social media',
    rights: 'All rights reserved.',
    legal: 'Legal notice',
    privacy: 'Privacy policy',
  },
}

const dict = { es, en }
const STORAGE_KEY = 'ecoyai-lang'

/** Saved choice first; otherwise the browser language (any English variant -> 'en'). */
function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch { /* storage unavailable */ }
  const langs = typeof navigator !== 'undefined' ? navigator.languages?.length ? navigator.languages : [navigator.language] : []
  for (const l of langs) {
    const code = l?.toLowerCase().slice(0, 2)
    if (code === 'en') return 'en'
    if (code === 'es') return 'es'
  }
  return 'es'
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: typeof es }
const LangContext = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const value = useMemo<Ctx>(() => ({
    lang,
    t: dict[lang],
    setLang: (l) => {
      setLangState(l)
      try { localStorage.setItem(STORAGE_KEY, l) } catch { /* storage unavailable */ }
    },
  }), [lang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}

const NAV_META = [
  { href: '#nosotros' },
  { href: '#proyectos' },
  { href: '#transparencia' },
  { href: '#colaborar' },
  { href: '#contacto' },
]

export function useNav() {
  const { t } = useLang()
  return NAV_META.map((m, i) => ({ ...m, ...t.nav[i] }))
}

/** Switch-style toggle: ES on the left, EN on the right. */
export function LangSwitch({ className = 'relative inline-flex' }: { className?: string }) {
  const { lang, setLang, t } = useLang()
  const isEn = lang === 'en'
  return (
    <button type="button" role="switch" aria-checked={isEn} aria-label={t.switchLabel}
      onClick={() => setLang(isEn ? 'es' : 'en')}
      className={`h-8 w-[4.5rem] shrink-0 items-center rounded-full border border-calido/40 bg-selva/50 text-[11px] font-medium tracking-[0.15em] backdrop-blur-[6px] transition-colors duration-500 hover:border-calido ${className}`}>
      <span aria-hidden className={`absolute left-0.5 top-0.5 h-6 w-8 rounded-full bg-ocre transition-transform duration-500 ${isEn ? 'translate-x-[2.25rem]' : ''}`} />
      <span aria-hidden className={`relative z-10 w-1/2 text-center transition-colors duration-500 ${isEn ? 'text-calido/70' : 'text-selva'}`}>ES</span>
      <span aria-hidden className={`relative z-10 w-1/2 text-center transition-colors duration-500 ${isEn ? 'text-selva' : 'text-calido/70'}`}>EN</span>
    </button>
  )
}
