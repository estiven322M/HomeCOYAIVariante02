import { useLayoutEffect, useState } from 'react'
import { hoyEnBogota } from '@/features/eventos/agenda'

/**
 * «Hoy» para filtrar la agenda. En el prerender y en el primer render del cliente es el día del build (así el HTML
 * coincide); justo después, antes de pintar en una navegación en cliente, el día real en Bogotá. Sin JavaScript queda el
 * del build: un evento vencido sigue visible hasta el siguiente despliegue (ver docs/known-issues.md).
 */
export function useHoy() {
  const [hoy, setHoy] = useState(__FECHA_BUILD__)
  useLayoutEffect(() => {
    // Decisión solo de cliente, tras hidratar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHoy(hoyEnBogota(new Date()))
  }, [])
  return hoy
}
