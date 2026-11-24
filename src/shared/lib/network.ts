/** Con estas conexiones, o con ahorro de datos, no hay intro (mismas condiciones en el script de <head>). */
export const SLOW_CONNECTION_TYPES = ['slow-2g', '2g', '3g']

type NetworkInfo = { saveData?: boolean; effectiveType?: string }

/** ¿Pidió el visitante ahorrar datos, o su conexión es lenta? Solo en el cliente (efectos o manejadores). */
export const saveDataOrSlow = () => {
  const c = (navigator as unknown as { connection?: NetworkInfo }).connection
  return !!c && (!!c.saveData || SLOW_CONNECTION_TYPES.includes(c.effectiveType ?? ''))
}
