import { Reveal } from '@/shared/ui/Reveal'
import { SubTitle } from '@/shared/ui/SubTitle'
import { useLang } from '@/shared/i18n'

/**
 * Transparencia y Gobernanza: hoy, el marco legal y los documentos de la asociación (antes vivían en Nosotros).
 * Un documento sin archivo se muestra como texto («por cargar»): sin enlace, sin icono ni flecha, para que no
 * parezca descargable. Cuando tenga `url` pasa a ser un enlace de descarga real.
 */
export function Transparencia() {
  const { t } = useLang()
  const g = t.transparencia.legal
  return (
    <>
      <section className="bg-calido px-6 pb-16 pt-28 lg:pt-40">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h1 className="font-serif text-5xl font-light leading-[1.02] lg:text-7xl">{t.common.nav[2]?.label}</h1>
          </Reveal>
        </div>
      </section>

      <section id="marco-legal" className="scroll-mt-20 bg-crema px-6 py-28 lg:py-36">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <SubTitle label={g.label} />
            <h2 className="mt-8 font-serif text-4xl font-light leading-[1.08] lg:text-5xl">{g.title}</h2>
            <p className="mt-8 text-[17px] leading-relaxed text-carbon/80">{g.text}</p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {g.badges.map((b) => (
                <li
                  key={b}
                  className="border border-bosque/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-bosque"
                >
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={200} className="lg:col-span-5 lg:col-start-8">
            <div className="bg-calido p-8 lg:p-10">
              <h3 className="font-serif text-2xl font-light">{g.docsTitle}</h3>
              <ul className="mt-6 border-t border-carbon/20">
                {g.docs.map((d) => (
                  <li key={d.name} className="border-b border-carbon/20">
                    {d.url ? (
                      <a
                        href={d.url}
                        download
                        className="group flex items-center justify-between gap-4 py-5 transition-all duration-500 hover:bg-selva hover:px-4 hover:text-calido"
                      >
                        <span className="block text-[15px]">{d.name}</span>
                        <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-tierra group-hover:text-ocre">
                          PDF{' '}
                          <span
                            aria-hidden
                            className="text-lg transition-transform duration-500 group-hover:translate-y-0.5"
                          >
                            ↓
                          </span>
                        </span>
                      </a>
                    ) : (
                      <div className="py-5">
                        <span className="block text-[15px]">{d.name}</span>
                        <span className="mt-1 block text-xs text-carbon/60">{g.pending}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
