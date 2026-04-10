export default function Header({ target, onTargetChange }) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          <span className="bg-gradient-to-r from-accent-indigo to-accent-violet bg-clip-text text-transparent">
            BunkSafe
          </span>
        </h1>
        <p className="text-sm text-white/40 mt-1">Track. Predict. Bunk wisely.</p>
      </div>

      {/* Target selector */}
      <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2">
        <label htmlFor="target-select" className="text-xs text-white/40 whitespace-nowrap">
          Target %
        </label>
        <select
          id="target-select"
          value={target}
          onChange={(e) => onTargetChange(Number(e.target.value))}
          className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer appearance-none"
        >
          <option value={60} className="bg-dark-800">60%</option>
          <option value={65} className="bg-dark-800">65%</option>
          <option value={70} className="bg-dark-800">70%</option>
          <option value={75} className="bg-dark-800">75%</option>
          <option value={80} className="bg-dark-800">80%</option>
          <option value={85} className="bg-dark-800">85%</option>
          <option value={90} className="bg-dark-800">90%</option>
        </select>
      </div>
    </header>
  )
}
