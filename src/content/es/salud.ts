// Contenido en español (fuente de verdad: define el tipo que debe cumplir el inglés).
// Página «Salud y medicina tradicional» (/salud-y-medicina-tradicional/). Los textos salen del documento de los
// stakeholders y están aprobados; el protocolo de preparación y salud lo valida la organización antes de publicar.
export const salud = {
  hero: {
    eyebrow: 'Salud, espiritualidad y medicina tradicional',
    title: 'Encuentros de sanación ancestral y sabiduría del yagé (ayahuasca)',
    subtitle:
      'Espacios sagrados de armonización del espíritu, la mente y el cuerpo físico, guiados por taitas y sabedores del Putumayo para buscadores de todo el mundo.',
  },
  llamado: {
    imageAlt:
      'El Taita Victoriano Piaguaje Yaiguaje, sabedor siona, con corona de plumas multicolor y collares tradicionales',
    label: 'El llamado',
    title: 'La medicina de la selva al servicio de la humanidad',
    paragraphs: [
      'Para el pueblo Siona (Zio Bain) y los pueblos originarios de la Amazonía colombiana, la medicina tradicional es un camino milenario de reconexión con la vida, la naturaleza y el propósito espiritual. Custodiada por los taitas y mayores del territorio, esta sabiduría comprende al ser humano de forma integral: sanar el cuerpo físico requiere armonizar primero la mente y el espíritu.',
      'Desde la Asociación ÉCOYAI, abrimos un espacio seguro, legítimo y profundamente respetuoso para compartir este legado con personas de distintas partes del mundo que buscan en las plantas sagradas una fuente auténtica de sanación, claridad y sabiduría ancestral.',
    ],
    quote: '«Sanar el cuerpo físico requiere armonizar primero la mente y el espíritu.»',
  },
  encuentros: {
    imageAlts: [
      'Olla sobre el fuego con bejucos y hojas de yagé en preparación',
      'Un sabedor realiza una limpieza con hojas y humo a un participante',
      'Un grupo recorre la selva acompañado de una guía',
      'Mujeres con vestidos tradicionales y un sabedor comparten una danza en un centro cultural',
    ],
    label: 'Nuestros encuentros',
    title: '¿Qué vivimos en nuestros encuentros?',
    intro:
      'Cada jornada es orientada directamente por autoridades tradicionales y médicos ancestrales del Putumayo, integrando prácticas milenarias de limpieza y aprendizaje.',
    items: [
      {
        title: 'Ceremonias de yagé (ayahuasca)',
        text: 'Espacios sagrados de oración, cantos tradicionales (ícaros) y toma ritual de la planta maestra, acompañados con rigor espiritual para la introspección, la limpieza energética y la sanación profunda.',
      },
      {
        title: 'Terapias de purgas y baños medicinales',
        text: 'Prácticas tradicionales de depuración física y espiritual mediante el uso de plantas sagradas de la selva y la chagra, preparadas según el conocimiento de los mayores para renovar la vitalidad del organismo.',
      },
      {
        title: 'Conversatorios de botánica y medicina tradicional',
        text: 'Espacios pedagógicos de diálogo abierto sobre el uso, el cultivo y el significado espiritual de las plantas medicinales amazónicas, comprendiendo la selva como una farmacia viva.',
      },
      {
        title: 'Intercambio de saberes y cultura viva',
        text: 'Encuentros comunitarios para compartir la palabra, la historia del pueblo Siona y las prácticas cotidianas de cuidado del territorio, fortaleciendo un puente de respeto entre culturas.',
      },
    ],
  },
  cuidado: {
    label: 'Cuidado y respeto',
    title: 'Seguridad, ética y acompañamiento',
    intro:
      'En ÉCOYAI honramos la medicina tradicional lejos de cualquier enfoque comercial o superficial. Todos nuestros encuentros cuentan con:',
    items: [
      {
        title: 'Guía espiritual legítima',
        text: 'Ceremonias dirigidas exclusivamente por taitas y sabedores tradicionales reconocidos por su trayectoria comunitaria.',
      },
      {
        title: 'Acompañamiento integral',
        text: 'Preparación previa (dieta y recomendaciones), cuidado constante durante las ceremonias y espacios de integración posterior para cada participante.',
      },
      {
        title: 'Sostenibilidad comunitaria',
        text: 'Los aportes de estos encuentros fortalecen directamente los programas de preservación cultural, lengua materna y bienestar de las comunidades del Putumayo.',
      },
    ],
  },
  /** El texto del protocolo lo valida la organización antes de publicar (solo recoge los puntos que dio). */
  protocolo: {
    title: 'Protocolo de preparación y salud',
    show: 'Ver detalles',
    hide: 'Ocultar',
    points: [
      'Antes de participar, cada persona completa un cuestionario médico confidencial.',
      'Existen contraindicaciones, como ciertos antidepresivos o afecciones cardíacas.',
      'Los encuentros son solo para personas de 18 años o más.',
      'La medicina tradicional no reemplaza la atención médica.',
    ],
  },
  solicitar: {
    label: 'Próximos encuentros',
    title: 'Solicitar información sobre próximos encuentros',
    form: {
      name: 'Nombre',
      country: 'País',
      contact: 'Correo o WhatsApp',
      motivation: 'Motivación',
      motivationHelp: 'No incluyas información médica; la conversaremos en privado.',
      consentPre: 'Acepto la ',
      consentLink: 'política de tratamiento de datos personales',
      consentRequired: '(obligatorio)',
      submit: 'Enviar solicitud',
      note: 'El equipo de ÉCOYAI te contactará para una conversación previa antes de confirmar tu cupo.',
      /** Campo trampa contra spam (oculto): las personas no lo ven. */
      honeypot: 'No completes este campo',
      summary: 'Revisa los campos marcados para continuar:',
      sending: 'Enviando…',
      success: 'Gracias. Recibimos tu solicitud; el equipo de ÉCOYAI te contactará.',
      failure: 'No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos desde la página de Contacto.',
      errors: {
        name: 'Escribe tu nombre.',
        country: 'Escribe tu país.',
        contact: 'Escribe un correo o un número de WhatsApp.',
        motivation: 'Cuéntanos brevemente tu motivación.',
        consent: 'Debes aceptar la política para enviar la solicitud.',
      },
    },
    /** Con el formulario apagado (VITE_FORMS_ENABLED): mismo título y un botón a Contacto. */
    off: {
      text: 'Para pedir información sobre los próximos encuentros, escríbenos desde la página de Contacto.',
      cta: 'Ir a Contacto',
    },
    /** Página de agradecimiento (/gracias/): destino del envío sin JavaScript. */
    gracias: {
      title: 'Gracias',
      text: 'Recibimos tu solicitud. El equipo de ÉCOYAI te contactará para una conversación previa antes de confirmar tu cupo.',
    },
  },
}
