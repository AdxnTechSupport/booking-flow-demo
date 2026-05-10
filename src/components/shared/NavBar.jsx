export default function NavBar({ view, setView, pendingCount }) {
  return (
    <nav className="bg-white border-b border-brand-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2">
            <span className="text-accent text-lg sm:text-xl leading-none">✦</span>
            <span className="font-display text-lg sm:text-xl font-semibold text-primary tracking-wide">
              MedBook
            </span>
          </div>

          <div className="flex items-center bg-brand-bg rounded-lg p-1 border border-brand-border gap-1">
            <NavTab
              label="Book Appointment"
              shortLabel="Patient"
              active={view === 'patient'}
              onClick={() => setView('patient')}
            />
            <NavTab
              label="Admin Dashboard"
              shortLabel="Admin"
              active={view === 'admin'}
              onClick={() => setView('admin')}
              badge={pendingCount > 0 ? pendingCount : null}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavTab({ label, shortLabel, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-body font-semibold transition-all duration-150 ${
        active
          ? 'bg-primary text-white shadow-sm'
          : 'text-brand-muted hover:text-brand-text'
      }`}
    >
      <span className="sm:hidden">{shortLabel}</span>
      <span className="hidden sm:inline">{label}</span>
      {badge !== null && badge !== undefined && (
        <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-xs rounded-full bg-accent text-white font-bold">
          {badge}
        </span>
      )}
    </button>
  )
}
