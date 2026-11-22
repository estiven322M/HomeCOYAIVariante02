import { useLang } from '@/shared/i18n'
import { PageHero } from '@/shared/ui/PageHero'
import { heroImage } from '@/features/salud/images'
import { Llamado } from './Llamado'
import { Practicas } from './Practicas'

/** Página «Salud y medicina tradicional»: hero, el llamado, encuentros, cuidado y solicitud de información. */
export function Salud() {
  const h = useLang().t.salud.hero
  return (
    <>
      <PageHero image={heroImage()} eyebrow={h.eyebrow} title={h.title} subtitle={h.subtitle} size="long" />
      <Llamado />
      <Practicas />
    </>
  )
}
