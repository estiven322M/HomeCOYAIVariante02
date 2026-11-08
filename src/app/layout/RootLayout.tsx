import type { ReactNode } from 'react'
import { useLang } from '@/shared/i18n'
import { useIntro } from '@/shared/intro/intro-context'
import { Footer } from './Footer'
import { FocusOnNavigate } from './FocusOnNavigate'
import { Intro } from './Intro'
import { SideNav } from './SideNav'

/** Estructura global: intro, enlace de salto, menú lateral, contenido de la página y pie. */
export function RootLayout({ children }: { children: ReactNode }) {
  const { t } = useLang()
  const { phase } = useIntro()
  const introActive = phase === 'active' || phase === 'leaving'
  return (
    <>
      <Intro />
      <div inert={introActive} aria-hidden={introActive || undefined}>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-calido focus:px-4 focus:py-2"
        >
          {t.common.skip}
        </a>
        <SideNav />
        <FocusOnNavigate />
        {/* tabIndex -1: el destino del salto y del foco programático. Una sola <main> por página. */}
        <main id="contenido" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
