import type { GeneratedMessage } from '@/types/ai'
import { getCustomConfig, incrementUsage } from './ai-storage'

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
