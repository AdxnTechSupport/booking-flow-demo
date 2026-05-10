import { useState } from 'react'
import { PHYSICIANS } from '../../data/mockDoctors'
import ProgressBar from '../shared/ProgressBar'
import StepDoctorSelect from './StepDoctorSelect'
import StepTimeSelect from './StepTimeSelect'
import StepPatientForm from './StepPatientForm'
import StepConfirmation from './StepConfirmation'

export default function BookingWizard({ addBooking, bookings }) {
  const [step, setStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  function handleDoctorSelect(doctor) {
    setSelectedDoctor(doctor)
    setStep(2)
  }

  function handleTimeSelect(date, time) {
    setSelectedDate(date)
    setSelectedTime(time)
    setStep(3)
  }

  function handleFormSubmit(booking) {
    addBooking(booking)
    setConfirmedBooking(booking)
    setStep(4)
  }

  function handleReset() {
    setStep(1)
    setSelectedDoctor(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setConfirmedBooking(null)
  }

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <ProgressBar step={step} />

      <div key={step} className="animate-fade-slide-up">
        {step === 1 && (
          <StepDoctorSelect
            physicians={PHYSICIANS}
            selectedDoctor={selectedDoctor}
            onSelect={handleDoctorSelect}
          />
        )}
        {step === 2 && (
          <StepTimeSelect
            doctor={selectedDoctor}
            bookings={bookings}
            onSelect={handleTimeSelect}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepPatientForm
            doctor={selectedDoctor}
            date={selectedDate}
            time={selectedTime}
            onSubmit={handleFormSubmit}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && confirmedBooking && (
          <StepConfirmation
            booking={confirmedBooking}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}
