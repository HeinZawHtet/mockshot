export function generateId(): string {
  return crypto.randomUUID()
}

export function formatTime(timestamp: string, includeDate = false): string {
  const date = new Date(timestamp)
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  if (!includeDate) return timeStr
  const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' })
  return `${dayStr} ${timeStr}`
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

const avatarColorCache = new Map<string, string>()

export function getAvatarColor(name: string): string {
  if (avatarColorCache.has(name)) return avatarColorCache.get(name)!
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const color = `hsl(${Math.abs(hash) % 360}, 55%, 45%)`
  avatarColorCache.set(name, color)
  return color
}

/** Returns "HH:MM" for use with <input type="time"> */
export function getTimeValue(timestamp: string): string {
  const d = new Date(timestamp)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Applies a "HH:MM" value back onto an existing ISO timestamp, preserving the date. */
export function applyTimeToTimestamp(timestamp: string, timeValue: string): string {
  const d = new Date(timestamp)
  const [h, m] = timeValue.split(':').map(Number)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

export function isTimestampGap(prevTimestamp: string, currentTimestamp: string): boolean {
  const prev = new Date(prevTimestamp).getTime()
  const current = new Date(currentTimestamp).getTime()
  return current - prev > 5 * 60 * 1000
}
