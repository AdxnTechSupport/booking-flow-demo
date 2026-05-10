import { useState } from 'react'
import StatsRow from './StatsRow'
import BookingTable from './BookingTable'

const FILTERS = ['All', 'Pending', 'Confirmed', 'Cancelled']

export default function AdminDashboard({ bookings, updateBookingStatus }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? bookings
    : bookings.filter(b => b.status === activeFilter.toLowerCase())

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary mb-1">
          Admin Dashboard
        </h2>
        <p className="text-brand-muted font-body text-sm">
          Manage and update patient appointment requests.
        </p>
      </div>

      <StatsRow bookings={bookings} />

      <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-2 mb-5">
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-body font-semibold border transition-colors ${
              activeFilter === filter
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-brand-muted border-brand-border hover:border-primary hover:text-primary'
            }`}
          >
            {filter}
            <span className={`ml-1.5 text-xs ${activeFilter === filter ? 'opacity-70' : 'text-brand-muted'}`}>
              ({filter === 'All'
                ? bookings.length
                : bookings.filter(b => b.status === filter.toLowerCase()).length})
            </span>
          </button>
        ))}
      </div>

      <BookingTable
        bookings={filtered}
        updateBookingStatus={updateBookingStatus}
      />
    </div>
  )
}
