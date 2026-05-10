import { useState } from 'react'
import { useBookings } from './hooks/useBookings'
import NavBar from './components/shared/NavBar'
import BookingWizard from './components/patient/BookingWizard'
import AdminDashboard from './components/admin/AdminDashboard'
import './index.css'

export default function App() {
  const [view, setView] = useState('patient')
  const { bookings, addBooking, updateBookingStatus } = useBookings()
  const pendingCount = bookings.filter(b => b.status === 'pending').length

  return (
    <div className="min-h-screen bg-brand-bg font-body">
      <NavBar view={view} setView={setView} pendingCount={pendingCount} />
      <main className="max-w-7xl mx-auto">
        {view === 'patient' ? (
          <BookingWizard addBooking={addBooking} bookings={bookings} />
        ) : (
          <AdminDashboard bookings={bookings} updateBookingStatus={updateBookingStatus} />
        )}
      </main>
    </div>
  )
}
