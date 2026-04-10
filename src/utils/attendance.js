/**
 * Calculates attendance prediction for a subject.
 * @param {number} attended - Classes attended
 * @param {number} total - Total classes held
 * @param {number} target - Target percentage (0-100)
 * @returns {{ percentage: number, required: number|null, bunkable: number|null, status: 'safe'|'warning'|'danger' }}
 */
export function calculatePrediction(attended, total, target = 75) {
  if (total === 0) {
    return { percentage: 0, required: null, bunkable: null, status: 'safe' }
  }

  const percentage = Math.round((attended / total) * 100)

  let required = null
  let bunkable = null

  if (percentage < target) {
    // Need to attend more: ceil( (target * total - 100 * attended) / (100 - target) )
    required = Math.ceil((target * total - 100 * attended) / (100 - target))
    if (required < 0) required = 0
  } else {
    // Can bunk some: floor( (100 * attended - target * total) / target )
    bunkable = Math.floor((100 * attended - target * total) / target)
    if (bunkable < 0) bunkable = 0
  }

  let status = 'safe'
  if (percentage < 65) status = 'danger'
  else if (percentage < 75) status = 'warning'

  return { percentage, required, bunkable, status }
}

/**
 * Get color classes based on status.
 */
export function getStatusColor(status) {
  switch (status) {
    case 'danger':  return { text: 'text-danger-red',   bg: 'bg-danger-red/10',  ring: '#f87171' }
    case 'warning': return { text: 'text-warn-yellow',  bg: 'bg-warn-yellow/10', ring: '#fbbf24' }
    case 'safe':
    default:        return { text: 'text-safe-green',   bg: 'bg-safe-green/10',  ring: '#34d399' }
  }
}
