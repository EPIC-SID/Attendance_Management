import { useState, useRef, useEffect } from 'react'

export default function AddSubjectModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('')
  const [attended, setAttended] = useState('')
  const [total, setTotal] = useState('')
  const [type, setType] = useState('theory')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setName('')
      setAttended('')
      setTotal('')
      setType('theory')
      // Focus the name input after a short delay for animation
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    const att = parseInt(attended) || 0
    const tot = parseInt(total) || 0

    // total can't be less than attended
    const finalTotal = Math.max(att, tot)

    onAdd(trimmedName, att, finalTotal, type)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={onClose}
    >
      <div
        className="glass-card p-6 w-full max-w-md animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'rgba(18, 18, 26, 0.95)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Add New Subject</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Name */}
          <div>
            <label htmlFor="subject-name" className="block text-sm text-white/50 mb-1.5">
              Subject Name *
            </label>
            <input
              ref={inputRef}
              id="subject-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Data Structures"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/25 transition-colors"
              required
            />
          </div>

          {/* Type Toggle: Theory / Lab */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Type</label>
            <div className="flex rounded-lg overflow-hidden border border-white/[0.08]">
              <button
                type="button"
                id="type-theory"
                onClick={() => setType('theory')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                  type === 'theory'
                    ? 'bg-accent-indigo/20 text-accent-indigo border-r border-accent-indigo/30'
                    : 'bg-white/[0.02] text-white/40 hover:text-white/60 border-r border-white/[0.08]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Theory
              </button>
              <button
                type="button"
                id="type-lab"
                onClick={() => setType('lab')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                  type === 'lab'
                    ? 'bg-accent-violet/20 text-accent-violet'
                    : 'bg-white/[0.02] text-white/40 hover:text-white/60'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Lab
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Classes Attended */}
            <div>
              <label htmlFor="classes-attended" className="block text-sm text-white/50 mb-1.5">
                Attended
              </label>
              <input
                id="classes-attended"
                type="number"
                min="0"
                value={attended}
                onChange={(e) => setAttended(e.target.value)}
                placeholder="0"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/25 transition-colors"
              />
            </div>

            {/* Total Classes */}
            <div>
              <label htmlFor="total-classes" className="block text-sm text-white/50 mb-1.5">
                Total Classes
              </label>
              <input
                id="total-classes"
                type="number"
                min="0"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="0"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/25 transition-colors"
              />
            </div>
          </div>

          <p className="text-xs text-white/30">
            Leave attended &amp; total at 0 to start fresh. You can update as you go.
          </p>

          <button
            type="submit"
            id="submit-add-subject"
            className="w-full bg-accent-indigo hover:bg-accent-indigo/80 text-white font-medium rounded-lg py-2.5 transition-colors cursor-pointer"
          >
            Add Subject
          </button>
        </form>
      </div>
    </div>
  )
}
