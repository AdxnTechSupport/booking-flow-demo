import { format, parseISO } from 'date-fns'
import StatusBadge from '../shared/StatusBadge'

function formatTime(time) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

export default function StepConfirmation({ booking, onReset }) {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-sage-bg flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h2 className="font-display text-3xl font-semibold text-primary mb-2">
        Request Submitted
      </h2>
      <p className="text-brand-muted font-body text-sm mb-8">
        Your appointment request has been received. You will be contacted to confirm.
      </p>

      <div className="bg-white rounded-2xl border border-brand-border shadow-card p-6 text-left mb-6">
        <div className="text-center mb-5 pb-5 border-b border-brand-border">
          <p className="text-xs font-body font-semibold text-brand-muted uppercase tracking-wider mb-1">
            Booking ID
          </p>
          <p className="font-mono text-2xl font-semibold text-primary">{booking.id}</p>
        </div>

        <dl className="space-y-3">
          <Row label="Status">
            <StatusBadge key={booking.status} status={booking.status} />
          </Row>
          <Row label="Physician">{booking.physicianName}</Row>
          <Row label="Specialty">{booking.physicianSpecialty}</Row>
          <Row label="Date">
            {format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')}
          </Row>
          <Row label="Time">{formatTime(booking.time)}</Row>
          <Row label="Patient">{booking.patient.name}</Row>
          <Row label="Insurance">{booking.patient.insurance}</Row>
        </dl>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-primary text-white font-body font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-colors"
      >
        Book Another Appointment
      </button>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-sm font-body text-brand-muted min-w-[80px]">{label}</dt>
      <dd className="text-sm font-body font-semibold text-brand-text text-right">{children}</dd>
    </div>
  )
}
