import { useLang } from '@/shared/i18n'
import { PageIntro } from '@/shared/ui/PageIntro'
import { SoonNotice } from '@/shared/ui/SoonNotice'

/** /contacto/ — sin contenido propio todavía: título y descripción del menú, y el aviso. */
export function ContactoPage() {
  const nav = useLang().t.common.nav[4]
  return (
    <>
      <PageIntro title={nav?.label ?? ''} lead={nav?.desc} />
      <SoonNotice />
    </>
  )
}
