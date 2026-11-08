// Contenido en español (fuente de verdad: define el tipo que debe cumplir el inglés).
// Transparencia y gobernanza: marco legal y documentos.
/** Un documento publicable: sin `url` se muestra como texto («por cargar»); con `url`, como enlace de descarga. */
export type LegalDoc = { name: string; url?: string }

export const transparencia = {
  legal: {
    label: 'Marco legal y estatutos',
    title: 'Marco legal y estatutos',
    text: 'La Asociación ÉCOYAI es una Entidad Sin Ánimo de Lucro (ESAL) legalmente constituida bajo la legislación colombiana, con personería jurídica, vigencia oficial desde marzo de 2024 y domicilio en Mocoa, Putumayo. Se rige estrictamente por sus estatutos sociales y la normatividad vigente para garantizar la transparencia, el autocontrol y la correcta ejecución de convenios y proyectos de cooperación nacional e internacional.',
    badges: ['ESAL', 'Personería jurídica', 'Desde marzo de 2024', 'Mocoa, Putumayo'],
    docsTitle: 'Documentos legales',
    docs: [
      { name: 'Estatutos sociales' },
      { name: 'Certificado de existencia y representación legal' },
      { name: 'Otros documentos legales' },
    ] as LegalDoc[],
    pending: 'Documento por cargar',
  },
}
