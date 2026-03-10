import type { Platform } from './types/theme'

export const PLATFORMS: Platform[] = ['imessage', 'whatsapp', 'messenger']

export const PLATFORM_LABELS: Record<Platform, string> = {
  imessage: 'iMessage',
  whatsapp: 'WhatsApp',
  messenger: 'Messenger',
}

export const PLATFORM_COLORS: Record<Platform, string> = {
  imessage: '#2B7EFB',
  whatsapp: '#25D366',
  messenger: '#0084FF',
}

export const PLATFORM_ICONS: Record<Platform, string> = {
  imessage: 'ri-chat-3-line',
  whatsapp: 'ri-whatsapp-line',
  messenger: 'ri-messenger-line',
}
