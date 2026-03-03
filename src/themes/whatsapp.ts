import type { ChatTheme } from '../types/theme'

export const whatsAppDark: ChatTheme = {
  platform: 'whatsapp',
  colorMode: 'dark',
  chatBg: '#0B141A',
  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, sans-serif',
  fontSize: '14.2px',
  bubble: {
    sentBg: '#005C4B',
    receivedBg: '#202C33',
    sentText: '#E9EDEF',
    receivedText: '#E9EDEF',
    sentBorderRadius: '8px 8px 0px 8px',
    receivedBorderRadius: '8px 8px 8px 0px',
    midBorderRadius: '8px',
  },
  timestamp: {
    color: '#8696A0',
    fontSize: '11px',
    position: 'inside-bubble',
  },
  avatar: {
    size: 28,
    showOnReceived: true,
  },
  header: {
    bg: '#202C33',
    textColor: '#E9EDEF',
    subTextColor: '#8696A0',
  },
  inputBar: {
    bg: '#2A3942',
    placeholderText: 'Message',
    textColor: '#E9EDEF',
  },
}

export const whatsAppLight: ChatTheme = {
  platform: 'whatsapp',
  colorMode: 'light',
  chatBg: '#E5DDD5',
  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, sans-serif',
  fontSize: '14.2px',
  bubble: {
    sentBg: '#D9FDD3',
    receivedBg: '#FFFFFF',
    sentText: '#111B21',
    receivedText: '#111B21',
    sentBorderRadius: '8px 8px 0px 8px',
    receivedBorderRadius: '8px 8px 8px 0px',
    midBorderRadius: '8px',
  },
  timestamp: {
    color: '#8696A0',
    fontSize: '11px',
    position: 'inside-bubble',
  },
  avatar: {
    size: 28,
    showOnReceived: true,
  },
  header: {
    bg: '#F0F2F5',
    textColor: '#111B21',
    subTextColor: '#667781',
  },
  inputBar: {
    bg: '#FFFFFF',
    placeholderText: 'Message',
    textColor: '#111B21',
  },
}
