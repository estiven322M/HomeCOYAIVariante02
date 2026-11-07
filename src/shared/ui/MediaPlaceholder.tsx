/** Placeholder for documentary photography / footage until real assets are provided. */
export function MediaPlaceholder({ label, tone = 'forest', className = '' }: { label: string; tone?: 'forest' | 'earth' | 'river'; className?: string }) {
  const bg = {
    forest: 'radial-gradient(120% 90% at 30% 20%, #718b5a 0%, #4e6b3a 45%, #1c2233 100%)',
    earth: 'radial-gradient(120% 90% at 70% 30%, #c96a4a 0%, #9e3b22 50%, #1c2233 100%)',
    river: 'radial-gradient(100% 80% at 50% 60%, #d8c8ac 0%, #4e6b3a 50%, #1c2233 100%)',
  }[tone]
  return (
    <div role="img" aria-label={label} className={`relative overflow-hidden ${className}`} style={{ background: bg }}>
      <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'repeating-radial-gradient(circle at 20% 30%, transparent 0 18px, rgba(255,255,255,.06) 19px 20px)' }} />
      <span className="absolute bottom-4 left-4 right-4 text-[10px] uppercase tracking-[0.25em] text-calido/70">[{label}]</span>
    </div>
  )
}
