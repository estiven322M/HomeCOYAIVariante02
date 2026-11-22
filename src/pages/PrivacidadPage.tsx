import { useLang } from '@/shared/i18n'
import { ProvisionalPage } from '@/shared/ui/ProvisionalPage'

/** /privacidad/ — provisional hasta que la organización entregue la política de tratamiento de datos (Ley 1581 de 2012). */
export function PrivacidadPage() {
  const p = useLang().t.common.privacy
  return <ProvisionalPage pageKey="privacidad" title={p.title} lead={p.description} />
}
