const STATUS_CONFIG = {
  pending: {
    label: 'Pending Confirmation',
    className: 'bg-pending-bg text-pending-text border border-yellow-200',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-confirmed-bg text-confirmed-text border border-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-cancelled-bg text-cancelled-text border border-red-200',
  },
}

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-semibold animate-scale-pulse ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  )
}
