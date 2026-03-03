import type { Message } from '../types/message'
import { generateId } from '../utils/helpers'

export function getSeedMessages(): Message[] {
  const now = Date.now()
  return [
    { id: generateId(), text: 'Hey! Are you free tonight?', sender: 'them', timestamp: new Date(now - 8 * 60000).toISOString() },
    { id: generateId(), text: 'Yeah, what did you have in mind?', sender: 'me', timestamp: new Date(now - 7 * 60000).toISOString() },
    { id: generateId(), text: 'Was thinking we could grab dinner 🍜', sender: 'them', timestamp: new Date(now - 6 * 60000).toISOString() },
    { id: generateId(), text: 'That sounds amazing honestly', sender: 'me', timestamp: new Date(now - 2 * 60000).toISOString() },
    { id: generateId(), text: "Let's do 7pm?", sender: 'me', timestamp: new Date(now - 1 * 60000).toISOString() },
  ]
}
