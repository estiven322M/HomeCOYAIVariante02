import { Hero } from '@/features/home/components/Hero'
import { Colaborar, Explora, Footer, Proyecto, QueEs } from '@/features/home/components/Sections'
import { Nosotros } from '@/features/nosotros/components/Nosotros'

/** Página de inicio: solo ensambla secciones. */
export function HomePage() {
  return (
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
  )
}
