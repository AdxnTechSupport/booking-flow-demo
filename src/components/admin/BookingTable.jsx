import { format, parseISO } from 'date-fns'
import StatusBadge from '../shared/StatusBadge'

function formatTime(time) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

function ActionButtons({ booking, updateBookingStatus }) {
  const { status } = booking
  if (status === 'cancelled') {
    return <span className="text-xs font-body text-brand-muted italic">No actions</span>
  }
  return (
    <div className="flex items-center gap-2">
      {status === 'pending' && (
        <button
          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
          className="text-xs font-body font-semibold px-3 py-1.5 rounded-lg border border-sage text-sage hover:bg-sage/10 transition-colors"
        >
          Confirm
        </button>
      )}
      <button
        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
        className="text-xs font-body font-semibold px-3 py-1.5 rounded-lg border border-cancelled-text text-cancelled-text hover:bg-cancelled-bg transition-colors"
      >
        Cancel
      </button>
    </div>
  )
}

// Mobile card — shown below sm breakpoint
function BookingCard({ booking, updateBookingStatus }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-sm font-semibold text-primary">{booking.id}</span>
        <StatusBadge key={booking.status} status={booking.status} />
      </div>

      <div>
        <p className="font-body font-semibold text-brand-text text-sm">{booking.patient.name}</p>
        <p className="text-xs font-body text-brand-muted">{booking.patient.email}</p>
      </div>

      <div className="flex items-center justify-between text-sm font-body border-t border-brand-border pt-3">
        <div>
          <p className="font-semibold text-brand-text text-sm">{booking.physicianName}</p>
          <p className="text-xs font-semibold text-accent uppercase tracking-wider">{booking.physicianSpecialty}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-brand-text">{format(parseISO(booking.date), 'MMM d, yyyy')}</p>
          <p className="text-xs text-brand-muted">{formatTime(booking.time)}</p>
        </div>
      </div>

      <div className="pt-1">
        <ActionButtons booking={booking} updateBookingStatus={updateBookingStatus} />
      </div>
    </div>
  )
}

// Desktop row — shown at sm+ breakpoint
function BookingRow({ booking, updateBookingStatus }) {
  return (
    <tr className="border-b border-brand-border hover:bg-brand-bg/60 transition-colors">
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="font-mono text-sm font-medium text-primary">{booking.id}</span>
      </td>
      <td className="px-4 py-3.5">
        <p className="text-sm font-body font-semibold text-brand-text">{booking.patient.name}</p>
        <p className="text-xs font-body text-brand-muted">{booking.patient.email}</p>
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <p className="text-sm font-body font-semibold text-brand-text">{booking.physicianName}</p>
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="text-xs font-body font-semibold text-accent uppercase tracking-wider">
          {booking.physicianSpecialty}
        </span>
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <p className="text-sm font-body text-brand-text">{format(parseISO(booking.date), 'MMM d, yyyy')}</p>
        <p className="text-xs font-body text-brand-muted">{formatTime(booking.time)}</p>
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <StatusBadge key={booking.status} status={booking.status} />
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <ActionButtons booking={booking} updateBookingStatus={updateBookingStatus} />
      </td>
    </tr>
  )
}

export default function BookingTable({ bookings, updateBookingStatus }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 text-brand-muted font-body">
        <p className="text-lg font-display font-semibold text-primary/40 mb-1">No bookings found</p>
        <p className="text-sm">Try selecting a different filter.</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {bookings.map(booking => (
          <BookingCard
            key={booking.id}
            booking={booking}
            updateBookingStatus={updateBookingStatus}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block rounded-2xl border border-brand-border shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-brand-bg border-b border-brand-border">
              {['Booking ID', 'Patient', 'Physician', 'Specialty', 'Date & Time', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-body font-semibold text-brand-muted uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-border">
            {bookings.map(booking => (
              <BookingRow
                key={booking.id}
                booking={booking}
                updateBookingStatus={updateBookingStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
