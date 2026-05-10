function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-accent' : 'text-brand-border'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-brand-muted font-body ml-0.5">{rating}</span>
    </div>
  )
}

export default function StepDoctorSelect({ physicians, selectedDoctor, onSelect }) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary mb-2">
          Choose Your Physician
        </h2>
        <p className="text-brand-muted font-body text-base">
          Select a provider to see their available appointment times.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {physicians.map(physician => {
          const isSelected = selectedDoctor?.id === physician.id
          return (
            <button
              key={physician.id}
              onClick={() => onSelect(physician)}
              className={`physician-card text-left bg-white rounded-2xl border p-5 w-full cursor-pointer ${
                isSelected
                  ? 'shadow-card-selected border-primary'
                  : 'shadow-card border-brand-border hover:shadow-card-hover'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: physician.avatarBg }}
                >
                  {physician.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-brand-text leading-tight">
                    {physician.name}
                  </h3>
                  <span className="text-xs font-body font-semibold text-accent uppercase tracking-wider">
                    {physician.specialty}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-sm text-brand-muted font-body leading-relaxed mb-4">
                {physician.bio}
              </p>

              <div className="flex items-center justify-between gap-2 flex-wrap pt-3 border-t border-brand-border">
                <StarRating rating={physician.rating} />
                <div className="flex items-center gap-2 text-xs font-body text-brand-muted">
                  <span>{physician.yearsExp} yrs exp</span>
                  <span className="text-brand-border">·</span>
                  <span className="text-sage font-semibold">{physician.availableSlots} slots</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
