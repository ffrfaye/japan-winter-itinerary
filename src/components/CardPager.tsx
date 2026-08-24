import { cn } from '@/lib/utils'

export function CardPager({
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <>
      <PagerKey
        side="left"
        label="Previous day"
        glyph="←"
        enabled={canPrev}
        onClick={onPrev}
      />
      <PagerKey
        side="right"
        label="Next day"
        glyph="→"
        enabled={canNext}
        onClick={onNext}
      />
    </>
  )
}

function PagerKey({
  side,
  label,
  glyph,
  enabled,
  onClick,
}: {
  side: 'left' | 'right'
  label: string
  glyph: string
  enabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      tabIndex={enabled ? 0 : -1}
      aria-label={label}
      disabled={!enabled}
      onClick={onClick}
      className={cn(
        'absolute top-0 z-10 hidden size-14 min-h-11 min-w-11 items-center justify-center rounded-lg border bg-white font-medium text-zinc-900 tabular-nums shadow-sm md:flex',
        'transition-[opacity,transform,box-shadow,border-color] duration-150',
        side === 'left' ? 'right-full mr-3' : 'left-full ml-3',
        enabled
          ? 'border-zinc-200 opacity-[0.55] hover:scale-[1.06] hover:border-zinc-400 hover:opacity-100 hover:shadow-md focus-visible:scale-[1.06] focus-visible:border-zinc-400 focus-visible:opacity-100 focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-zinc-900'
          : 'pointer-events-none border-zinc-200 opacity-[0.15]',
      )}
    >
      {glyph}
    </button>
  )
}
