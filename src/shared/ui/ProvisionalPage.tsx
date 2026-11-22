import { useNav } from '@/shared/i18n'
import type { RouteKey } from '@/shared/i18n/routes'
import { PageIntro } from './PageIntro'
import { SoonNotice } from './SoonNotice'

/**
 * Página provisional de una entrada del menú: su nombre (h1) y descripción (los de `common.nav`) y el aviso
 * «Esta sección estará disponible pronto» con el patrón lateral. Se sustituye por la página real cuando llegue su diseño.
 */
export function ProvisionalPage({ pageKey }: { pageKey: RouteKey }) {
  const item = useNav().find((n) => n.key === pageKey)
  return (
    <>
      <PageIntro title={item?.label ?? ''} lead={item?.desc} />
      <SoonNotice />
    </>
  )
}
