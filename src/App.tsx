import { useState, useRef, useCallback, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import type { Message } from './types/message'
import type { Platform, ColorMode } from './types/theme'
import { iMessageDark, iMessageLight } from './themes/imessage'
import { whatsAppDark, whatsAppLight } from './themes/whatsapp'
import { messengerLight, messengerDark } from './themes/messenger'
import { IMessageChat } from './modules/chat/imessage/imessage-chat'
import { WhatsAppChat } from './modules/chat/whatsapp/whatsapp-chat'
import { MessengerChat } from './modules/chat/messenger/messenger-chat'
import { generateId, getAvatarColor, getInitials } from './utils/helpers'
import { getSeedMessages } from './data/seed-messages'
import { exportAsPng, preloadExport } from './utils/export'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import logoSvg from './assets/logo.svg'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { AiGenerateDrawer } from '@/components/ai-generate-drawer'
import type { GeneratedMessage } from '@/types/ai'

const PLATFORMS: Platform[] = ['imessage', 'whatsapp', 'messenger']

const PLATFORM_META: Record<Platform, { title: string; description: string; canonical: string }> = {
  imessage: {
    title: 'iMessage Screenshot Generator — MockShot',
    description: 'Create realistic fake iMessage screenshots instantly. Customize conversations with dark/light mode and export as PNG. Free to use.',
    canonical: 'https://mockshot.io/imessage',
  },
  whatsapp: {
    title: 'WhatsApp Screenshot Generator — MockShot',
    description: 'Generate fake WhatsApp chat screenshots for free. Set sender, receiver, and timestamps. Export as high-quality PNG instantly.',
    canonical: 'https://mockshot.io/whatsapp',
  },
  messenger: {
    title: 'Facebook Messenger Screenshot Generator — MockShot',
    description: 'Create fake Facebook Messenger chat screenshots online. Customize names, avatars, and reactions. Free PNG export.',
    canonical: 'https://mockshot.io/messenger',
  },
}

function pathToPlatform(pathname: string): Platform {
  if (pathname.startsWith('/whatsapp')) return 'whatsapp'
  if (pathname.startsWith('/messenger')) return 'messenger'
  return 'imessage'
}
const PLATFORM_LABELS: Record<Platform, string> = {
  imessage: 'iMessage',
  whatsapp: 'WhatsApp',
  messenger: 'Messenger',
}
const PLATFORM_COLORS: Record<Platform, string> = {
  imessage: '#2B7EFB',
  whatsapp: '#25D366',
  messenger: '#0084FF',
}
const PLATFORM_ICONS: Record<Platform, string> = {
  imessage: 'ri-chat-3-line',
  whatsapp: 'ri-whatsapp-line',
  messenger: 'ri-messenger-line',
}

function getTheme(platform: Platform, colorMode: ColorMode) {
  if (platform === 'imessage') return colorMode === 'dark' ? iMessageDark : iMessageLight
  if (platform === 'whatsapp') return colorMode === 'dark' ? whatsAppDark : whatsAppLight
  return colorMode === 'dark' ? messengerDark : messengerLight
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [platform, setPlatform] = useState<Platform>(() => pathToPlatform(location.pathname))
  const [colorMode, setColorMode] = useState<ColorMode>('dark')
  const [contactName, setContactName] = useState('Alice')
  const [inputText, setInputText] = useState('')
  const [senderRole, setSenderRole] = useState<'me' | 'them'>('them')
  const [isExporting, setIsExporting] = useState(false)
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false)
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false)
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<Message[]>(getSeedMessages)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const theme = getTheme(platform, colorMode)
  const accentColor = PLATFORM_COLORS[platform]
  // For text on light backgrounds, WhatsApp green is too low contrast — use emerald-800 instead
  const accentTextColor = platform === 'whatsapp' && colorMode === 'light' ? '#065f46' : accentColor

  const handleAddMessage = useCallback(() => {
    if (!inputText.trim()) return
    setMessages(prev => [...prev, {
      id: generateId(),
      text: inputText.trim(),
      sender: senderRole,
      timestamp: new Date().toISOString(),
    }])
    setInputText('')
    textareaRef.current?.focus()
  }, [inputText, senderRole])

  const handleDeleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id))
  }, [])

  const handleClearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const handleInsertGenerated = useCallback((
    rawMessages: GeneratedMessage[],
    mode: 'replace' | 'append'
  ) => {
    const base = new Date()
    base.setHours(base.getHours() - 1)
    const newMessages = rawMessages.map((m, i) => ({
      id: generateId(),
      text: m.text,
      sender: m.sender,
      timestamp: new Date(base.getTime() + i * 90_000).toISOString(),
    }))
    if (mode === 'replace') setMessages(newMessages)
    else setMessages(prev => [...prev, ...newMessages])
  }, [])

  const handleEditMessage = useCallback((id: string, newText: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, text: newText } : m))
  }, [])

  const handleEditTimestamp = useCallback((id: string, newTimestamp: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, timestamp: newTimestamp } : m))
  }, [])

  const handleToggleReaction = useCallback((id: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== id) return m
      const reactions = m.reactions ?? []
      return {
        ...m,
        reactions: reactions.includes(emoji)
          ? reactions.filter(r => r !== emoji)
          : [...reactions, emoji],
      }
    }))
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return
    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isMobile) return
    if (!e.shiftKey) {
      e.preventDefault()
      handleAddMessage()
    }
  }, [handleAddMessage])

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    await exportAsPng('phone-frame', `mockshot-${platform}-${colorMode}`)
    setIsExporting(false)
  }, [platform, colorMode])

  const handleAvatarFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      if (typeof ev.target?.result === 'string') setAvatarUrl(ev.target.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [])

  const handleSetPlatform = useCallback((p: Platform) => {
    setPlatform(p)
    navigate(`/${p}`, { replace: true })
  }, [navigate])

  useEffect(() => {
    const isRoot = location.pathname === '/' || location.pathname === ''
    const title = isRoot ? 'MockShot — Fake Chat Screenshot Generator' : PLATFORM_META[platform].title
    const desc = isRoot
      ? 'Create realistic fake iMessage, WhatsApp, and Messenger screenshots instantly. Free, no sign-up required.'
      : PLATFORM_META[platform].description
    document.title = title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', desc)
  }, [platform, location.pathname])

  // Revoke previous object URLs on unmount (data URLs don't need it, but good practice)
  useEffect(() => () => { if (avatarUrl?.startsWith('blob:')) URL.revokeObjectURL(avatarUrl) }, [avatarUrl])

  return (
    <>
    <div className="flex flex-col h-dvh w-screen overflow-hidden">

      {/* Mobile top bar */}
      <div
        className={`md:hidden shrink-0 flex items-center justify-between px-3 border-b ${colorMode === 'dark' ? 'border-white/10' : 'border-black/10'}`}
        style={{ paddingTop: 'max(8px, env(safe-area-inset-top))', paddingBottom: '8px', backgroundColor: theme.chatBg }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
          >
            <img src={logoSvg} alt="" aria-hidden="true" className="w-4 h-4 object-contain" />
          </div>
          <span className={`text-base font-bold tracking-tight ${colorMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            MockShot
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="custom"
            onClick={() => setAiDrawerOpen(true)}
            aria-label="Generate conversation"
            className="size-10 rounded-xl"
            style={{ color: accentTextColor }}
          >
            <i className="ri-sparkling-2-line text-xl" aria-hidden="true" />
          </Button>
          <Button
            variant="custom"
            onClick={() => setMobileSettingsOpen(true)}
            aria-label="Open settings"
            className={`size-10 rounded-xl ${colorMode === 'dark' ? 'text-white/70' : 'text-black/60'}`}
          >
            <i className="ri-settings-3-line text-base text-xl" aria-hidden="true" />
          </Button>
          <Button
            variant="custom"
            onClick={handleExport}
            onMouseEnter={preloadExport}
            onFocus={preloadExport}
            disabled={isExporting}
            className="h-9 px-3 rounded-xl font-bold text-white gap-1.5"
            style={{ backgroundColor: isExporting ? undefined : accentColor, cursor: isExporting ? 'wait' : 'pointer' }}
          >
            <i className="ri-download-2-line" aria-hidden="true" />
            {isExporting ? 'Saving…' : 'Export'}
          </Button>
        </div>
      </div>

      {/* CENTER: Conversation preview */}
      <main className="flex-1 flex md:items-center md:justify-center overflow-hidden min-h-0" style={{ backgroundColor: theme.chatBg }}>
        <div className="flex h-full items-stretch w-full md:w-auto">

          {/* Vertical toolbar — desktop only */}
          <div
            className={`hidden md:flex flex-col items-center py-3 w-18 shrink-0 border-r ${colorMode === 'dark' ? 'border-white/10' : 'border-black/10'}`}
            style={{ backgroundColor: theme.chatBg }}
          >
            {/* Platform selector */}
            <div className={`flex flex-col items-center gap-0.5 w-full pb-2 mb-2 border-b ${colorMode === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
              <span className={`text-[9px] tracking-tight font-bold uppercase mb-1 ${colorMode === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
                Platform
              </span>
              {PLATFORMS.map(p => {
                const isActive = platform === p
                const pColor = PLATFORM_COLORS[p]
                return (
                  <Button
                    key={p}
                    variant="custom"
                    onClick={() => handleSetPlatform(p)}
                    className={`flex flex-col gap-0.5 w-14 h-auto py-2 rounded-lg duration-150 ${!isActive ? (colorMode === 'dark' ? 'text-white/60' : 'text-black/55') : ''}`}
                    style={isActive ? { color: (p === 'whatsapp' && colorMode === 'light') ? '#065f46' : pColor, backgroundColor: `${pColor}18` } : undefined}
                  >
                    <i className={`${PLATFORM_ICONS[p]} text-base`} aria-hidden="true" />
                    <span className="text-xs font-medium leading-none">{PLATFORM_LABELS[p]}</span>
                  </Button>
                )
              })}
            </div>

            {/* Top tools */}


            <span className={`text-[9px] tracking-tight font-bold uppercase mb-1 ${colorMode === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
              Setting
            </span>
            <div className="flex flex-col items-center gap-0.5 flex-1">
              {/* Dark / Light */}
              {(['dark', 'light'] as ColorMode[]).map(mode => (
                <Button
                  key={mode}
                  variant="custom"
                  onClick={() => setColorMode(mode)}
                  className={`flex flex-col gap-0.5 w-14 h-auto py-2 rounded-lg duration-150 ${
                    colorMode === mode
                      ? colorMode === 'dark' ? 'text-white bg-white/10' : 'text-slate-900 bg-black/10'
                      : colorMode === 'dark' ? 'text-white/60' : 'text-black/55'
                  }`}
                >
                  <i className={`${mode === 'dark' ? 'ri-moon-line' : 'ri-sun-line'} text-base`} aria-hidden="true" />
                  <span className="text-xs font-medium leading-none">{mode === 'dark' ? 'Dark' : 'Light'}</span>
                </Button>
              ))}

              {/* Recipient */}
              <Button
                variant="custom"
                onClick={() => setContactDrawerOpen(true)}
                className={`flex flex-col gap-0.5 w-14 h-auto py-2 rounded-lg opacity-60 hover:opacity-90 ${colorMode === 'dark' ? 'text-white' : 'text-black'}`}
              >
                <i className="ri-user-line text-base" aria-hidden="true" />
                <span className="text-xs font-medium leading-none">Recipient</span>
              </Button>

              {/* AI Generate */}
              <Button
                variant="custom"
                onClick={() => setAiDrawerOpen(true)}
                className={`flex flex-col gap-0.5 w-14 h-auto py-2 rounded-lg duration-150`}
                style={{ color: accentTextColor }}
              >
                <i className="ri-sparkling-2-line text-base" aria-hidden="true" />
                <span className="text-xs font-medium leading-none">AI Generate</span>
              </Button>
            </div>

            {/* Export button */}
            <Button
              variant="custom"
              onClick={handleExport}
              onMouseEnter={preloadExport}
              onFocus={preloadExport}
              disabled={isExporting}
              className={`flex flex-col gap-0.5 w-14 h-auto py-2 rounded-lg duration-150 ${isExporting ? (colorMode === 'dark' ? 'text-white/50' : 'text-black/50') : ''}`}
              style={{
                cursor: isExporting ? 'wait' : 'pointer',
                color: isExporting ? undefined : accentTextColor,
              }}
            >
              <i className="ri-download-2-line text-base" aria-hidden="true" />
              <span className="text-xs font-bold leading-none">{isExporting ? 'Saving…' : 'Export'}</span>
            </Button>

          </div>

          {/* Chat column */}
          <div className="h-full w-full md:w-96 flex flex-col overflow-hidden">

            {/* Logo + title — desktop only */}
            <div className="hidden md:flex shrink-0 items-center justify-center gap-2.5 pt-4 pb-1">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
              >
                <img src={logoSvg} alt="" aria-hidden="true" className="w-4 h-4 object-contain" />
              </div>
              <span className={`text-base font-bold tracking-tight ${colorMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Mock Shot
              </span>
            </div>


            {/* Exportable conversation */}
            <div id="phone-frame" className="flex-1 overflow-hidden" style={{ backgroundColor: theme.chatBg }}>
              {platform === 'imessage' && (
                <IMessageChat messages={messages} theme={theme} contactName={contactName} onDeleteMessage={handleDeleteMessage} onEditMessage={handleEditMessage} onEditTimestamp={handleEditTimestamp} onReact={handleToggleReaction} onAvatarClick={() => setContactDrawerOpen(true)} avatarUrl={avatarUrl ?? undefined} />
              )}
              {platform === 'whatsapp' && (
                <WhatsAppChat messages={messages} theme={theme} contactName={contactName} onDeleteMessage={handleDeleteMessage} onEditMessage={handleEditMessage} onEditTimestamp={handleEditTimestamp} onReact={handleToggleReaction} onAvatarClick={() => setContactDrawerOpen(true)} avatarUrl={avatarUrl ?? undefined} />
              )}
              {platform === 'messenger' && (
                <MessengerChat messages={messages} theme={theme} contactName={contactName} onDeleteMessage={handleDeleteMessage} onEditMessage={handleEditMessage} onEditTimestamp={handleEditTimestamp} onReact={handleToggleReaction} onAvatarClick={() => setContactDrawerOpen(true)} avatarUrl={avatarUrl ?? undefined} />
              )}
            </div>

            {/* Compose bar — not exported */}
            <div className="shrink-0 px-3 pt-2.5" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
              {/* Sender role toggle */}
              <div className="flex gap-1.5 mb-2 items-center">
                {(['them', 'me'] as const).map(role => (
                  <Button
                    key={role}
                    variant="custom"
                    onClick={() => setSenderRole(role)}
                    className={`px-3 py-1 h-auto rounded-lg text-xs font-semibold border ${senderRole !== role
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
                  onClick={handleClearMessages}
                  disabled={messages.length === 0}
                  className={`ml-auto px-3 py-1 h-auto rounded-lg text-xs font-semibold border ${
                    messages.length === 0
                      ? colorMode === 'dark' ? 'border-white/15 text-white/25' : 'border-black/10 text-black/25'
                      : colorMode === 'dark' ? 'border-red-500/40 text-red-400 hover:bg-red-500/10' : 'border-red-400/40 text-red-500 hover:bg-red-50'
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
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  rows={2}
                  className={`flex-1 min-h-0 resize-none rounded-xl px-3 py-2 leading-relaxed ${colorMode === 'dark'
                      ? 'border-white/35 bg-white/10 text-slate-100 placeholder:text-white/40'
                      : 'border-black/20 bg-white/65 text-slate-950 placeholder:text-black/40'
                    }`}
                  style={{ fontFamily: 'inherit' }}
                />
                <Button
                  variant="custom"
                  size="icon"
                  onClick={handleAddMessage}
                  disabled={!inputText.trim()}
                  className={`rounded-xl ${inputText.trim()
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
          </div>
        </div>
      </main>

      {/* Mobile settings drawer */}
      <Drawer open={mobileSettingsOpen} onOpenChange={setMobileSettingsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 flex flex-col gap-5">
            {/* Platform */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-2">Platform</p>
              <div className="flex gap-2">
                {PLATFORMS.map(p => {
                  const isActive = platform === p
                  const pColor = PLATFORM_COLORS[p]
                  return (
                    <button
                      key={p}
                      onClick={() => handleSetPlatform(p)}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all"
                      style={isActive
                        ? { borderColor: pColor, backgroundColor: `${pColor}12`, color: pColor }
                        : { borderColor: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.5)' }
                      }
                    >
                      <i className={`${PLATFORM_ICONS[p]} text-lg`} aria-hidden="true" />
                      <span className="text-xs font-medium leading-none">{PLATFORM_LABELS[p]}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            {/* Theme */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-2">Theme</p>
              <div className="flex gap-2">
                {(['dark', 'light'] as ColorMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setColorMode(mode)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${colorMode === mode ? 'border-black/20 bg-black/5 text-black' : 'border-black/10 text-black/50'}`}
                  >
                    <i className={mode === 'dark' ? 'ri-moon-line' : 'ri-sun-line'} aria-hidden="true" />
                    {mode === 'dark' ? 'Dark' : 'Light'}
                  </button>
                ))}
              </div>
            </div>
            {/* Recipient */}
            <button
              onClick={() => { setMobileSettingsOpen(false); setTimeout(() => setContactDrawerOpen(true), 300) }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-black/10"
            >
              <i className="ri-user-line text-base text-black/50" aria-hidden="true" />
              <div className="flex flex-col items-start">
                <span className="text-xs text-black/40">Recipient</span>
                <span className="text-sm font-medium text-black/80">{contactName}</span>
              </div>
              <i className="ri-arrow-right-s-line text-black/30 ml-auto" aria-hidden="true" />
            </button>
            {/* About Us — mobile only */}
            <Link
              to="/about"
              onClick={() => setMobileSettingsOpen(false)}
              className="text-sm text-black/50 hover:text-black/70 underline underline-offset-2 text-center"
            >
              About Us
            </Link>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Contact name drawer */}
      <Drawer open={contactDrawerOpen} onOpenChange={setContactDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Recipient</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 flex flex-col gap-4 w-full max-w-sm mx-auto">
            {/* Avatar preview + upload */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative group focus:outline-none"
                aria-label="Upload profile photo"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden text-white text-2xl font-bold select-none"
                  style={{ backgroundColor: avatarUrl ? 'transparent' : getAvatarColor(contactName) }}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={contactName} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(contactName)
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                  <i className="ri-camera-line text-white text-xl" aria-hidden="true" />
                </div>
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-medium text-black/50 hover:text-black/70 transition-colors"
                >
                  Upload photo
                </button>
                {avatarUrl && (
                  <>
                    <span className="text-black/20">·</span>
                    <button
                      type="button"
                      onClick={() => setAvatarUrl(null)}
                      className="text-xs font-medium text-red-400 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </div>
            {/* Name input */}
            <input
              type="text"
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              placeholder="Enter recipient's name…"
              autoFocus
              className="w-full rounded-xl px-4 py-3 text-base outline-none border border-black/15 bg-black/5 text-slate-950 placeholder:text-black/35"
              style={{ fontFamily: 'inherit' }}
              onKeyDown={e => { if (e.key === 'Enter') setContactDrawerOpen(false) }}
            />
            <Button
              variant="custom"
              onClick={() => setContactDrawerOpen(false)}
              className="w-full py-3 h-auto rounded-xl font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, fontFamily: 'inherit' }}
            >
              Save
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
    <Button variant="link" size="sm" className={`hidden md:inline-flex fixed top-4 right-4 z-50 ${colorMode === 'dark' ? 'text-white/50 hover:text-white' : 'text-black/40 hover:text-black'}`} asChild>
      <Link to="/about">About</Link>
    </Button>
    <AiGenerateDrawer
      open={aiDrawerOpen}
      onOpenChange={setAiDrawerOpen}
      platform={platform}
      contactName={contactName}
      accentColor={accentColor}
      onInsert={handleInsertGenerated}
    />
    </>
  )
}
