import { useState, useMemo, useCallback } from 'react'
import Header from './components/Header'
import DashboardCard from './components/DashboardCard'
import SubjectCard from './components/SubjectCard'
import AddSubjectModal from './components/AddSubjectModal'
import { useSubjects } from './hooks/useSubjects'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'theory', label: 'Theory' },
  { key: 'lab', label: 'Lab' },
]

export default function App() {
  const {
    subjects,
    addSubject,
    removeSubject,
    incrementAttended,
    incrementTotal,
    reorderSubjects,
    totalAttended,
    totalClasses,
    overallPercentage,
  } = useSubjects()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [dragIndex, setDragIndex] = useState(null)
  const [target, setTarget] = useState(() => {
    try {
      return Number(localStorage.getItem('epic-attendance-target')) || 75
    } catch {
      return 75
    }
  })

  const handleTargetChange = (newTarget) => {
    setTarget(newTarget)
    localStorage.setItem('epic-attendance-target', newTarget)
  }

  // Filtered subjects for display
  const filteredSubjects = useMemo(() => {
    if (filter === 'all') return subjects
    return subjects.filter(s => (s.type || 'theory') === filter)
  }, [subjects, filter])

  // Filter counts
  const theoryCt = subjects.filter(s => (s.type || 'theory') === 'theory').length
  const labCt = subjects.filter(s => (s.type || 'theory') === 'lab').length

  // Drag and drop handlers — work on the full subjects array indices
  const handleDragStart = useCallback((e, index) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    // Store the real index in subjects array
    e.dataTransfer.setData('text/plain', index.toString())
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((e, toIndex) => {
    e.preventDefault()
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
    if (fromIndex !== toIndex && !isNaN(fromIndex)) {
      reorderSubjects(fromIndex, toIndex)
    }
    setDragIndex(null)
  }, [reorderSubjects])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
  }, [])

  return (
    <div className="bg-mesh min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <Header target={target} onTargetChange={handleTargetChange} />

        {/* Dashboard summary */}
        <div className="mb-8">
          <DashboardCard
            overallPercentage={overallPercentage}
            totalAttended={totalAttended}
            totalClasses={totalClasses}
            subjectCount={subjects.length}
          />
        </div>

        {/* Subjects section header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">
              Your Subjects
              {subjects.length > 0 && (
                <span className="text-white/30 text-sm font-normal ml-2">({subjects.length})</span>
              )}
            </h2>

            {/* Filter tabs */}
            {subjects.length > 0 && (
              <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5">
                {FILTERS.map(f => {
                  const count = f.key === 'all' ? subjects.length : f.key === 'theory' ? theoryCt : labCt
                  const isActive = filter === f.key
                  return (
                    <button
                      key={f.key}
                      id={`filter-${f.key}`}
                      onClick={() => setFilter(f.key)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-accent-indigo/20 text-accent-indigo'
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {f.label}
                      <span className={`ml-1 ${isActive ? 'text-accent-indigo/60' : 'text-white/20'}`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <button
            id="add-subject-btn"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-accent-indigo/15 hover:bg-accent-indigo/25 text-accent-indigo rounded-xl px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Subject
          </button>
        </div>

        {/* Subject cards grid */}
        {subjects.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in-up">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-white font-semibold mb-1">No subjects yet</h3>
            <p className="text-white/40 text-sm mb-4">
              Add your first subject to start tracking attendance
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent-indigo hover:bg-accent-indigo/80 text-white text-sm font-medium rounded-lg px-5 py-2 transition-colors cursor-pointer"
            >
              + Add Subject
            </button>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="glass-card p-10 text-center animate-fade-in-up">
            <div className="text-3xl mb-2">{filter === 'lab' ? '🧪' : '📖'}</div>
            <p className="text-white/40 text-sm">
              No {filter} subjects yet.{' '}
              <button
                onClick={() => setFilter('all')}
                className="text-accent-indigo hover:underline cursor-pointer"
              >
                Show all
              </button>
            </p>
          </div>
        ) : (
          <>
            {filter === 'all' && subjects.length > 1 && (
              <p className="text-[11px] text-white/20 mb-3 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Drag cards to rearrange
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredSubjects.map((subject) => {
                // Find the real index in the full subjects array for drag reorder
                const realIndex = subjects.findIndex(s => s.id === subject.id)
                return (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    target={target}
                    onIncrement={incrementAttended}
                    onBunk={incrementTotal}
                    onRemove={removeSubject}
                    isDragging={dragIndex === realIndex}
                    onDragStart={(e) => handleDragStart(e, realIndex)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, realIndex)}
                    onDragEnd={handleDragEnd}
                  />
                )
              })}
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-white/20">
          Built with 💜 for college students · EPIC ATTENDANCE &copy; {new Date().getFullYear()}
        </footer>
      </div>

      {/* Add Subject Modal */}
      <AddSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addSubject}
      />
    </div>
  )
}
