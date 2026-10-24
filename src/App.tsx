// ÉCOYAI — Home / Variante 02 / Inmersiva Territorial
import { Hero } from './components/Hero'
import { SideNav } from './components/SideNav'
import { Colaborar, Explora, Footer, Proyecto, QueEs } from './components/Sections'
import { Nosotros } from './components/Nosotros'
import { LangProvider, useLang } from './i18n'

function Page() {
  const { t } = useLang()
  return (
    <>
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
    </>
  )
}

export default function App() {
  return <LangProvider><Page /></LangProvider>
}
