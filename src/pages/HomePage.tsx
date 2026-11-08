import { Hero } from '@/features/home/components/Hero'
import { Colaborar, Explora, Proyecto, QueEs } from '@/features/home/components/Sections'

/** Portada: puerta de entrada al sitio. Solo ensambla secciones (el <main> y el pie los pone app/layout). */
export function HomePage() {
  return (
    <>
      <Hero />
      <div>
        <QueEs />
        <Proyecto />
        <Explora />
        <Colaborar />
      </div>
    </>
  )
}
