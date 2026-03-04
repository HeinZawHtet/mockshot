import { useEffect, useRef, useState } from 'react'
import type { Message } from '../../../types/message'
import type { ChatTheme } from '../../../types/theme'
import { ChatBubble } from '../../../components/chat-bubble'
import { formatTime, isTimestampGap, getTimeValue, applyTimeToTimestamp } from '../../../utils/helpers'

interface IMessageChatProps {
  messages: Message[]
  theme: ChatTheme
  contactName: string
  onDeleteMessage?: (id: string) => void
  onEditMessage?: (id: string, newText: string) => void
  onEditTimestamp?: (id: string, newTimestamp: string) => void
  onReact?: (messageId: string, emoji: string) => void
  onAvatarClick?: () => void
  avatarUrl?: string
}

export function IMessageChat({ messages, theme, contactName, onDeleteMessage, onEditMessage, onEditTimestamp, onReact, onAvatarClick, avatarUrl }: IMessageChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [editingTimestampId, setEditingTimestampId] = useState<string | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.chatBg,
        overflow: 'hidden',
      }}
    >
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingTop: '8px',
            paddingBottom: '4px',
          }}
        >
        {(() => {
          const lastSentIndex = messages.reduce((acc, m, i) => m.sender === 'me' ? i : acc, -1)
          return messages.map((msg, index) => {
          const prevMsg = messages[index - 1]
          const nextMsg = messages[index + 1]
          const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender
          const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender
          const showAvatar = msg.sender === 'them' && isLastInGroup
          const isLastSentMessage = index === lastSentIndex

          const showTimestamp =
            index === 0 ||
            isFirstInGroup ||
            (prevMsg && isTimestampGap(prevMsg.timestamp, msg.timestamp))

          return (
            <div key={msg.id}>
              {showTimestamp && (
                <div
                  style={{
                    textAlign: 'center',
                    color: theme.timestamp.color,
                    fontSize: theme.timestamp.fontSize,
                    margin: '10px 0 4px',
                    fontFamily: theme.fontFamily,
                  }}
                >
                  {editingTimestampId === msg.id ? (
                    <input
                      type="time"
                      autoFocus
                      defaultValue={getTimeValue(msg.timestamp)}
                      onBlur={e => {
                        if (e.target.value) onEditTimestamp?.(msg.id, applyTimeToTimestamp(msg.timestamp, e.target.value))
                        setEditingTimestampId(null)
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') e.currentTarget.blur()
                        if (e.key === 'Escape') setEditingTimestampId(null)
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: theme.timestamp.color,
                        fontSize: theme.timestamp.fontSize,
                        fontFamily: theme.fontFamily,
                        textAlign: 'center',
                        cursor: 'text',
                        colorScheme: 'dark',
                      }}
                    />
                  ) : (
                    <span
                      onClick={() => onEditTimestamp && setEditingTimestampId(msg.id)}
                      style={{ cursor: onEditTimestamp ? 'pointer' : 'default' }}
                    >
                      {formatTime(msg.timestamp, true)}
                    </span>
                  )}
                </div>
              )}
              <div style={{ marginBottom: isLastInGroup ? '8px' : '2px' }}>
                <ChatBubble
                  message={msg}
                  theme={theme}
                  isLastInGroup={isLastInGroup}
                  showAvatar={showAvatar}
                  isLastSentMessage={isLastSentMessage}
                  readReceiptLabel={isLastSentMessage ? 'Delivered' : undefined}
                  contactName={contactName}
                  onDelete={onDeleteMessage ? () => onDeleteMessage(msg.id) : undefined}
                  onEdit={onEditMessage ? (newText) => onEditMessage(msg.id, newText) : undefined}
                  onEditTimestamp={onEditTimestamp ? (ts) => onEditTimestamp(msg.id, ts) : undefined}
                  onReact={onReact ? (emoji) => onReact(msg.id, emoji) : undefined}
                  onAvatarClick={onAvatarClick}
                  avatarUrl={avatarUrl}
                />
              </div>
            </div>
          )
          })
        })()}
        </div>
      </div>
    </div>
  )
}
