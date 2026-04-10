import CircularProgress from './CircularProgress'

export default function DashboardCard({ overallPercentage, totalAttended, totalClasses, subjectCount }) {
  const color =
    overallPercentage >= 75 ? '#34d399' :
    overallPercentage >= 65 ? '#fbbf24' : '#f87171'

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Circular Progress */}
        <CircularProgress percentage={overallPercentage} size={140} strokeWidth={10} color={color} />

        {/* Stats */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-white mb-1">Overall Attendance</h2>
          <p className="text-white/50 text-sm mb-4">Across all your subjects</p>

          <div className="grid grid-cols-3 gap-4">
            <StatBox label="Subjects" value={subjectCount} />
            <StatBox label="Attended" value={totalAttended} />
            <StatBox label="Total" value={totalClasses} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white/[0.03] rounded-lg p-3 text-center">
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="text-xs text-white/40 mt-0.5">{label}</div>
    </div>
  )
}
