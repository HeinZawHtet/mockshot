import { useState, useRef, useEffect } from 'react'
import type { ChatTheme } from '../types/theme'
import type { Message } from '../types/message'
import { formatTime, getInitials, getAvatarColor, getTimeValue, applyTimeToTimestamp } from '../utils/helpers'

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '👍', '👎']

interface ChatBubbleProps {
  message: Message
  theme: ChatTheme
  isLastInGroup: boolean
  showAvatar: boolean
  isLastSentMessage: boolean
  readReceiptLabel?: 'Delivered' | 'Read'
  contactName: string
  onDelete?: () => void
  onEdit?: (newText: string) => void
  onEditTimestamp?: (newTimestamp: string) => void
  onReact?: (emoji: string) => void
  onAvatarClick?: () => void
  avatarUrl?: string
}

function TickIcon({ blue }: { blue?: boolean }) {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      style={{ display: 'inline', marginLeft: '3px', verticalAlign: 'middle' }}
    >
      <path
        d="M1 5L4 8L9 2"
        stroke={blue ? '#53BDEB' : '#8696A0'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 5L10 8L15 2"
        stroke={blue ? '#53BDEB' : '#8696A0'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChatBubble({
  message,
  theme,
  isLastInGroup,
  showAvatar,
  isLastSentMessage,
  readReceiptLabel,
  contactName,
  onDelete,
  onEdit,
  onEditTimestamp,
  onReact,
  onAvatarClick,
  avatarUrl,
}: ChatBubbleProps) {
  const [hovered, setHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message.text)
  const [isEditingTimestamp, setIsEditingTimestamp] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isSent = message.sender === 'me'
  const isDark = theme.colorMode === 'dark'
  const bubbleBg = isSent ? theme.bubble.sentBg : theme.bubble.receivedBg
  const textColor = isSent ? theme.bubble.sentText : theme.bubble.receivedText
  const hasReactions = (message.reactions?.length ?? 0) > 0

  let borderRadius: string
  if (isSent) {
    borderRadius = isLastInGroup ? theme.bubble.sentBorderRadius : theme.bubble.midBorderRadius
  } else {
    borderRadius = isLastInGroup ? theme.bubble.receivedBorderRadius : theme.bubble.midBorderRadius
  }

  const avatarSlotWidth = theme.avatar.size + 14

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
      textareaRef.current?.select()
    }
  }, [isEditing])

  // Close picker on outside pointer event
  useEffect(() => {
    if (!showPicker) return
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
        setHovered(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [showPicker])

  function handleEditSave() {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== message.text) onEdit?.(trimmed)
    else setEditText(message.text)
    setIsEditing(false)
  }

  function handleEditKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEditSave() }
    if (e.key === 'Escape') { setEditText(message.text); setIsEditing(false) }
  }

  const showActions = (onEdit || onDelete || onReact) && (hovered || showPicker) && !isEditing

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { if (!showPicker) setHovered(false) }}
      onTouchStart={() => setHovered(true)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSent ? 'flex-end' : 'flex-start',
        paddingLeft: isSent ? '60px' : `${avatarSlotWidth}px`,
        paddingRight: isSent ? '8px' : `${avatarSlotWidth}px`,
        paddingTop: hasReactions && theme.platform === 'imessage' ? '36px' : undefined,
        paddingBottom: hasReactions && (theme.platform === 'messenger' || theme.platform === 'whatsapp') ? '14px' : undefined,
        position: 'relative',
      }}
    >
      {/* Avatar — received last in group */}
      {!isSent && theme.avatar.showOnReceived && (
        <div
          style={{
            position: 'absolute',
            left: '8px',
            bottom: 0,
            width: `${theme.avatar.size}px`,
            height: `${theme.avatar.size}px`,
            borderRadius: '50%',
            backgroundColor: showAvatar ? (avatarUrl ? 'transparent' : getAvatarColor(contactName)) : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${Math.floor(theme.avatar.size * 0.38)}px`,
            color: '#FFFFFF',
            fontWeight: 600,
            cursor: showAvatar && onAvatarClick ? 'pointer' : 'default',
            overflow: 'hidden',
          }}
          onClick={showAvatar && onAvatarClick ? onAvatarClick : undefined}
        >
          {showAvatar ? (
            avatarUrl ? (
              <img
                src={avatarUrl}
                alt={contactName}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : getInitials(contactName)
          ) : ''}
        </div>
      )}

      {/* Emoji picker popup — appears above bubble */}
      {showPicker && onReact && (
        <div
          className="export-hide"
          style={{
            position: 'absolute',
            top: 0,
            transform: 'translateY(calc(-100% - 4px))',
            ...(isSent ? { right: '8px' } : { left: `${avatarSlotWidth}px` }),
            display: 'flex',
            gap: '2px',
            background: isDark ? '#2C2C2E' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
            borderRadius: '999px',
            padding: '4px 6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            zIndex: 10,
          }}
        >
          {REACTION_EMOJIS.map(emoji => {
            const isActive = message.reactions?.includes(emoji)
            return (
              <button
                key={emoji}
                onPointerDown={e => { e.stopPropagation(); onReact(emoji); setShowPicker(false) }}
                style={{
                  background: isActive
                    ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)')
                    : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  lineHeight: 1,
                  padding: '3px 4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            )
          })}
        </div>
      )}

      {/* Bubble */}
      <div
        style={{
          backgroundColor: bubbleBg,
          color: textColor,
          borderRadius,
          padding: theme.platform === 'whatsapp' ? '6px 10px 6px 10px' : '8px 12px',
          maxWidth: theme.platform === 'whatsapp' ? '75%' : '70%',
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSize,
          lineHeight: '1.4',
          wordBreak: 'break-word',
          position: 'relative',
          outline: isEditing ? `2px solid ${isSent ? theme.bubble.sentBg : theme.bubble.receivedBg}` : 'none',
          outlineOffset: '2px',
        }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={handleEditSave}
            rows={Math.max(1, editText.split('\n').length)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: textColor,
              fontFamily: theme.fontFamily,
              fontSize: theme.fontSize,
              lineHeight: '1.4',
              resize: 'none',
              width: '100%',
              padding: 0,
              margin: 0,
              display: 'block',
            }}
          />
        ) : (
          <span>{message.text}</span>
        )}

        {/* WhatsApp: timestamp inside bubble */}
        {theme.timestamp.position === 'inside-bubble' && (
          <span
            style={{
              display: 'block',
              color: theme.timestamp.color,
              fontSize: theme.timestamp.fontSize,
              textAlign: 'right',
              marginTop: '3px',
              lineHeight: 1,
            }}
          >
            {isEditingTimestamp ? (
              <input
                type="time"
                autoFocus
                defaultValue={getTimeValue(message.timestamp)}
                onBlur={e => {
                  if (e.target.value) onEditTimestamp?.(applyTimeToTimestamp(message.timestamp, e.target.value))
                  setIsEditingTimestamp(false)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') e.currentTarget.blur()
                  if (e.key === 'Escape') setIsEditingTimestamp(false)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: theme.timestamp.color,
                  fontSize: theme.timestamp.fontSize,
                  fontFamily: theme.fontFamily,
                  width: '72px',
                  cursor: 'text',
                  textAlign: 'center',
                  colorScheme: 'dark',
                }}
              />
            ) : (
              <span
                onClick={() => onEditTimestamp && setIsEditingTimestamp(true)}
                style={{ cursor: onEditTimestamp ? 'pointer' : 'default' }}
              >
                {formatTime(message.timestamp)}
              </span>
            )}
            {isSent && <TickIcon blue={readReceiptLabel === 'Read'} />}
          </span>
        )}

        {/* WhatsApp reactions — absolute at bottom corner, horizontally inside bubble */}
        {hasReactions && theme.platform === 'whatsapp' && (
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              ...(isSent ? { right: '8px' } : { left: '8px' }),
              display: 'flex',
              gap: '4px',
              zIndex: 1,
            }}
          >
            {message.reactions!.map(emoji => (
              <span
                key={emoji}
                onClick={() => onReact?.(emoji)}
                style={{
                  background: isDark ? '#1F2C33' : '#FFFFFF',
                  border: `1.5px solid ${theme.chatBg}`,
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  lineHeight: '18px',
                  cursor: onReact ? 'pointer' : 'default',
                  boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.15)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  color: isDark ? '#8696A0' : '#54656F',
                  fontFamily: theme.fontFamily,
                }}
              >
                <span>{emoji}</span>
                <span style={{ fontSize: '11px' }}>1</span>
              </span>
            ))}
          </div>
        )}

        {/* iMessage tapback — speech bubble above the bubble corner */}
        {hasReactions && theme.platform === 'imessage' && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              marginBottom: '-4px',
              ...(isSent ? { left: '6px' } : { right: '-10px' }),
              display: 'flex',
              gap: '4px',
              zIndex: 2,
            }}
          >
            {message.reactions!.map(emoji => {
              const tapBg = isSent ? (isDark ? '#3A3A3C' : '#E9E9EB') : '#2B7EFB'
              return (
                <div
                  key={emoji}
                  onClick={() => onReact?.(emoji)}
                  style={{ position: 'relative', width: '28px', flexShrink: 0, cursor: onReact ? 'pointer' : 'default' }}
                >
                  {/* Main circle */}
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: tapBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                  }}>
                    {emoji}
                  </div>
                  {/* Tail dot 1 — medium */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-5px',
                    ...(isSent ? { left: '1px' } : { right: '1px' }),
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: tapBg,
                  }} />
                  {/* Tail dot 2 — small */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-10px',
                    ...(isSent ? { left: '-3px' } : { right: '-3px' }),
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: tapBg,
                  }} />
                </div>
              )
            })}
          </div>
        )}

        {/* Messenger reactions — absolute at bottom-right corner of bubble */}
        {hasReactions && theme.platform === 'messenger' && (
          <div
            style={{
              position: 'absolute',
              bottom: '-18px',
              right: '-4px',
              display: 'flex',
              gap: '2px',
              zIndex: 1,
            }}
          >
            {message.reactions!.map(emoji => (
              <span
                key={emoji}
                onClick={() => onReact?.(emoji)}
                style={{
                  background: isDark ? '#3A3A3C' : '#F0F0F0',
                  border: `2px solid ${theme.chatBg}`,
                  borderRadius: '999px',
                  padding: '2px 7px',
                  fontSize: '13px',
                  lineHeight: '18px',
                  cursor: onReact ? 'pointer' : 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* iMessage read receipt */}
      {isLastSentMessage && readReceiptLabel && theme.readReceipt && (
        <span
          style={{
            color: theme.readReceipt.color,
            fontSize: theme.readReceipt.fontSize,
            marginTop: '2px',
            marginRight: '4px',
            fontFamily: theme.fontFamily,
          }}
        >
          {readReceiptLabel}
        </span>
      )}

      {/* Hover actions: react + edit + delete */}
      {showActions && (
        <div
          className="export-hide"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            ...(isSent ? { left: '8px' } : { right: '8px' }),
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          {onReact && (
            <button
              onPointerDown={e => { e.stopPropagation(); setShowPicker(p => !p) }}
              style={{
                background: showPicker ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.35)',
                border: 'none',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '11px',
                flexShrink: 0,
              }}
              aria-label="React to message"
            >
              <i className="ri-emotion-line" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => { setEditText(message.text); setIsEditing(true) }}
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: 'none',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '11px',
                flexShrink: 0,
              }}
              aria-label="Edit message"
            >
              <i className="ri-edit-line" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: 'none',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '11px',
                flexShrink: 0,
              }}
              aria-label="Delete message"
            >
              <i className="ri-delete-bin-line" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
