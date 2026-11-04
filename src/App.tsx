// ÉCOYAI — Home / Variante 02 / Inmersiva Territorial
import { Hero } from './components/Hero'
import { SideNav } from './components/SideNav'
import { Colaborar, Explora, Footer, Proyecto, QueEs } from './components/Sections'
import { Nosotros } from './components/Nosotros'
import { Intro, IntroProvider, useIntro } from './components/Intro'
import { LangProvider, useLang } from './i18n'

function Page() {
  const { t } = useLang()
  const { phase } = useIntro()
  const introActive = phase === 'active' || phase === 'leaving'
  return (
    <>
      <Intro />
      <div inert={introActive} aria-hidden={introActive || undefined}>
      <a href="#que-es" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-calido focus:px-4 focus:py-2">{t.skip}</a>
      <SideNav />
      <main>
        <Hero />
        <div>
          <QueEs />
          <Nosotros />
          <Proyecto />
          <Explora />
          <Colaborar />
          <Footer />
        </div>
      </main>
      </div>
    </>
  )
}

export default function App() {
  return <LangProvider><IntroProvider><Page /></IntroProvider></LangProvider>
}
