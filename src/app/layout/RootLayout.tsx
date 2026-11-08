import type { ReactNode } from 'react'
import { useLang } from '@/shared/i18n'
import { useIntro } from '@/shared/intro/intro-context'
import { Intro } from './Intro'
import { SideNav } from './SideNav'

/** Estructura global: intro, enlace de salto, menú lateral y contenido de la página. */
export function RootLayout({ children }: { children: ReactNode }) {
  const { t } = useLang()
  const { phase } = useIntro()
  const introActive = phase === 'active' || phase === 'leaving'
  return (
    <>
      <Intro />
      <div inert={introActive} aria-hidden={introActive || undefined}>
        <a
          href="#origen"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-calido focus:px-4 focus:py-2"
        >
          {t.common.skip}
        </a>
        <SideNav />
        {children}
      </div>
    </>
  )
}
