import { useLayoutEffect, useRef } from 'react'
import { useLang } from '@/shared/i18n'
import { reducedMotion, useIntro } from '@/shared/intro/intro-context'

/** Brand screen over the (already loading) hero video. Only transform/opacity are animated. */
export function Intro() {
  const { phase, skip } = useIntro()
  const { t } = useLang()
  const i = t.intro
  const logoRef = useRef<HTMLImageElement>(null)
  const leaving = phase === 'leaving'

  // Fly the wordmark to the header logo: measured delta, applied as a single transform.
  useLayoutEffect(() => {
    if (!leaving || reducedMotion()) return
    const from = logoRef.current
    const to = document.getElementById('header-logo')
    if (!from || !to) return
    const a = from.getBoundingClientRect()
    const b = to.getBoundingClientRect()
    const s = b.width / a.width
    from.style.transform = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(${s})`
  }, [leaving])

  if (phase !== 'active' && phase !== 'leaving') return null
  return (
    <div
      role="region"
      aria-label={i.aria}
      className="intro-root fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
    >
      <div className="intro-veil absolute inset-0" data-leaving={leaving} aria-hidden />

      <button
        type="button"
        onClick={skip}
        data-leaving={leaving}
        className="intro-skip intro-fade absolute right-5 top-5 z-10 px-2 py-1 text-[11px] uppercase tracking-[0.25em] underline-offset-4 hover:underline lg:right-8 lg:top-6"
      >
        {i.skip}
      </button>

      <div className="relative flex flex-col items-center">
        <img
          src="/branding/tigre.png"
          alt={i.tigerAlt}
          data-leaving={leaving}
          className="intro-fade h-[140px] w-auto"
        />
        <img
          ref={logoRef}
          src="/branding/ecoyai_titulo.svg"
          alt="ÉCOYAI"
          data-leaving={leaving}
          className="intro-logo-travel mt-8 w-[280px] max-w-[70vw]"
        />
        <p
          data-leaving={leaving}
          className="intro-phrase intro-fade mt-6 text-center font-serif text-lg font-light italic"
          style={{ textAlign: 'center' }}
        >
          {i.phrase}
        </p>
      </div>

      <div data-leaving={leaving} className="intro-fade absolute inset-x-0 bottom-10 flex flex-col items-center gap-3">
        <div className="intro-bar h-0.5 w-40 overflow-hidden" role="progressbar" aria-label={i.loading}>
          <span className="block h-full w-full" />
        </div>
        <p className="intro-label text-[10px] uppercase tracking-[0.3em]" style={{ textAlign: 'center' }}>
          {i.loading}
        </p>
      </div>
    </div>
  )
}
