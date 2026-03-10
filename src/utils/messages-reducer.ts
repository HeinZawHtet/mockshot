import type { Message } from '../types/message'

export type MessageAction =
  | { type: 'ADD'; id: string; text: string; sender: 'me' | 'them'; timestamp: string }
  | { type: 'DELETE'; id: string }
  | { type: 'CLEAR' }
  | { type: 'INSERT_GENERATED'; messages: Message[]; mode: 'replace' | 'append' }
  | { type: 'EDIT'; id: string; text: string }
  | { type: 'EDIT_TIMESTAMP'; id: string; timestamp: string }
  | { type: 'TOGGLE_REACTION'; id: string; emoji: string }

export function messagesReducer(state: Message[], action: MessageAction): Message[] {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: action.id, text: action.text, sender: action.sender, timestamp: action.timestamp }]
    case 'DELETE':
      return state.filter((m) => m.id !== action.id)
    case 'CLEAR':
      return []
    case 'INSERT_GENERATED':
      return action.mode === 'replace' ? action.messages : [...state, ...action.messages]
    case 'EDIT':
      return state.map((m) => (m.id === action.id ? { ...m, text: action.text } : m))
    case 'EDIT_TIMESTAMP':
      return state.map((m) => (m.id === action.id ? { ...m, timestamp: action.timestamp } : m))
    case 'TOGGLE_REACTION':
      return state.map((m) => {
        if (m.id !== action.id) return m
        const reactions = m.reactions ?? []
        return {
          ...m,
          reactions: reactions.includes(action.emoji)
            ? reactions.filter((r) => r !== action.emoji)
            : [...reactions, action.emoji],
        }
      })
  }
}
