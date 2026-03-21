const USAGE_KEY = 'mockshot_gen_usage'
const CUSTOM_API_KEY_STORAGE = 'mockshot_custom_api_key'
const CUSTOM_MODEL_STORAGE = 'mockshot_custom_model'

interface UsageRecord {
  count: number
  date: string
}

function todayDate(): string {
  return new Date().toISOString().split('T')[0]!
}

export function getUsageCount(): number {
  try {
    const raw = localStorage.getItem(USAGE_KEY)
    if (!raw) return 0
    const record = JSON.parse(raw) as UsageRecord
    return record.date === todayDate() ? record.count : 0
  } catch {
    return 0
  }
}

export function incrementUsage(): void {
  const count = getUsageCount()
  localStorage.setItem(USAGE_KEY, JSON.stringify({ count: count + 1, date: todayDate() }))
}

export function getCustomConfig(): { apiKey: string; model: string } | null {
  const apiKey = localStorage.getItem(CUSTOM_API_KEY_STORAGE)
  const model = localStorage.getItem(CUSTOM_MODEL_STORAGE)
  if (!apiKey || !model) return null
  return { apiKey, model }
}

export function saveCustomConfig(apiKey: string, model: string): void {
  localStorage.setItem(CUSTOM_API_KEY_STORAGE, apiKey)
  localStorage.setItem(CUSTOM_MODEL_STORAGE, model)
}

export function clearCustomConfig(): void {
  localStorage.removeItem(CUSTOM_API_KEY_STORAGE)
  localStorage.removeItem(CUSTOM_MODEL_STORAGE)
}
