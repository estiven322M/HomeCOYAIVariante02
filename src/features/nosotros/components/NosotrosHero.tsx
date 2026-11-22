import { useLang } from '@/shared/i18n'
import { HERO_H, HERO_SIZES, HERO_SRC, HERO_SRCSET, HERO_W } from '@/features/nosotros/hero-image'
import { PageHero } from '@/shared/ui/PageHero'

/** Hero de Nosotros: foto de la selva, título y subtítulo, y «Putumayo · Colombia» en la esquina. */
export function NosotrosHero() {
  const { t } = useLang()
  const n = t.nosotros
  // «Putumayo · Colombia» se reutiliza de `common.sideNav.place`, partido en dos líneas.
  const place = t.common.sideNav.place.split(' · ')
  return (
    <PageHero
      image={{ src: HERO_SRC, srcSet: HERO_SRCSET, sizes: HERO_SIZES, width: HERO_W, height: HERO_H }}
      eyebrow={n.eyebrow}
      title={t.common.nav[0]?.label ?? ''}
      subtitle={n.hero.subtitle}
      aside={place.map((line, i) => (
        <span key={line}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    />
  )
}
