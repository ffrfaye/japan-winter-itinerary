import type { StatusId } from '../types/trip'

const labels: Record<StatusId, string> = {
  recommended: 'Recommended',
  open: 'Open / TBD',
  locked: 'Locked',
}

export function StatusChip({
  status,
  label,
}: {
  status: StatusId
  label?: string
}) {
  return (
    <span className={`chip ${status}`}>
      <i className={`chip-dot ${status}`} />
      {label ?? labels[status]}
    </span>
  )
}
