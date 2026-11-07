// ÉCOYAI — Home / Variante 02 / Inmersiva Territorial
import { IntroProvider } from '@/shared/intro/intro-context'
import { LangProvider } from '@/shared/i18n'
import { HomePage } from '@/pages/HomePage'
import { RootLayout } from './layout/RootLayout'

export default function App() {
  return (
    <LangProvider>
      <IntroProvider>
        <RootLayout>
          <HomePage />
        </RootLayout>
      </IntroProvider>
    </LangProvider>
  )
}
