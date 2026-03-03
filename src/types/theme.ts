export type Platform = 'imessage' | 'whatsapp' | 'messenger'
export type ColorMode = 'dark' | 'light'

export interface BubbleTheme {
  sentBg: string
  receivedBg: string
  sentText: string
  receivedText: string
  sentBorderRadius: string
  receivedBorderRadius: string
  /** Border radius for mid-group bubbles (not last in sequence) */
  midBorderRadius: string
}

export interface ChatTheme {
  platform: Platform
  colorMode: ColorMode
  chatBg: string
  fontFamily: string
  fontSize: string
  bubble: BubbleTheme
  timestamp: {
    color: string
    fontSize: string
    position: 'centered' | 'inside-bubble'
  }
  avatar: {
    size: number
    showOnReceived: boolean
  }
  header: {
    bg: string
    textColor: string
    subTextColor: string
  }
  inputBar: {
    bg: string
    placeholderText: string
    textColor: string
  }
  readReceipt?: {
    color: string
    fontSize: string
  }
}
