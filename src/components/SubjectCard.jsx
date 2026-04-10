import { useMemo } from 'react'
import { calculatePrediction, getStatusColor } from '../utils/attendance'

export default function SubjectCard({ subject, target, onIncrement, onBunk, onRemove, onDragStart, onDragOver, onDrop, onDragEnd, isDragging }) {
  const { attended, total, name, id } = subject
  const prediction = useMemo(
    () => calculatePrediction(attended, total, target),
    [attended, total, target]
  )
  const colors = getStatusColor(prediction.status)

  return (
    <div
      className={`glass-card p-4 animate-fade-in-up group transition-all ${isDragging ? 'opacity-40 scale-95' : ''}`}
      style={{ animationDelay: '0.05s' }}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-semibold text-white truncate">{name}</h3>
            {subject.type === 'lab' ? (
              <span className="shrink-0 flex items-center gap-1 bg-accent-violet/15 text-accent-violet px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Lab
              </span>
            ) : (
              <span className="shrink-0 flex items-center gap-1 bg-accent-indigo/15 text-accent-indigo px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Theory
              </span>
            )}
          </div>
          <p className="text-sm text-white/40 mt-0.5">
            {attended} / {total} classes
          </p>
        </div>

        {/* Percentage badge */}
        <div className={`${colors.bg} ${colors.text} px-3 py-1 rounded-full text-sm font-bold shrink-0 ml-3`}>
          {prediction.percentage}%
        </div>
      </div>

      {/* Mini progress bar */}
      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(prediction.percentage, 100)}%`,
            backgroundColor: colors.ring,
            boxShadow: `0 0 8px ${colors.ring}40`,
          }}
        />
      </div>

      {/* Prediction message */}
      <div className={`text-xs ${colors.text} mb-4 min-h-[20px]`}>
        {prediction.required !== null && prediction.required > 0 && (
          <span>📚 Attend <strong>{prediction.required}</strong> more class{prediction.required > 1 ? 'es' : ''} to reach {target}%</span>
        )}
        {prediction.bunkable !== null && prediction.bunkable > 0 && (
          <span>🎉 You can safely bunk <strong>{prediction.bunkable}</strong> class{prediction.bunkable > 1 ? 'es' : ''}!</span>
        )}
        {prediction.bunkable === 0 && prediction.required === null && total > 0 && (
          <span>⚡ Right at the edge — attend next class!</span>
        )}
        {total === 0 && (
          <span className="text-white/30">No classes yet — start tracking!</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          id={`attend-${id}`}
          onClick={() => onIncrement(id)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-safe-green/10 hover:bg-safe-green/20 text-safe-green rounded-lg py-2 px-3 text-sm font-medium transition-colors cursor-pointer"
          title="Mark as Attended (class happened, you went)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Attended
        </button>

        <button
          id={`bunk-${id}`}
          onClick={() => onBunk(id)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-danger-red/10 hover:bg-danger-red/20 text-danger-red rounded-lg py-2 px-3 text-sm font-medium transition-colors cursor-pointer"
          title="Mark as Bunked (class happened, you skipped)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Bunked
        </button>

        <button
          id={`delete-${id}`}
          onClick={() => onRemove(id)}
          className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-white/30 hover:text-danger-red transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          title="Remove subject"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
