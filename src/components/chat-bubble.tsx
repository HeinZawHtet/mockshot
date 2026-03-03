import { useState, useRef, useEffect } from 'react'
import type { ChatTheme } from '../types/theme'
import type { Message } from '../types/message'
import { formatTime, getInitials, getAvatarColor, getTimeValue, applyTimeToTimestamp } from '../utils/helpers'

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
}: ChatBubbleProps) {
  const [hovered, setHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message.text)
  const [isEditingTimestamp, setIsEditingTimestamp] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isSent = message.sender === 'me'
  const bubbleBg = isSent ? theme.bubble.sentBg : theme.bubble.receivedBg
  const textColor = isSent ? theme.bubble.sentText : theme.bubble.receivedText

  let borderRadius: string
  if (isSent) {
    borderRadius = isLastInGroup ? theme.bubble.sentBorderRadius : theme.bubble.midBorderRadius
  } else {
    borderRadius = isLastInGroup ? theme.bubble.receivedBorderRadius : theme.bubble.midBorderRadius
  }

  const avatarSlotWidth = theme.avatar.size + 14

  // Sync editText if message.text changes externally
  useEffect(() => {
    if (!isEditing) setEditText(message.text)
  }, [message.text, isEditing])

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
      textareaRef.current?.select()
    }
  }, [isEditing])

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

  const showActions = (onEdit || onDelete) && hovered && !isEditing

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSent ? 'flex-end' : 'flex-start',
        paddingLeft: isSent ? '60px' : `${avatarSlotWidth}px`,
        paddingRight: isSent ? '8px' : `${avatarSlotWidth}px`,
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
            backgroundColor: showAvatar ? getAvatarColor(contactName) : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${Math.floor(theme.avatar.size * 0.38)}px`,
            color: '#FFFFFF',
            fontWeight: 600,
          }}
        >
          {showAvatar ? getInitials(contactName) : ''}
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

      {/* Hover actions: edit + delete */}
      {showActions && (
        <div
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
          {onEdit && (
            <button
              onClick={() => setIsEditing(true)}
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
