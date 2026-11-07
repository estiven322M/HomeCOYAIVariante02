import type { ReactNode } from 'react'
import { Links, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router'
import { LangFromUrl } from '@/shared/i18n'
import { langFromPath } from '@/shared/i18n/routes'
import { INTRO_BOOT_SCRIPT } from '@/shared/intro/boot-script'
import { IntroProvider } from '@/shared/intro/intro-context'
import '@/shared/styles/index.css'
import { DocumentHead } from './DocumentHead'
import { ErrorBoundary } from './ErrorBoundary'
import { RootLayout } from './layout/RootLayout'

/**
 * Documento HTML de TODAS las rutas. Se renderiza en Node al construir (prerender) y se hidrata en el cliente:
 * aquí no puede haber window, sessionStorage, localStorage, navigator ni matchMedia durante el render.
 */
export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    // suppressHydrationWarning: el script de <head> añade data-intro a <html> antes de hidratar (ver boot-script.ts).
    <html lang={langFromPath(pathname)} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
        <DocumentHead pathname={pathname} />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return (
    <ErrorBoundary>
      <LangFromUrl>
        <IntroProvider>
          <RootLayout>
            <Outlet />
          </RootLayout>
        </IntroProvider>
      </LangFromUrl>
    </ErrorBoundary>
  )
}
