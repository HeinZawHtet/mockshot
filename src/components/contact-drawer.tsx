import { useRef } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { getAvatarColor, getInitials } from '../utils/helpers'

interface ContactDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contactName: string
  avatarUrl: string | null
  accentColor: string
  onContactNameChange: (name: string) => void
  onAvatarFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveAvatar: () => void
}

export function ContactDrawer({
  open,
  onOpenChange,
  contactName,
  avatarUrl,
  accentColor,
  onContactNameChange,
  onAvatarFileChange,
  onRemoveAvatar,
}: ContactDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
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
                    onClick={onRemoveAvatar}
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
              onChange={onAvatarFileChange}
            />
          </div>
          {/* Name input */}
          <input
            type="text"
            value={contactName}
            onChange={(e) => onContactNameChange(e.target.value)}
            placeholder="Enter recipient's name…"
            autoFocus
            className="w-full rounded-xl px-4 py-3 text-base outline-none border border-black/15 bg-black/5 text-slate-950 placeholder:text-black/35"
            style={{ fontFamily: 'inherit' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onOpenChange(false)
            }}
          />
          <Button
            variant="custom"
            onClick={() => onOpenChange(false)}
            className="w-full py-3 h-auto rounded-xl font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              fontFamily: 'inherit',
            }}
          >
            Save
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
