// Como contacto.demo.ts, pero con datos incompletos (`FOOTER_DEMO=parcial pnpm build`): correo sin WhatsApp y una sola
// red. Sirve para comprobar que lo que falta no deja huecos. Datos ficticios, solo en local.
import type { Contacto } from './contacto'

export const CONTACTO: Contacto = {
  correo: 'ejemplo@example.org',
  redes: { instagram: 'https://example.org/instagram' },
}
