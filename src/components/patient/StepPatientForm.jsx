import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { INSURANCE_OPTIONS } from '../../data/mockDoctors'

function formatTime(time) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-body font-semibold text-brand-text mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500 font-body">{error}</p>}
    </div>
  )
}

const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-lg border font-body text-sm text-brand-text bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
    hasError ? 'border-red-400 bg-red-50' : 'border-brand-border hover:border-brand-muted'
  }`

export default function StepPatientForm({ doctor, date, time, onSubmit, onBack }) {
  const [form, setForm] = useState({
    name: '', dob: '', email: '', phone: '', reason: '', insurance: '',
  })
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required.'
    if (!form.dob) e.dob = 'Date of birth is required.'
    if (!form.email.trim()) e.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address.'
    if (!form.phone.trim()) e.phone = 'Phone number is required.'
    if (!form.reason.trim()) e.reason = 'Please describe your reason for visiting.'
    if (!form.insurance) e.insurance = 'Please select an insurance option.'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`
    onSubmit({
      id: bookingId,
      physicianId: doctor.id,
      physicianName: doctor.name,
      physicianSpecialty: doctor.specialty,
      date,
      time,
      patient: { ...form },
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-body text-brand-muted hover:text-primary mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to schedule
      </button>

      <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-7 text-sm font-body">
        <p className="font-semibold text-primary leading-snug">
          {doctor.name}
          <span className="font-normal text-primary/70"> · {doctor.specialty}</span>
        </p>
        <p className="text-brand-muted mt-1">
          {format(parseISO(date), 'EEE, MMM d, yyyy')} at {formatTime(time)}
        </p>
      </div>

      <h3 className="font-display text-2xl font-semibold text-primary mb-6">Your Details</h3>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Full Name" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Jane Smith"
              className={inputClass(!!errors.name)}
            />
          </Field>
          <Field label="Date of Birth" error={errors.dob}>
            <input
              type="date"
              value={form.dob}
              onChange={e => set('dob', e.target.value)}
              className={inputClass(!!errors.dob)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Email Address" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="jane@example.com"
              className={inputClass(!!errors.email)}
            />
          </Field>
          <Field label="Phone Number" error={errors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="416-555-0100"
              className={inputClass(!!errors.phone)}
            />
          </Field>
        </div>

        <Field label="Reason for Visit" error={errors.reason}>
          <textarea
            value={form.reason}
            onChange={e => set('reason', e.target.value)}
            placeholder="Briefly describe your symptoms or the purpose of this visit…"
            rows={3}
            className={inputClass(!!errors.reason)}
          />
        </Field>

        <Field label="Insurance Provider" error={errors.insurance}>
          <select
            value={form.insurance}
            onChange={e => set('insurance', e.target.value)}
            className={inputClass(!!errors.insurance)}
          >
            <option value="">Select insurance…</option>
            {INSURANCE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </Field>

        <button
          type="submit"
          className="w-full bg-primary text-white font-body font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-colors mt-2"
        >
          Confirm Booking Request
        </button>
      </form>
    </div>
  )
}
