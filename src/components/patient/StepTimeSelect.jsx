import { useState } from 'react'
import { addDays, format, isWeekend, parseISO } from 'date-fns'
import { SLOT_TIMES } from '../../data/mockDoctors'

function getAvailableDates() {
  const dates = []
  let cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  while (dates.length < 14) {
    cursor = addDays(cursor, 1)
    if (!isWeekend(cursor)) {
      dates.push(format(cursor, 'yyyy-MM-dd'))
    }
  }
  return dates
}

function formatTime(time) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

const AVAILABLE_DATES = getAvailableDates()

export default function StepTimeSelect({ doctor, bookings, onSelect, onBack }) {
  const [selectedDate, setSelectedDate] = useState(null)

  function isSlotBooked(date, time) {
    return bookings.some(
      b =>
        b.physicianId === doctor.id &&
        b.date === date &&
        b.time === time &&
        (b.status === 'pending' || b.status === 'confirmed')
    )
  }

  function handleTimeSelect(time) {
    onSelect(selectedDate, time)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-body text-brand-muted hover:text-primary mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to physicians
      </button>

      <div className="bg-white rounded-2xl border border-brand-border shadow-card px-4 py-3 mb-6 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: doctor.avatarBg }}
        >
          {doctor.initials}
        </div>
        <div>
          <p className="font-display font-semibold text-brand-text text-base leading-tight">{doctor.name}</p>
          <p className="text-xs font-body text-accent font-semibold uppercase tracking-wider">{doctor.specialty}</p>
        </div>
      </div>

      <h3 className="font-display text-xl font-semibold text-primary mb-3">Select a Date</h3>
      <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mb-7">
        {AVAILABLE_DATES.map(date => {
          const d = parseISO(date)
          const isSelected = date === selectedDate
          return (
            <button
              key={date}
              onClick={() => { setSelectedDate(date) }}
              className={`date-chip flex-shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border text-sm font-body font-semibold min-w-[60px] ${
                isSelected
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-brand-text border-brand-border hover:border-primary hover:text-primary'
              }`}
            >
              <span className={`text-xs font-normal mb-0.5 ${isSelected ? 'text-white/70' : 'text-brand-muted'}`}>
                {format(d, 'EEE')}
              </span>
              <span>{format(d, 'd')}</span>
              <span className={`text-xs font-normal ${isSelected ? 'text-white/70' : 'text-brand-muted'}`}>
                {format(d, 'MMM')}
              </span>
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="animate-fade-slide-up">
          <h3 className="font-display text-xl font-semibold text-primary mb-4">
            Available Times — {format(parseISO(selectedDate), 'MMMM d, yyyy')}
          </h3>
          {Object.entries(SLOT_TIMES).map(([period, times]) => {
            const available = times.filter(t => !isSlotBooked(selectedDate, t))
            if (available.length === 0) return null
            return (
              <div key={period} className="mb-5">
                <p className="text-xs font-body font-semibold text-brand-muted uppercase tracking-wider mb-2 capitalize">
                  {period}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {available.map(time => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className="time-slot-btn px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm font-body font-semibold text-brand-text hover:border-primary hover:text-primary hover:bg-primary/5"
                    >
                      {formatTime(time)}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!selectedDate && (
        <p className="text-center text-brand-muted font-body text-sm py-6">
          Select a date above to see available times.
        </p>
      )}
    </div>
  )
}
