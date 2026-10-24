// ÉCOYAI — Home / Variante 02 / Inmersiva Territorial
import { Hero } from './components/Hero'
import { SideNav } from './components/SideNav'
import { Colaborar, Explora, Footer, MisionVision, Proyecto, QueEs } from './components/Sections'

export default function App() {
  return (
    <>
      <a href="#que-es" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-calido focus:px-4 focus:py-2">Saltar al contenido</a>
      <SideNav />
      <main>
        <Hero />
        <div className="lg:pl-72">
          <QueEs />
          <MisionVision />
          <Proyecto />
          <Explora />
          <Colaborar />
          <Footer />
        </div>
      </main>
    </>
  )
}
