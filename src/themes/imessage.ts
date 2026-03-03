import type { ChatTheme } from '../types/theme'

export const iMessageDark: ChatTheme = {
  platform: 'imessage',
  colorMode: 'dark',
  chatBg: '#000000',
  fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
  fontSize: '16px',
  bubble: {
    sentBg: '#2B7EFB',
    receivedBg: '#3A3A3C',
    sentText: '#FFFFFF',
    receivedText: '#FFFFFF',
    sentBorderRadius: '18px 18px 4px 18px',
    receivedBorderRadius: '18px 18px 18px 4px',
    midBorderRadius: '18px',
  },
  timestamp: {
    color: '#8E8E93',
    fontSize: '11px',
    position: 'centered',
  },
  avatar: {
    size: 28,
    showOnReceived: true,
  },
  header: {
    bg: '#000000',
    textColor: '#FFFFFF',
    subTextColor: '#8E8E93',
  },
  inputBar: {
    bg: '#1C1C1E',
    placeholderText: 'iMessage',
    textColor: '#FFFFFF',
  },
  readReceipt: {
    color: '#8E8E93',
    fontSize: '11px',
  },
}

export const iMessageLight: ChatTheme = {
  ...iMessageDark,
  colorMode: 'light',
  chatBg: '#FFFFFF',
  bubble: {
    ...iMessageDark.bubble,
    receivedBg: '#E9E9EB',
    receivedText: '#000000',
  },
  header: {
    bg: '#FFFFFF',
    textColor: '#000000',
    subTextColor: '#8E8E93',
  },
  inputBar: {
    ...iMessageDark.inputBar,
    bg: '#F2F2F7',
    textColor: '#000000',
  },
}
