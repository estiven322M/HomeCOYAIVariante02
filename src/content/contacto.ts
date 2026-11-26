// Contacto y redes del pie: los datos que NO dependen del idioma, una sola vez. Los rótulos van en
// content/{es,en}/common.ts. Todo es opcional: sin dato, su bloque no se muestra (nunca un marcador «pendiente»).

export type RedSocial = 'instagram' | 'youtube' | 'facebook'

export type Contacto = {
  correo?: string
  /** Número internacional tal como se muestra, con indicativo: '+57 …'. */
  whatsapp?: string
  /** URL completa de cada perfil. Solo se muestran las que existan. */
  redes?: Partial<Record<RedSocial, string>>
}

export const CONTACTO: Contacto = {}
