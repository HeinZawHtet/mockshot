import type { ChatTheme } from '../types/theme'

interface InputBarProps {
  theme: ChatTheme
}

function PlusIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10.25" stroke={color} strokeWidth="1.5" />
      <path d="M7 11H15M11 7V15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CameraIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      <rect x="0.75" y="3.75" width="20.5" height="13.5" rx="3.25" stroke={color} strokeWidth="1.5" />
      <circle cx="11" cy="10.5" r="3.5" stroke={color} strokeWidth="1.5" />
      <path d="M7.5 3.5L9 1H13L14.5 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EmojiIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9.25" stroke={color} strokeWidth="1.5" />
      <circle cx="7" cy="8" r="1.25" fill={color} />
      <circle cx="13" cy="8" r="1.25" fill={color} />
      <path d="M6.5 12.5C7.5 14 12.5 14 13.5 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function AttachIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17 9.5L9.5 17C7.5 19 4 19 2 17C0 15 0 11.5 2 9.5L10 1.5C11.5 0 13.5 0 15 1.5C16.5 3 16.5 5 15 6.5L7.5 14C6.5 15 5 15 4 14C3 13 3 11.5 4 10.5L11 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MicIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
      <rect x="4.75" y="0.75" width="8.5" height="12.5" rx="4.25" stroke={color} strokeWidth="1.5" />
      <path d="M1 10C1 14.4 4.6 18 9 18C13.4 18 17 14.4 17 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="18" x2="9" y2="21.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ImageIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="0.75" y="0.75" width="18.5" height="18.5" rx="3.25" stroke={color} strokeWidth="1.5" />
      <circle cx="6.5" cy="6.5" r="2" fill={color} />
      <path d="M1 14L5 9.5L8.5 13L13 7.5L19 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function InputBar({ theme }: InputBarProps) {
  const barBg = theme.platform === 'whatsapp' ? '#1A232B' : theme.chatBg
  const iconColor = '#8E8E93'
  const borderTopColor =
    theme.platform === 'imessage'
      ? theme.colorMode === 'dark' ? '#38383A' : '#D1D1D6'
      : theme.platform === 'messenger'
      ? theme.colorMode === 'dark' ? '#2a2a2a' : '#e0e0e0'
      : 'transparent'

  return (
    <div
      style={{
        backgroundColor: barBg,
        borderTop: `0.5px solid ${borderTopColor}`,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
        minHeight: theme.platform === 'whatsapp' ? '56px' : '50px',
      }}
    >
      {/* Left icons */}
      {theme.platform === 'imessage' && <PlusIcon color="#2B7EFB" />}
      {theme.platform === 'whatsapp' && (
        <>
          <EmojiIcon color={iconColor} />
          <AttachIcon color={iconColor} />
        </>
      )}
      {theme.platform === 'messenger' && (
        <>
          <EmojiIcon color="#0084FF" />
          <ImageIcon color="#0084FF" />
        </>
      )}

      {/* Input pill */}
      <div
        style={{
          flex: 1,
          backgroundColor: theme.inputBar.bg,
          borderRadius: theme.platform === 'whatsapp' ? '8px' : '20px',
          padding: theme.platform === 'whatsapp' ? '9px 14px' : '8px 14px',
          color: theme.colorMode === 'dark' ? '#636366' : '#8E8E93',
          fontSize: theme.fontSize,
          fontFamily: theme.fontFamily,
          border:
            theme.platform === 'imessage'
              ? `1px solid ${theme.colorMode === 'dark' ? '#48484A' : '#D1D1D6'}`
              : 'none',
        }}
      >
        {theme.inputBar.placeholderText}
      </div>

      {/* Right icons */}
      {theme.platform === 'imessage' && <CameraIcon color="#2B7EFB" />}
      {(theme.platform === 'whatsapp' || theme.platform === 'messenger') && (
        <MicIcon color={theme.platform === 'messenger' ? '#0084FF' : iconColor} />
      )}
    </div>
  )
}
