import { useLang } from '@/shared/i18n'

export function Logo({ light = true }: { light?: boolean }) {
  const { t } = useLang()
  return (
    <a href="#inicio" aria-label={t.logoAria}className={`font-serif text-2xl tracking-[0.12em] ${light ? 'text-calido' : 'text-carbon'}`}>
      ÉCOYAI
    </a>
  )
}
