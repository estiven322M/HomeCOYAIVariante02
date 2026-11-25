import { Eyebrow } from './Eyebrow'

/** Rótulo de subsección: línea ocre + eyebrow. Con `n` (p. ej. «01») el eyebrow queda «01 · Rótulo». */
export function SubTitle({ label, light, n }: { label: string; light?: boolean | 'full'; n?: string }) {
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden className="h-px w-10 bg-ocre" />
      <Eyebrow light={light}>{n ? `${n} · ${label}` : label}</Eyebrow>
    </div>
  )
}
