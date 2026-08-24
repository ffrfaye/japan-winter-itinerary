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
      <PagerStrip
        side="left"
        label="Previous day"
        glyph="←"
        enabled={canPrev}
        onClick={onPrev}
      />
      <PagerStrip
        side="right"
        label="Next day"
        glyph="→"
        enabled={canNext}
        onClick={onNext}
      />
    </>
  )
}

function PagerStrip({
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
        'group/pager fixed inset-y-0 z-[1] hidden w-24 items-center justify-center md:flex',
        'transition-colors duration-150',
        side === 'left' ? 'left-0 cursor-w-resize' : 'right-0 cursor-e-resize',
        enabled && 'hover:bg-zinc-950/[0.04]',
        !enabled && 'pointer-events-none cursor-default',
      )}
    >
      <span
        className={cn(
          'flex size-14 items-center justify-center rounded-lg border border-zinc-200 bg-white/90 font-medium text-zinc-900 tabular-nums shadow-sm',
          'transition-[opacity,transform,box-shadow,border-color] duration-150',
          'group-focus-visible/pager:ring-2 group-focus-visible/pager:ring-zinc-900',
          enabled
            ? 'scale-100 opacity-[0.28] group-hover/pager:scale-[1.08] group-hover/pager:border-zinc-300 group-hover/pager:opacity-100 group-hover/pager:shadow-md group-active/pager:scale-[0.96] group-active/pager:duration-[80ms]'
            : 'scale-100 opacity-[0.12]',
        )}
      >
        {glyph}
      </span>
    </button>
  )
}
