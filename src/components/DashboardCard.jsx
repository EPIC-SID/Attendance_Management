import CircularProgress from './CircularProgress'
import { calculatePrediction, getStatusColor } from '../utils/attendance'

export default function DashboardCard({ overallPercentage, totalAttended, totalClasses, subjectCount, target }) {
  // Use the same prediction engine for overall stats
  const prediction = calculatePrediction(totalAttended, totalClasses, target || 75)
  const colors = getStatusColor(prediction.status)

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in-up relative overflow-hidden">
      {/* Dynamic Background Glow based on Status */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-500"
        style={{ background: `radial-gradient(circle at top right, ${colors.ring}, transparent 50%)` }}
      />
      <div 
        className="absolute top-0 left-0 w-full h-1 opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${colors.ring}, transparent)` }}
      />

      <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
        {/* Circular Progress */ }
        <CircularProgress percentage={overallPercentage} size={140} strokeWidth={10} color={colors.ring} />

        {/* Stats */}
        <div className="flex-1 text-center sm:text-left w-full">
          <h2 className="text-xl font-bold text-white mb-1">Overall Attendance</h2>
          <p className="text-white/50 text-sm mb-4">Across all your subjects</p>

          <div className="grid grid-cols-3 gap-4">
            <StatBox label="Subjects" value={subjectCount} />
            <StatBox label="Attended" value={totalAttended} />
            <StatBox label="Total" value={totalClasses} />
          </div>

          {totalClasses > 0 && (
            <div className={`mt-5 text-sm font-medium ${colors.text} bg-white/[0.02] border border-white/[0.05] px-4 py-3 rounded-xl inline-flex w-full text-center sm:text-left shadow-inner`}>
              <div className="mx-auto sm:mx-0">
                {prediction.required !== null && prediction.required > 0 && (
                  <span>📚 Attend <strong className="text-white mx-0.5">{prediction.required}</strong> more class{prediction.required > 1 ? 'es' : ''} overall to hit {target}%</span>
                )}
                {prediction.bunkable !== null && prediction.bunkable > 0 && (
                  <span>🎉 You can safely bunk <strong className="text-white mx-0.5">{prediction.bunkable}</strong> class{prediction.bunkable > 1 ? 'es' : ''} across all subjects!</span>
                )}
                {prediction.bunkable === 0 && prediction.required === null && (
                  <span>⚡ You're right on the edge globally — keep attending!</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-center hover:-translate-y-1 hover:bg-white/[0.08] hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-default">
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="text-xs text-white/40 mt-0.5">{label}</div>
    </div>
  )
}
