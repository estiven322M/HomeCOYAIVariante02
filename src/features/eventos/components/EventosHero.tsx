import { useBackgroundVideo } from '@/shared/hooks/useBackgroundVideo'
import { useLang } from '@/shared/i18n'
import { BackgroundVideo } from '@/shared/ui/BackgroundVideo'
import { ImagePlaceholder } from '@/shared/ui/ImagePlaceholder'
import { VideoToggle } from '@/shared/ui/VideoToggle'
import { HERO_MEDIA, type HeroMedia } from '@/features/eventos/media'

/**
 * Hero de Eventos: el texto nunca va sobre las bailarinas. Hasta `xl`, el video arriba y el texto debajo sobre fondo
 * sólido; desde `xl`, el texto a la izquierda y el video en una caja a la derecha (desde el 42 %), fundida con el fondo.
 *
 * El encuadre es el mismo en todos los anchos (`.eventos-encuadre`). La cámara se mueve: a lo largo del bucle las
 * bailarinas ocupan del 6 % al 89 % del ancho del video, así que la caja debe enseñar al menos el 83 %. Por eso su
 * proporción nunca baja de ~3:2 (en móvil, `aspect-[3/2]`; desde `xl`, la altura sale del ancho de la ventana).
 */
export function EventosHero({ media = HERO_MEDIA }: { media?: HeroMedia }) {
  const { t } = useLang()
  const h = t.eventos.hero

  return (
    <section
      aria-labelledby="eventos-titulo"
      className="hero-scope relative overflow-hidden bg-huito pt-(--header-h) xl:h-[clamp(31rem,39.3vw,42.5rem)] xl:pt-0"
    >
      <div aria-hidden className="eventos-textura" />
      <div className="relative aspect-[3/2] md:aspect-video xl:absolute xl:inset-y-0 xl:right-0 xl:left-[42%] xl:aspect-auto">
        {media.video ? <HeroVideo media={media} /> : <HeroFijo media={media} />}
      </div>
      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-8 xl:flex xl:h-full xl:flex-col xl:justify-end xl:pb-20 xl:pt-0">
        {/* Desde xl el texto termina antes de la caja del video (42 % de la ventana menos el margen izquierdo). */}
        <div className="xl:max-w-[min(28rem,calc(42vw-max(1.5rem,50vw-34.5rem)))]">
          <div aria-hidden className="rombos-separador w-[7.5rem] opacity-100" />
          <p className="hero-eyebrow mt-6 text-caption uppercase tracking-[0.3em]">{h.eyebrow}</p>
          <h1
            id="eventos-titulo"
            className="hero-title mt-6 font-serif text-display-sm font-light tracking-tight md:text-display"
          >
            {h.title}
          </h1>
          <p className="hero-text mt-6 max-w-[28rem] text-balance font-serif text-lead-sm font-light italic md:text-lead">
            {h.subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * Velos y botón van después del video. Hasta `xl` el botón va justo DEBAJO de la caja (dentro taparía a las bailarinas);
 * desde `xl`, en su esquina inferior derecha, sobre el público.
 */
function HeroVideo({ media }: { media: HeroMedia }) {
  const { t } = useLang()
  const video = useBackgroundVideo()
  return (
    <>
      <div className="eventos-encuadre absolute inset-0">
        <BackgroundVideo video={video} sources={media.sources} poster={media.posterSrc} />
      </div>
      <div aria-hidden className="eventos-velo pointer-events-none absolute inset-0" />
      <VideoToggle
        video={video}
        labels={t.common.video}
        className="absolute right-6 top-full z-10 mt-3 xl:bottom-6 xl:right-8 xl:top-auto xl:mt-0"
      />
    </>
  )
}

function HeroFijo({ media }: { media: HeroMedia }) {
  return (
    <>
      {media.poster ? (
        <img
          src={media.posterSrc}
          alt=""
          width={1024}
          height={576}
          fetchPriority="high"
          decoding="async"
          className="eventos-encuadre-img absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <ImagePlaceholder tone="huito" />
      )}
      <div aria-hidden className="eventos-velo pointer-events-none absolute inset-0" />
    </>
  )
}
