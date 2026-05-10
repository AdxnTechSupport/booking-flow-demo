function StatCard({ label, value, colorClass, bgClass }) {
  return (
    <div className={`rounded-2xl border border-brand-border shadow-card p-5 ${bgClass}`}>
      <div className={`font-display text-4xl font-bold mb-1 ${colorClass}`}>{value}</div>
      <div className="text-sm font-body text-brand-muted font-medium">{label}</div>
    </div>
  )
}

export default function StatsRow({ bookings }) {
  const total = bookings.length
  const pending = bookings.filter(b => b.status === 'pending').length
  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const cancelled = bookings.filter(b => b.status === 'cancelled').length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard label="Total Bookings" value={total} colorClass="text-primary" bgClass="bg-white" />
      <StatCard label="Pending" value={pending} colorClass="text-pending-text" bgClass="bg-pending-bg/40" />
      <StatCard label="Confirmed" value={confirmed} colorClass="text-sage" bgClass="bg-sage-bg/40" />
      <StatCard label="Cancelled" value={cancelled} colorClass="text-cancelled-text" bgClass="bg-cancelled-bg/40" />
    </div>
  )
}
