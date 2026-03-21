import { Link } from 'react-router-dom'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { PLATFORMS, PLATFORM_LABELS, PLATFORM_COLORS, PLATFORM_ICONS } from '../platforms'
import type { ColorMode, Platform } from '../types/theme'

interface MobileSettingsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  platform: Platform
  colorMode: ColorMode
  contactName: string
  onSetPlatform: (p: Platform) => void
  onSetColorMode: (m: ColorMode) => void
  onOpenContact: () => void
}

export function MobileSettingsDrawer({
  open,
  onOpenChange,
  platform,
  colorMode,
  contactName,
  onSetPlatform,
  onSetColorMode,
  onOpenContact,
}: MobileSettingsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8 flex flex-col gap-5">
          {/* Platform */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-2">Platform</p>
            <div className="flex gap-2">
              {PLATFORMS.map((p) => {
                const isActive = platform === p
                const pColor = PLATFORM_COLORS[p]
                return (
                  <Button
                    key={p}
                    variant="ghost"
                    onClick={() => onSetPlatform(p)}
                    className="flex-1 flex-col gap-1.5 py-3 h-auto rounded-xl border hover:bg-transparent"
                    style={
                      isActive
                        ? { borderColor: pColor, backgroundColor: `${pColor}12`, color: pColor }
                        : { borderColor: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.5)' }
                    }
                  >
                    <i className={`${PLATFORM_ICONS[p]} text-lg`} aria-hidden="true" />
                    <span className="text-xs font-medium leading-none">{PLATFORM_LABELS[p]}</span>
                  </Button>
                )
              })}
            </div>
          </div>
          {/* Theme */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-2">Theme</p>
            <div className="flex gap-2">
              {(['dark', 'light'] as ColorMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant="ghost"
                  onClick={() => onSetColorMode(mode)}
                  className={`flex-1 py-2.5 h-auto rounded-xl border ${colorMode === mode ? 'border-black/20 bg-black/5 text-black' : 'border-black/10 text-black/50'}`}
                >
                  <i className={mode === 'dark' ? 'ri-moon-line' : 'ri-sun-line'} aria-hidden="true" />
                  {mode === 'dark' ? 'Dark' : 'Light'}
                </Button>
              ))}
            </div>
          </div>
          {/* Recipient */}
          <Button
            variant="ghost"
            onClick={() => {
              onOpenChange(false)
              setTimeout(() => onOpenContact(), 300)
            }}
            className="w-full justify-start gap-3 px-4 py-3 h-auto rounded-xl border border-black/10 hover:bg-black/5"
          >
            <i className="ri-user-line text-base text-black/50" aria-hidden="true" />
            <div className="flex flex-col items-start">
              <span className="text-xs text-black/40">Recipient</span>
              <span className="text-sm font-medium text-black/80">{contactName}</span>
            </div>
            <i className="ri-arrow-right-s-line text-black/30 ml-auto" aria-hidden="true" />
          </Button>
          {/* About Us */}
          <Link
            to="/about"
            onClick={() => onOpenChange(false)}
            className="text-sm text-black/50 hover:text-black/70 underline underline-offset-2 text-center"
          >
            About Us
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
