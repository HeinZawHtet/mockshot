import type { GeneratedMessage } from '@/types/ai'

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

function incrementUsage(): void {
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

export interface GenerateParams {
  scenario: string
  platform: string
  contactName: string
}

export async function generateConversation(params: GenerateParams): Promise<GeneratedMessage[]> {
  const custom = getCustomConfig()
  if (custom) return generateWithCustomKey(params, custom)
  return generateWithOurKey(params)
}

async function generateWithOurKey(params: GenerateParams): Promise<GeneratedMessage[]> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(data.error ?? `Request failed (${res.status})`)
  }
  const data = (await res.json()) as { messages: GeneratedMessage[] }
  incrementUsage()
  return data.messages
}

async function generateWithCustomKey(
  params: GenerateParams,
  config: { apiKey: string; model: string }
): Promise<GeneratedMessage[]> {
  const { generateObject } = await import('ai')
  const { z } = await import('zod')

  const slashIndex = config.model.indexOf('/')
  const provider = slashIndex !== -1 ? config.model.slice(0, slashIndex) : 'anthropic'
  const modelName = slashIndex !== -1 ? config.model.slice(slashIndex + 1) : config.model

  const schema = z.object({
    messages: z.array(
      z.object({
        sender: z.enum(['me', 'them']),
        text: z.string(),
      })
    ),
  })

  const generateParams = {
    schema,
    system: buildSystemPrompt(params),
    prompt: params.scenario,
  }

  if (provider === 'openai') {
    const { createOpenAI } = await import('@ai-sdk/openai')
    const model = createOpenAI({ apiKey: config.apiKey })(modelName)
    const { object } = await generateObject({ model, ...generateParams })
    return object.messages
  }

  const { createAnthropic } = await import('@ai-sdk/anthropic')
  const model = createAnthropic({ apiKey: config.apiKey })(modelName)
  const { object } = await generateObject({ model, ...generateParams })
  return object.messages
}

function buildSystemPrompt(params: GenerateParams): string {
  return `You generate realistic fake chat conversations for MockShot, a screenshot tool used by content creators.
Platform: ${params.platform}. The other person's name is: ${params.contactName}.
Generate between 5 and 9 messages. Keep the tone natural and platform-appropriate.
Vary message lengths — mix short punchy replies with longer ones.
Do not include timestamps, just the conversation.`
}
