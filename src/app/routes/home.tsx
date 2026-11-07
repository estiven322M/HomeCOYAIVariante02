import { HomePage } from '@/pages/HomePage'

/** Ruta de la portada. Se registra dos veces (`/` y `/en/`); el idioma lo determina la URL, no este módulo. */
export default function HomeRoute() {
  return <HomePage />
}
