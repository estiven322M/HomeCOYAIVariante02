// DATOS FICTICIOS para revisar el pie. Solo entran en el build de demostración local (`FOOTER_DEMO=1 pnpm build`);
// `pnpm verify:build` falla si alguno llega al build publicado. No son datos de la organización.
import type { Contacto } from './contacto'

export const CONTACTO: Contacto = {
  correo: 'ejemplo@example.org',
  whatsapp: '+57 000 000 0000',
  redes: {
    instagram: 'https://example.org/instagram',
    youtube: 'https://example.org/youtube',
    facebook: 'https://example.org/facebook',
  },
}
