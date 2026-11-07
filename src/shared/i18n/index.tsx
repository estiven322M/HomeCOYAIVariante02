import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dict, type Content, type Lang } from '@/content'

export type { Lang }

const STORAGE_KEY = 'ecoyai-lang'

/** Saved choice first; otherwise the browser language (any English variant -> 'en'). */
function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    /* storage unavailable */
  }
  const langs =
    typeof navigator !== 'undefined' ? (navigator.languages?.length ? navigator.languages : [navigator.language]) : []
  for (const l of langs) {
    const code = l?.toLowerCase().slice(0, 2)
    if (code === 'en') return 'en'
    if (code === 'es') return 'es'
  }
  return 'es'
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Content }
const LangContext = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const value = useMemo<Ctx>(
    () => ({
      lang,
      t: dict[lang],
      setLang: (l) => {
        setLangState(l)
        try {
          localStorage.setItem(STORAGE_KEY, l)
        } catch {
          /* storage unavailable */
        }
      },
    }),
    [lang],
  )
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}

const NAV_META = [
  { href: '#nosotros' },
  { href: '#proyectos' },
  { href: '#transparencia' },
  { href: '#colaborar' },
  { href: '#contacto' },
]

export function useNav() {
  const { t } = useLang()
  return NAV_META.map((m, i) => ({ ...m, ...t.nav[i] }))
}

/** Switch-style toggle: ES on the left, EN on the right. */
export function LangSwitch({ className = 'relative inline-flex' }: { className?: string }) {
  const { lang, setLang, t } = useLang()
  const isEn = lang === 'en'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEn}
      aria-label={t.switchLabel}
      onClick={() => setLang(isEn ? 'es' : 'en')}
      className={`h-8 w-[4.5rem] shrink-0 items-center rounded-full border border-calido/40 bg-selva/50 text-[11px] font-medium tracking-[0.15em] backdrop-blur-[6px] transition-colors duration-500 hover:border-calido ${className}`}
    >
      <span
        aria-hidden
        className={`absolute left-0.5 top-0.5 h-6 w-8 rounded-full bg-(color:--ambar) transition-transform duration-500 ${isEn ? 'translate-x-[2.25rem]' : ''}`}
      />
      <span
        aria-hidden
        className={`relative z-10 w-1/2 text-center transition-colors duration-500 ${isEn ? 'text-(color:--niebla)' : 'text-(color:--selva)'}`}
      >
        ES
      </span>
      <span
        aria-hidden
        className={`relative z-10 w-1/2 text-center transition-colors duration-500 ${isEn ? 'text-(color:--selva)' : 'text-(color:--niebla)'}`}
      >
        EN
      </span>
    </button>
  )
}
