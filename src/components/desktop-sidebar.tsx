import { Button } from '@/components/ui/button'
import { preloadExport } from '../utils/export'
import { PLATFORMS, PLATFORM_LABELS, PLATFORM_COLORS, PLATFORM_ICONS } from '../platforms'
import type { ChatTheme, ColorMode, Platform } from '../types/theme'

interface DesktopSidebarProps {
  platform: Platform
  colorMode: ColorMode
  theme: ChatTheme
  accentTextColor: string
  isExporting: boolean
  onSetPlatform: (p: Platform) => void
  onSetColorMode: (m: ColorMode) => void
  onOpenContact: () => void
  onAiGenerate: () => void
  onExport: () => void
}

export function DesktopSidebar({
  platform,
  colorMode,
  theme,
  accentTextColor,
  isExporting,
  onSetPlatform,
  onSetColorMode,
  onOpenContact,
  onAiGenerate,
  onExport,
}: DesktopSidebarProps) {
  return (
    <div
      className={`hidden md:flex flex-col items-center py-3 w-18 shrink-0 border-r ${colorMode === 'dark' ? 'border-white/10' : 'border-black/10'}`}
      style={{ backgroundColor: theme.chatBg }}
    >
      {/* Platform selector */}
      <div
        className={`flex flex-col items-center gap-0.5 w-full pb-2 mb-2 border-b ${colorMode === 'dark' ? 'border-white/10' : 'border-black/10'}`}
      >
        <span className={`text-[9px] tracking-tight font-bold uppercase mb-1 ${colorMode === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
          Platform
        </span>
        {PLATFORMS.map((p) => {
          const isActive = platform === p
          const pColor = PLATFORM_COLORS[p]
          return (
            <Button
              key={p}
              variant="custom"
              onClick={() => onSetPlatform(p)}
              className={`flex flex-col gap-0.5 w-14 h-auto py-2 rounded-lg duration-150 ${!isActive ? (colorMode === 'dark' ? 'text-white/60' : 'text-black/55') : ''}`}
              style={
                isActive
                  ? {
                      color: p === 'whatsapp' && colorMode === 'light' ? '#065f46' : pColor,
                      backgroundColor: `${pColor}18`,
                    }
                  : undefined
              }
            >
              <i className={`${PLATFORM_ICONS[p]} text-base`} aria-hidden="true" />
              <span className="text-xs font-medium leading-none">{PLATFORM_LABELS[p]}</span>
            </Button>
          )
        })}
      </div>

      <span className={`text-[9px] tracking-tight font-bold uppercase mb-1 ${colorMode === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
        Setting
      </span>
      <div className="flex flex-col items-center gap-0.5 flex-1">
        {/* Dark / Light */}
        {(['dark', 'light'] as ColorMode[]).map((mode) => (
          <Button
            key={mode}
            variant="custom"
            onClick={() => onSetColorMode(mode)}
            className={`flex flex-col gap-0.5 w-14 h-auto py-2 rounded-lg duration-150 ${
              colorMode === mode
                ? colorMode === 'dark'
                  ? 'text-white bg-white/10'
                  : 'text-slate-900 bg-black/10'
                : colorMode === 'dark'
                  ? 'text-white/60'
                  : 'text-black/55'
            }`}
          >
            <i className={`${mode === 'dark' ? 'ri-moon-line' : 'ri-sun-line'} text-base`} aria-hidden="true" />
            <span className="text-xs font-medium leading-none">{mode === 'dark' ? 'Dark' : 'Light'}</span>
          </Button>
        ))}

        {/* Recipient */}
        <Button
          variant="custom"
          onClick={onOpenContact}
          className={`flex flex-col gap-0.5 w-14 h-auto py-2 rounded-lg opacity-60 hover:opacity-90 ${colorMode === 'dark' ? 'text-white' : 'text-black'}`}
        >
          <i className="ri-user-line text-base" aria-hidden="true" />
          <span className="text-xs font-medium leading-none">Recipient</span>
        </Button>

        {/* AI Generate */}
        <Button
          variant="custom"
          onClick={onAiGenerate}
          className="flex flex-col gap-0.5 w-14 h-auto py-2 rounded-lg duration-150"
          style={{ color: accentTextColor }}
        >
          <i className="ri-sparkling-2-line text-base" aria-hidden="true" />
          <span className="text-xs font-medium leading-none">AI Generate</span>
        </Button>
      </div>

      {/* Export button */}
      <Button
        variant="custom"
        onClick={onExport}
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
  )
}
