import type { ChatTheme } from '../types/theme'
import { getInitials, getAvatarColor } from '../utils/helpers'

interface ChatHeaderProps {
  theme: ChatTheme
  contactName: string
}

function VideoIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <rect x="0.5" y="0.5" width="12" height="13" rx="2.5" stroke={color} strokeWidth="1.5" />
      <path d="M13.5 4.5L19 2V12L13.5 9.5V4.5Z" fill={color} />
    </svg>
  )
}

function PhoneIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 1C3.5 1 2 1 1 3C0 5 1.5 7.5 3.5 9.5C5.5 11.5 8 13 10 12C12 11 12 10.5 12 10.5L10.5 9L9 10.5C9 10.5 7.5 10 5.5 8C3.5 6 3 4.5 3 4.5L4.5 3L3.5 1Z" fill={color} />
    </svg>
  )
}

function InfoIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" />
      <rect x="7.25" y="7" width="1.5" height="5" rx="0.75" fill={color} />
      <circle cx="8" cy="4.5" r="1" fill={color} />
    </svg>
  )
}

function SearchIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="5" stroke={color} strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function DotsIcon({ color }: { color: string }) {
  return (
    <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
      <circle cx="2" cy="2" r="1.5" fill={color} />
      <circle cx="2" cy="8" r="1.5" fill={color} />
      <circle cx="2" cy="14" r="1.5" fill={color} />
    </svg>
  )
}

function BackChevron({ color }: { color: string }) {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
      <path d="M8 2L2 8L8 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChatHeader({ theme, contactName }: ChatHeaderProps) {
  const initials = getInitials(contactName || 'C')
  const avatarBg = getAvatarColor(contactName || 'Contact')
  const iconColor = theme.header.textColor

  return (
    <div
      style={{
        backgroundColor: theme.header.bg,
        display: 'flex',
        alignItems: 'center',
        padding: theme.platform === 'whatsapp' ? '8px 12px 8px 8px' : '6px 12px',
        gap: '8px',
        flexShrink: 0,
        minHeight: theme.platform === 'whatsapp' ? '56px' : '44px',
        borderBottom: theme.platform === 'messenger'
          ? `1px solid ${theme.colorMode === 'dark' ? '#2a2a2a' : '#e0e0e0'}`
          : 'none',
      }}
    >
      {/* iMessage back chevron + avatar stacked */}
      {theme.platform === 'imessage' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
          <BackChevron color={theme.bubble.sentBg} />
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: avatarBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              color: '#FFFFFF',
              fontWeight: 600,
            }}
          >
            {initials}
          </div>
        </div>
      )}

      {/* WhatsApp avatar left */}
      {theme.platform === 'whatsapp' && (
        <div
          style={{
            width: `${theme.avatar.size}px`,
            height: `${theme.avatar.size}px`,
            borderRadius: '50%',
            backgroundColor: avatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${Math.floor(theme.avatar.size * 0.38)}px`,
            color: '#FFFFFF',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
      )}

      {/* Messenger avatar left */}
      {theme.platform === 'messenger' && (
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: avatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#FFFFFF',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
      )}

      {/* Name + status */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {theme.platform === 'imessage' ? (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                color: theme.header.textColor,
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: theme.fontFamily,
              }}
            >
              {contactName || 'Contact'}
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                color: theme.header.textColor,
                fontSize: theme.platform === 'messenger' ? '15px' : '15px',
                fontWeight: 600,
                fontFamily: theme.fontFamily,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {contactName || 'Contact'}
            </div>
            <div
              style={{
                color: theme.header.subTextColor,
                fontSize: '12px',
                fontFamily: theme.fontFamily,
              }}
            >
              {theme.platform === 'whatsapp' ? 'online' : 'Active now'}
            </div>
          </>
        )}
      </div>

      {/* Action icons right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {theme.platform === 'imessage' && (
          <>
            <VideoIcon color={theme.bubble.sentBg} />
            <PhoneIcon color={theme.bubble.sentBg} />
          </>
        )}
        {theme.platform === 'whatsapp' && (
          <>
            <VideoIcon color={iconColor} />
            <PhoneIcon color={iconColor} />
            <SearchIcon color={iconColor} />
            <DotsIcon color={iconColor} />
          </>
        )}
        {theme.platform === 'messenger' && (
          <>
            <PhoneIcon color={theme.bubble.sentBg} />
            <VideoIcon color={theme.bubble.sentBg} />
            <InfoIcon color={theme.bubble.sentBg} />
          </>
        )}
      </div>
    </div>
  )
}
