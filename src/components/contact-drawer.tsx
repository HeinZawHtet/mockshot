import { useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAvatarColor, getInitials } from "../utils/helpers";
import { useTheme } from "@/contexts/theme-context";

interface ContactDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName: string;
  avatarUrl: string | null;
  onContactNameChange: (name: string) => void;
  onAvatarFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
}

export function ContactDrawer({
  open,
  onOpenChange,
  contactName,
  avatarUrl,
  onContactNameChange,
  onAvatarFileChange,
  onRemoveAvatar,
}: ContactDrawerProps) {
  const { accentColor } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Recipient</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8 flex flex-col gap-4 w-full max-w-sm mx-auto">
          {/* Avatar preview + upload */}
          <div className="flex flex-col items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="relative group p-0 h-auto w-auto rounded-full hover:bg-transparent"
              aria-label="Upload profile photo"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden text-white text-2xl font-bold select-none"
                style={{
                  backgroundColor: avatarUrl
                    ? "transparent"
                    : getAvatarColor(contactName),
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={contactName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(contactName)
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                <i
                  className="ri-camera-line text-white text-xl"
                  aria-hidden="true"
                />
              </div>
            </Button>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                size="xs"
              >
                Upload photo
              </Button>
              {avatarUrl && (
                <>
                  <span className="text-black/20">·</span>
                  <Button
                    type="button"
                    size="xs"
                    variant="link"
                    style={{
                      color: "var(--destructive)",
                    }}
                    onClick={onRemoveAvatar}
                  >
                    Remove
                  </Button>
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
          <Input
            type="text"
            value={contactName}
            onChange={(e) => onContactNameChange(e.target.value)}
            placeholder="Enter recipient's name…"
            autoFocus
            style={{ fontFamily: "inherit" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onOpenChange(false);
            }}
          />
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Save
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
