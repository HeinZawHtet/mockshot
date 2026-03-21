declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  window.gtag?.(...args);
}

export function trackPlatformSwitch(platform: string) {
  gtag("event", "platform_switch", { platform });
}

export function trackColorModeToggle(mode: string) {
  gtag("event", "color_mode_toggle", { mode });
}

export function trackMessageSent(platform: string, sender_role: string) {
  gtag("event", "message_sent", { platform, sender_role });
}

export function trackExport(platform: string, color_mode: string) {
  gtag("event", "export_png", { platform, color_mode });
}

export function trackAiGenerate(
  platform: string,
  scenario: string,
  insert_mode: string,
) {
  gtag("event", "ai_generate", { platform, scenario, insert_mode });
}

export function trackAvatarUpload() {
  gtag("event", "avatar_upload");
}

export function trackAvatarRemove() {
  gtag("event", "avatar_remove");
}

export function trackClearMessages() {
  gtag("event", "clear_messages");
}

export function trackReaction(emoji: string) {
  gtag("event", "message_reaction", { emoji });
}
