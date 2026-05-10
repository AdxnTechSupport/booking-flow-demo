const STEPS = ['Physician', 'Schedule', 'Details', 'Confirmation']

export default function ProgressBar({ step }) {
  return (
    <div className="flex items-center justify-center mb-8 sm:mb-10">
      {STEPS.map((label, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < step
        const isActive = stepNum === step

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-body font-semibold transition-all duration-200 ${
                  isCompleted
                    ? 'bg-primary text-white'
                    : isActive
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-brand-border text-brand-muted'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`mt-1.5 text-xs font-body font-medium hidden sm:block ${
                  isActive ? 'text-primary' : isCompleted ? 'text-primary/60' : 'text-brand-muted'
                }`}
              >
                {label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={`w-6 xs:w-10 sm:w-16 lg:w-24 h-px mx-1.5 sm:mx-2 mb-0 sm:mb-5 transition-colors duration-200 ${
                  isCompleted ? 'bg-primary' : 'bg-brand-border'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
