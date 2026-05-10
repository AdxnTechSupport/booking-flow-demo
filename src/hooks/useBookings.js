import { useState } from 'react'
import { SEEDED_BOOKINGS } from '../data/mockBookings'

export function useBookings() {
  const [bookings, setBookings] = useState(SEEDED_BOOKINGS)

  function addBooking(booking) {
    setBookings(prev => [booking, ...prev])
  }

  function updateBookingStatus(id, status) {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status } : b))
    )
  }

  return { bookings, addBooking, updateBookingStatus }
}
