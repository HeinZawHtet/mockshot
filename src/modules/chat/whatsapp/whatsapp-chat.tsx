import { useEffect, useMemo, useRef, useState } from 'react'
import type { Message } from '../../../types/message'
import type { ChatTheme } from '../../../types/theme'
import { ChatBubble } from '../../../components/chat-bubble'
import { formatTime, isTimestampGap, getTimeValue, applyTimeToTimestamp } from '../../../utils/helpers'
import whatsappBg from '../../../assets/whatsapp-background.png'
import whatsappBgTransparent from '../../../assets/whatsapp-background-transparent.png'

interface WhatsAppChatProps {
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

export function WhatsAppChat({ messages, theme, contactName, onDeleteMessage, onEditMessage, onEditTimestamp, onReact, onAvatarClick, avatarUrl }: WhatsAppChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [editingTimestampId, setEditingTimestampId] = useState<string | null>(null)

  const lastSentIndex = useMemo(
    () => messages.reduce((acc, m, i) => (m.sender === 'me' ? i : acc), -1),
    [messages],
  )

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const isDark = theme.colorMode === 'dark'
  const datePillBg = isDark ? '#182229' : '#FFFFFF'
  const datePillText = isDark ? '#8696A0' : '#54656F'

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ backgroundColor: theme.chatBg }}>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{
          backgroundImage: isDark ? `url(${whatsappBgTransparent})` : `url(${whatsappBg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
          backgroundColor: theme.chatBg,
        }}
      >
        <div className="min-h-full flex flex-col justify-end pt-2 pb-1">
          {messages.map((msg, index) => {
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
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}>
                    <span
                      style={{
                        backgroundColor: datePillBg,
                        color: datePillText,
                        fontSize: '12px',
                        fontWeight: 500,
                        padding: '0 12px',
                        borderRadius: '8px',
                        fontFamily: theme.fontFamily,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
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
                            color: datePillText,
                            fontSize: '12px',
                            fontFamily: theme.fontFamily,
                            cursor: 'text',
                            textAlign: 'center',
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
                    </span>
                  </div>
                )}
                <div style={{ marginBottom: isLastInGroup ? '8px' : '2px' }}>
                  <ChatBubble
                    message={msg}
                    theme={theme}
                    isLastInGroup={isLastInGroup}
                    showAvatar={showAvatar}
                    isLastSentMessage={isLastSentMessage}
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
          })}
        </div>
      </div>
    </div>
  )
}
