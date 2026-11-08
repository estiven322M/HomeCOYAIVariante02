import { Eyebrow } from './Eyebrow'

/** Rótulo de subsección: línea ocre + eyebrow. */
export function SubTitle({ label, light }: { label: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px w-10 bg-ocre" />
      <Eyebrow light={light}>{label}</Eyebrow>
    </div>
  )
}
