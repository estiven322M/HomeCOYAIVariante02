import { Link } from 'react-router'
import { useLang, usePathFor } from '@/shared/i18n'

/** `className` lleva el tamaño (y la caja) del logotipo. */
export function Logo({ light = true, className = 'text-2xl' }: { light?: boolean; className?: string }) {
  const { t } = useLang()
  const pathFor = usePathFor()
  return (
    <Link
      to={pathFor('home')}
      aria-label={t.common.logoAria}
      className={`font-serif tracking-[0.12em] ${className} ${light ? 'text-calido' : 'text-carbon'}`}
    >
      ÉCOYAI
    </Link>
  )
}
