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

  const exportSubjects = useCallback(() => {
    const data = JSON.stringify(subjects, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `epic-attendance-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [subjects])

  const importSubjects = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result)
          if (!Array.isArray(parsed)) {
            reject(new Error('Invalid file format'))
            return
          }
          // Validate and normalize each subject
          const validated = parsed.map((s, i) => ({
            id: s.id || Date.now().toString() + i,
            name: s.name || `Subject ${i + 1}`,
            attended: typeof s.attended === 'number' ? s.attended : 0,
            total: typeof s.total === 'number' ? s.total : 0,
            type: s.type === 'lab' ? 'lab' : 'theory',
          }))
          setSubjects(validated)
          resolve(validated.length)
        } catch {
          reject(new Error('Could not parse file'))
        }
      }
      reader.onerror = () => reject(new Error('Could not read file'))
      reader.readAsText(file)
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
    exportSubjects,
    importSubjects,
    totalAttended,
    totalClasses,
    overallPercentage,
  }
}
