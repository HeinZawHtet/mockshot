export type SenderRole = 'me' | 'them'

export interface Message {
  id: string
  text: string
  sender: SenderRole
  timestamp: string // ISO string
}
