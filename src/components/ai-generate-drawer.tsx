import { useState, useEffect, useCallback } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import type { GeneratedMessage } from '@/types/ai'
import type { Platform } from '@/types/theme'
import {
  generateConversation,
  getCustomConfig,
  saveCustomConfig,
  clearCustomConfig,
  getUsageCount,
} from '@/utils/ai'

const DAILY_LIMIT = 5

const TEMPLATES: Record<string, Array<{ label: string; prompt: string }>> = {
  Work: [
    { label: 'Getting Fired', prompt: 'A boss fires an employee over text in the most unprofessional way possible' },
    { label: 'Unreasonable Boss', prompt: 'Boss texts demanding I work overtime on my day off, I finally push back' },
  ],
  Scary: [
    { label: '3AM Text', prompt: 'Receiving a cryptic terrifying text at 3am from an unknown number that seems to know where I am' },
    { label: 'Wrong Number', prompt: 'A wrong number text that slowly escalates into something deeply unsettling' },
    { label: "Still Outside", prompt: "Friend frantically texts that someone has been standing outside their house for hours and won't leave" },
    { label: 'Someone Knows', prompt: "Anonymous texts claiming someone knows a dark secret I've kept hidden for years" },
    { label: "Don't Come Home", prompt: 'Urgent texts warning me not to come home tonight — something is very wrong inside' },
  ],
  Positive: [
    { label: 'Big Announcement', prompt: 'Sharing an exciting life announcement over text — friends and family react with joy and surprise' },
  ],
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  platform: Platform
  contactName: string
  accentColor: string
  onInsert: (messages: GeneratedMessage[], mode: 'replace' | 'append') => void
}

export function AiGenerateDrawer({ open, onOpenChange, platform, contactName, accentColor, onInsert }: Props) {
  const [scenario, setScenario] = useState('')
  const [insertMode, setInsertMode] = useState<'replace' | 'append'>('replace')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [customModel, setCustomModel] = useState('')
  const [customApiKey, setCustomApiKey] = useState('')
  const [hasCustomKey, setHasCustomKey] = useState(false)
  const [usageCount, setUsageCount] = useState(0)

  useEffect(() => {
    if (!open) return
    const config = getCustomConfig()
    if (config) {
      setCustomModel(config.model)
      setCustomApiKey(config.apiKey)
      setHasCustomKey(true)
    } else {
      setHasCustomKey(false)
    }
    setUsageCount(getUsageCount())
    setError(null)
  }, [open])

  const handleTemplateClick = useCallback((prompt: string) => {
    setScenario(prompt)
    setError(null)
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!scenario.trim() || isGenerating) return
    setIsGenerating(true)
    setError(null)
    try {
      const messages = await generateConversation({ scenario, platform, contactName })
      onInsert(messages, insertMode)
      setUsageCount(getUsageCount())
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [scenario, platform, contactName, insertMode, isGenerating, onInsert, onOpenChange])

  const handleSaveCustom = useCallback(() => {
    if (!customApiKey.trim() || !customModel.trim()) return
    saveCustomConfig(customApiKey.trim(), customModel.trim())
    setHasCustomKey(true)
    setError(null)
  }, [customApiKey, customModel])

  const handleClearCustom = useCallback(() => {
    clearCustomConfig()
    setCustomApiKey('')
    setCustomModel('')
    setHasCustomKey(false)
  }, [])

  const remaining = Math.max(0, DAILY_LIMIT - usageCount)
  const isLimitReached = !hasCustomKey && remaining === 0

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2 justify-center">
            <i className="ri-sparkling-2-line" aria-hidden="true" />
            Generate Conversation
          </DrawerTitle>
        </DrawerHeader>

        <div className="overflow-y-auto max-h-[75vh]">
          <div className="max-w-md mx-auto px-4 pb-8 flex flex-col gap-5">
            {/* Template groups */}
            {Object.entries(TEMPLATES).map(([category, templates]) => (
              <div key={category}>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-2">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {templates.map(t => {
                    const isSelected = scenario === t.prompt
                    return (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => handleTemplateClick(t.prompt)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${isSelected ? '' : 'border-black/15 text-black/55 hover:border-black/30'
                          }`}
                        style={
                          isSelected
                            ? { borderColor: accentColor, backgroundColor: `${accentColor}15`, color: accentColor }
                            : undefined
                        }
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Scenario textarea */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-2">Scenario</p>
              <textarea
                value={scenario}
                onChange={e => { setScenario(e.target.value); setError(null) }}
                placeholder="Describe your conversation scenario…"
                rows={3}
                className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none border border-black/15 bg-black/5 text-slate-950 placeholder:text-black/35 leading-relaxed"
                style={{ fontFamily: 'inherit' }}
              />
            </div>

            {/* Insert mode */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-2">Insert Mode</p>
              <div className="flex gap-2">
                {(['replace', 'append'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setInsertMode(mode)}
                    className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all"
                    style={
                      insertMode === mode
                        ? { borderColor: accentColor, backgroundColor: `${accentColor}15`, color: accentColor }
                        : { borderColor: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.5)' }
                    }
                  >
                    {mode === 'replace' ? 'Replace chat' : 'Add to chat'}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error !== null && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            {/* Generate button */}
            <Button
              variant="custom"
              onClick={handleGenerate}
              disabled={!scenario.trim() || isGenerating || isLimitReached}
              className="w-full py-3 h-auto rounded-xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                fontFamily: 'inherit',
              }}
            >
              {isGenerating ? (
                <>
                  <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
                  Generating…
                </>
              ) : (
                <>
                  <i className="ri-sparkling-2-line" aria-hidden="true" />
                  Generate
                </>
              )}
            </Button>

            {/* Usage info */}
            {hasCustomKey ? (
              <p className="text-xs text-center text-black/40">Using your API key · no daily limit</p>
            ) : (
              <p className={`text-xs text-center ${remaining === 0 ? 'text-red-400' : 'text-black/40'}`}>
                {remaining === 0
                  ? 'Daily limit reached. Try again tomorrow or use your own API key.'
                  : `${remaining} of ${DAILY_LIMIT} free generations left today`}
              </p>
            )}

            {/* Advanced section */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="border border-black/10 rounded-xl overflow-hidden">
              <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-black/60 hover:bg-black/5 transition-colors">
                <span className="flex items-center gap-2">
                  <i className="ri-settings-3-line text-base" aria-hidden="true" />
                  Advanced · Use your own API key
                </span>
                <i className={`ri-arrow-down-s-line text-base transition-transform ${advancedOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-4 pb-4 flex flex-col gap-3 border-t border-black/10">
                  <div className="pt-3 flex flex-col gap-3">
                    <div>
                      <label className="text-xs text-black/50 mb-1 block">Model</label>
                      <input
                        type="text"
                        value={customModel}
                        onChange={e => setCustomModel(e.target.value)}
                        placeholder="anthropic/claude-haiku-4-5-20251001"
                        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none border border-black/15 bg-black/5 text-slate-950 placeholder:text-black/35"
                        style={{ fontFamily: 'inherit' }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-black/50 mb-1 block">API Key</label>
                      <input
                        type="password"
                        value={customApiKey}
                        onChange={e => setCustomApiKey(e.target.value)}
                        placeholder="sk-ant-… or sk-…"
                        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none border border-black/15 bg-black/5 text-slate-950 placeholder:text-black/35"
                        style={{ fontFamily: 'inherit' }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="custom"
                        onClick={handleSaveCustom}
                        disabled={!customApiKey.trim() || !customModel.trim()}
                        className="flex-1 py-2 h-auto rounded-xl font-semibold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                          fontFamily: 'inherit',
                        }}
                      >
                        Save key
                      </Button>
                      <Button
                        variant="custom"
                        onClick={handleClearCustom}
                        disabled={!hasCustomKey}
                        className="px-4 py-2 h-auto rounded-xl font-semibold border border-red-200 text-red-400 hover:bg-red-50"
                      >
                        Clear
                      </Button>
                    </div>
                    <p className="text-xs text-black/40">
                      Your key is stored in your browser only and never sent to our servers.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
