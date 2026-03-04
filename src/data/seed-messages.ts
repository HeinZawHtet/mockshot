import type { Message } from '../types/message'

export function getSeedMessages(): Message[] {
  return [
    { id: 'seed-1', text: 'Hey! Are you free tonight?', sender: 'them', timestamp: '2024-01-15T19:00:00.000Z' },
    { id: 'seed-2', text: 'Yeah, what did you have in mind?', sender: 'me', timestamp: '2024-01-15T19:01:00.000Z' },
    { id: 'seed-3', text: 'Was thinking we could grab dinner 🍜', sender: 'them', timestamp: '2024-01-15T19:02:00.000Z' },
    { id: 'seed-4', text: 'That sounds amazing honestly', sender: 'me', timestamp: '2024-01-15T19:06:00.000Z' },
    { id: 'seed-5', text: "Let's do 7pm?", sender: 'me', timestamp: '2024-01-15T19:07:00.000Z' },
  ]
}
