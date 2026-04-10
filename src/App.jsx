import { useState } from 'react'
import Header from './components/Header'
import DashboardCard from './components/DashboardCard'
import SubjectCard from './components/SubjectCard'
import AddSubjectModal from './components/AddSubjectModal'
import { useSubjects } from './hooks/useSubjects'

export default function App() {
  const {
    subjects,
    addSubject,
    removeSubject,
    incrementAttended,
    incrementTotal,
    totalAttended,
    totalClasses,
    overallPercentage,
  } = useSubjects()

  const [isModalOpen, setIsModalOpen] = useState(false)
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

  return (
    <div className="bg-mesh min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
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

        {/* Subjects section */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">
            Your Subjects
            {subjects.length > 0 && (
              <span className="text-white/30 text-sm font-normal ml-2">({subjects.length})</span>
            )}
          </h2>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((subject, i) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                target={target}
                onIncrement={incrementAttended}
                onBunk={incrementTotal}
                onRemove={removeSubject}
              />
            ))}
          </div>
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
