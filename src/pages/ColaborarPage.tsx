import { Colaborar } from '@/features/home/components/Sections'
import { SoonNotice } from '@/shared/ui/SoonNotice'

/** /colaborar/ (donaciones y alianzas) — reutiliza el texto de «Colaborar»; el resto está por llegar. */
export function ColaborarPage() {
  return (
    <>
      <Colaborar asPage />
      <SoonNotice />
    </>
  )
}
