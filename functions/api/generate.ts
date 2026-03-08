import { generateObject } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'

interface KVNamespace {
  get(key: string): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
}

interface Env {
  RATE_KV: KVNamespace
  AI_API_KEY: string
  AI_MODEL: string // format: "provider/model-name" e.g. "anthropic/claude-haiku-4-5-20251001"
}

interface RequestBody {
  scenario: string
  platform: string
  contactName: string
}

const schema = z.object({
  messages: z.array(
    z.object({
      sender: z.enum(['me', 'them']),
      text: z.string(),
    })
  ),
})

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export async function onRequestPost({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
  const today = new Date().toISOString().split('T')[0]
  const rateKey = `rate:${ip}:${today}`
  const count = parseInt((await env.RATE_KV.get(rateKey)) ?? '0')
  if (count >= 5) {
    return Response.json(
      { error: 'Daily limit reached. Try again tomorrow.' },
      { status: 429, headers: JSON_HEADERS }
    )
  }
  let body: RequestBody
  try {
    body = (await request.json()) as RequestBody
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400, headers: JSON_HEADERS })
  }

  const { scenario, platform, contactName } = body
  if (!scenario?.trim()) {
    return Response.json({ error: 'Scenario is required.' }, { status: 400, headers: JSON_HEADERS })
  }

  const modelString = env.AI_MODEL
  const slashIndex = modelString.indexOf('/')
  const provider = slashIndex !== -1 ? modelString.slice(0, slashIndex) : 'anthropic'
  const modelName = slashIndex !== -1 ? modelString.slice(slashIndex + 1) : modelString

  const providerModel =
    provider === 'openai'
      ? createOpenAI({ apiKey: env.AI_API_KEY })(modelName)
      : createAnthropic({ apiKey: env.AI_API_KEY })(modelName)

  try {
    const { object } = await generateObject({
      model: providerModel,
      schema,
      system: buildSystemPrompt(platform, contactName),
      prompt: scenario,
    })
    await env.RATE_KV.put(rateKey, String(count + 1), { expirationTtl: 86400 })
    return Response.json(object, { headers: JSON_HEADERS })
  } catch (err) {
    console.error('[generate]', err)
    return Response.json({ error: 'Generation failed. Please try again.' }, { status: 500, headers: JSON_HEADERS })
  }
}

function buildSystemPrompt(platform: string, contactName: string): string {
  return `You generate realistic fake chat conversations for MockShot, a screenshot tool used by content creators.
Platform: ${platform}. The other person's name is: ${contactName}.
Generate between 5 and 9 messages. Keep the tone natural and platform-appropriate.
Vary message lengths — mix short punchy replies with longer ones.
Do not include timestamps, just the conversation.`
}
