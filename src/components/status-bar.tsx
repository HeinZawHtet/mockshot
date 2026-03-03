import type { ChatTheme } from '../types/theme'

interface StatusBarProps {
  theme: ChatTheme
}

function SignalIcon({ color }: { color: string }) {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
      <rect x="0" y="7" width="3" height="5" rx="0.5" fill={color} />
      <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill={color} />
      <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" fill={color} />
      <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill={color} />
    </svg>
  )
}

function WifiIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path d="M8 9.5C8.69036 9.5 9.25 10.0596 9.25 10.75C9.25 11.4404 8.69036 12 8 12C7.30964 12 6.75 11.4404 6.75 10.75C6.75 10.0596 7.30964 9.5 8 9.5Z" fill={color} />
      <path d="M8 6C9.45 6 10.76 6.59 11.72 7.55L12.8 6.47C11.54 5.21 9.85 4.42 8 4.42C6.15 4.42 4.46 5.21 3.2 6.47L4.28 7.55C5.24 6.59 6.55 6 8 6Z" fill={color} />
      <path d="M8 2.83C10.76 2.83 13.24 3.95 15.04 5.75L16 4.79C13.94 2.73 11.12 1.5 8 1.5C4.88 1.5 2.06 2.73 0 4.79L0.96 5.75C2.76 3.95 5.24 2.83 8 2.83Z" fill={color} />
    </svg>
  )
}

function BatteryIcon({ color }: { color: string }) {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={color} strokeOpacity="0.35" />
      <rect x="2" y="2" width="16" height="8" rx="2" fill={color} />
      <path d="M23 4V8C23.8 7.6 24.5 6.9 24.5 6C24.5 5.1 23.8 4.4 23 4Z" fill={color} fillOpacity="0.4" />
    </svg>
  )
}

export function StatusBar({ theme }: StatusBarProps) {
  const iconColor = theme.colorMode === 'dark' ? '#FFFFFF' : '#000000'

  return (
    <div
      style={{
        backgroundColor: theme.header.bg,
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '22px',
        paddingRight: '16px',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          color: iconColor,
          fontSize: '15px',
          fontWeight: 600,
          fontFamily: theme.fontFamily,
          letterSpacing: '-0.3px',
        }}
      >
        9:41
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <SignalIcon color={iconColor} />
        <WifiIcon color={iconColor} />
        <BatteryIcon color={iconColor} />
      </div>
    </div>
  )
}
