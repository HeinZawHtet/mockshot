import type { RefObject } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { ColorMode } from '../types/theme'
import type { Message } from '../types/message'

interface ComposeBarProps {
  colorMode: ColorMode
  accentColor: string
  accentTextColor: string
  senderRole: 'me' | 'them'
  inputText: string
  messages: Message[]
  textareaRef: RefObject<HTMLTextAreaElement | null>
  onSenderRoleChange: (role: 'me' | 'them') => void
  onInputChange: (text: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onAddMessage: () => void
  onClearMessages: () => void
}

export function ComposeBar({
  colorMode,
  accentColor,
  accentTextColor,
  senderRole,
  inputText,
  messages,
  textareaRef,
  onSenderRoleChange,
  onInputChange,
  onKeyDown,
  onAddMessage,
  onClearMessages,
}: ComposeBarProps) {
  return (
    <div
      className="shrink-0 px-3 pt-2.5"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      {/* Sender role toggle */}
      <div className="flex gap-1.5 mb-2 items-center">
        {(['them', 'me'] as const).map((role) => (
          <Button
            key={role}
            variant="custom"
            onClick={() => onSenderRoleChange(role)}
            className={`px-3 py-1 h-auto rounded-lg text-xs font-semibold border ${
              senderRole !== role
                ? colorMode === 'dark'
                  ? 'border-white/40 text-white/85'
                  : 'border-black/25 text-black/60'
                : ''
            }`}
            style={{
              ...(senderRole === role && {
                borderColor: accentTextColor,
                backgroundColor: `${accentColor}35`,
                color: accentTextColor,
              }),
              fontFamily: 'inherit',
            }}
          >
            {role === 'them' ? 'Received' : 'Sent'}
          </Button>
        ))}
        <Button
          variant="custom"
          onClick={onClearMessages}
          disabled={messages.length === 0}
          className={`ml-auto px-3 py-1 h-auto rounded-lg text-xs font-semibold border ${
            messages.length === 0
              ? colorMode === 'dark'
                ? 'border-white/15 text-white/25'
                : 'border-black/10 text-black/25'
              : colorMode === 'dark'
                ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
                : 'border-red-400/40 text-red-500 hover:bg-red-50'
          }`}
          aria-label="Clear all messages"
        >
          <i className="ri-delete-bin-line" aria-hidden="true" />
          Clear
        </Button>
      </div>

      {/* Input + send */}
      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message…"
          rows={2}
          className={`flex-1 min-h-0 resize-none rounded-xl px-3 py-2 leading-relaxed ${
            colorMode === 'dark'
              ? 'border-white/35 bg-white/10 text-slate-100 placeholder:text-white/40'
              : 'border-black/20 bg-white/65 text-slate-950 placeholder:text-black/40'
          }`}
          style={{ fontFamily: 'inherit' }}
        />
        <Button
          variant="custom"
          size="icon"
          onClick={onAddMessage}
          disabled={!inputText.trim()}
          className={`rounded-xl ${
            inputText.trim()
              ? 'text-white'
              : colorMode === 'dark'
                ? 'bg-white/20 text-white/55'
                : 'bg-black/15 text-black/40'
          }`}
          style={{ backgroundColor: inputText.trim() ? accentColor : undefined }}
          aria-label="Add message"
        >
          <i className="ri-arrow-up-line text-base" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
