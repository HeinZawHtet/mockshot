import type { ChatTheme } from '../types/theme'

export const messengerLight: ChatTheme = {
  platform: 'messenger',
  colorMode: 'light',
  chatBg: '#FFFFFF',
  fontFamily: '"Helvetica Neue", system-ui, sans-serif',
  fontSize: '14px',
  bubble: {
    sentBg: '#0084FF',
    receivedBg: '#F0F0F0',
    sentText: '#FFFFFF',
    receivedText: '#000000',
    sentBorderRadius: '18px 18px 4px 18px',
    receivedBorderRadius: '18px 18px 18px 4px',
    midBorderRadius: '18px',
  },
  timestamp: {
    color: '#65676B',
    fontSize: '11px',
    position: 'centered',
  },
  avatar: {
    size: 24,
    showOnReceived: true,
  },
  header: {
    bg: '#FFFFFF',
    textColor: '#000000',
    subTextColor: '#65676B',
  },
  inputBar: {
    bg: '#F0F0F0',
    placeholderText: 'Aa',
    textColor: '#000000',
  },
}

export const messengerDark: ChatTheme = {
  ...messengerLight,
  colorMode: 'dark',
  chatBg: '#1C1C1E',
  bubble: {
    ...messengerLight.bubble,
    receivedBg: '#3A3A3C',
    receivedText: '#FFFFFF',
  },
  header: {
    bg: '#1C1C1E',
    textColor: '#FFFFFF',
    subTextColor: '#B0B3B8',
  },
  inputBar: {
    bg: '#3A3A3C',
    placeholderText: 'Aa',
    textColor: '#FFFFFF',
  },
}
