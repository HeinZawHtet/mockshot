import { Button } from '@/components/ui/button'
import { preloadExport } from '../utils/export'
import type { ChatTheme, ColorMode } from '../types/theme'
import logoSvg from '../assets/logo.svg'

interface MobileTopBarProps {
  colorMode: ColorMode
  theme: ChatTheme
  accentColor: string
  accentTextColor: string
  isExporting: boolean
  onAiGenerate: () => void
  onSettings: () => void
  onExport: () => void
}

export function MobileTopBar({
  colorMode,
  theme,
  accentColor,
  accentTextColor,
  isExporting,
  onAiGenerate,
  onSettings,
  onExport,
}: MobileTopBarProps) {
  return (
    <div
      className={`md:hidden shrink-0 flex items-center justify-between px-3 border-b ${colorMode === 'dark' ? 'border-white/10' : 'border-black/10'}`}
      style={{
        paddingTop: 'max(8px, env(safe-area-inset-top))',
        paddingBottom: '8px',
        backgroundColor: theme.chatBg,
      }}
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
          onClick={onAiGenerate}
          aria-label="Generate conversation"
          className="size-10 rounded-xl"
          style={{ color: accentTextColor }}
        >
          <i className="ri-sparkling-2-line text-xl" aria-hidden="true" />
        </Button>
        <Button
          variant="custom"
          onClick={onSettings}
          aria-label="Open settings"
          className={`size-10 rounded-xl ${colorMode === 'dark' ? 'text-white/70' : 'text-black/60'}`}
        >
          <i className="ri-settings-3-line text-base text-xl" aria-hidden="true" />
        </Button>
        <Button
          variant="custom"
          onClick={onExport}
          onMouseEnter={preloadExport}
          onFocus={preloadExport}
          disabled={isExporting}
          className="h-9 px-3 rounded-xl font-bold text-white gap-1.5"
          style={{
            backgroundColor: isExporting ? undefined : accentColor,
            cursor: isExporting ? 'wait' : 'pointer',
          }}
        >
          <i className="ri-download-2-line" aria-hidden="true" />
          {isExporting ? 'Saving…' : 'Export'}
        </Button>
      </div>
    </div>
  )
}
