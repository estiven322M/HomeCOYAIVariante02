import { Link } from 'react-router'
import { useLang, usePathFor } from '@/shared/i18n'

export function Logo({ light = true }: { light?: boolean }) {
  const { t } = useLang()
  const pathFor = usePathFor()
  return (
    <Link
      to={pathFor('home')}
      aria-label={t.common.logoAria}
      className={`font-serif text-2xl tracking-[0.12em] ${light ? 'text-calido' : 'text-carbon'}`}
    >
      ÉCOYAI
    </Link>
  )
}
