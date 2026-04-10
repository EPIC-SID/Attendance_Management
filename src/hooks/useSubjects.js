import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'epic-attendance-subjects'

function loadSubjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupted data, reset */ }
  return []
}

export function useSubjects() {
  const [subjects, setSubjects] = useState(loadSubjects)

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects))
  }, [subjects])

  const addSubject = useCallback((name, attended = 0, total = 0, type = 'theory') => {
    setSubjects(prev => [
      ...prev,
      { id: Date.now().toString(), name, attended, total, type }
    ])
  }, [])

  const removeSubject = useCallback((id) => {
    setSubjects(prev => prev.filter(s => s.id !== id))
  }, [])

  const incrementAttended = useCallback((id) => {
    setSubjects(prev => prev.map(s =>
      s.id === id ? { ...s, attended: s.attended + 1, total: s.total + 1 } : s
    ))
  }, [])

  const incrementTotal = useCallback((id) => {
    setSubjects(prev => prev.map(s =>
      s.id === id ? { ...s, total: s.total + 1 } : s
    ))
  }, [])

  const updateSubject = useCallback((id, updates) => {
    setSubjects(prev => prev.map(s =>
      s.id === id ? { ...s, ...updates } : s
    ))
  }, [])

  const reorderSubjects = useCallback((fromIndex, toIndex) => {
    setSubjects(prev => {
      const updated = [...prev]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return updated
    })
  }, [])

  // Computed overall stats
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0)
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0)
  const overallPercentage = totalClasses > 0
    ? Math.round((totalAttended / totalClasses) * 100)
    : 0

  return {
    subjects,
    addSubject,
    removeSubject,
    incrementAttended,
    incrementTotal,
    updateSubject,
    reorderSubjects,
    totalAttended,
    totalClasses,
    overallPercentage,
  }
}
