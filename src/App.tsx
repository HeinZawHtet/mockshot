import { useState, useRef, useCallback, useEffect, useReducer } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import type { Platform, ColorMode } from "./types/theme";
import { iMessageDark, iMessageLight } from "./themes/imessage";
import { whatsAppDark, whatsAppLight } from "./themes/whatsapp";
import { messengerLight, messengerDark } from "./themes/messenger";
import { IMessageChat } from "./modules/chat/imessage/imessage-chat";
import { WhatsAppChat } from "./modules/chat/whatsapp/whatsapp-chat";
import { MessengerChat } from "./modules/chat/messenger/messenger-chat";
import { generateId } from "./utils/helpers";
import { messagesReducer } from "./utils/messages-reducer";
import { getSeedMessages } from "./data/seed-messages";
import { exportAsPng } from "./utils/export";
import { Button } from "@/components/ui/button";
import { AiGenerateDrawer } from "@/components/ai-generate-drawer";
import { MobileTopBar } from "@/components/mobile-top-bar";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { ComposeBar } from "@/components/compose-bar";
import { MobileSettingsDrawer } from "@/components/mobile-settings-drawer";
import { ContactDrawer } from "@/components/contact-drawer";
import { PLATFORM_COLORS } from "./platforms";
import logoSvg from "./assets/logo.svg";
import type { GeneratedMessage } from "@/types/ai";

const PLATFORM_META: Record<
  Platform,
  { title: string; description: string; canonical: string }
> = {
  imessage: {
    title: "iMessage Screenshot Generator — MockShot",
    description:
      "Create realistic fake iMessage screenshots instantly. Customize conversations with dark/light mode and export as PNG. Free to use.",
    canonical: "https://mockshot.app/imessage",
  },
  whatsapp: {
    title: "WhatsApp Screenshot Generator — MockShot",
    description:
      "Generate fake WhatsApp chat screenshots for free. Set sender, receiver, and timestamps. Export as high-quality PNG instantly.",
    canonical: "https://mockshot.app/whatsapp",
  },
  messenger: {
    title: "Facebook Messenger Screenshot Generator — MockShot",
    description:
      "Create fake Facebook Messenger chat screenshots online. Customize names, avatars, and reactions. Free PNG export.",
    canonical: "https://mockshot.app/messenger",
  },
};

function pathToPlatform(pathname: string): Platform {
  if (pathname.startsWith("/whatsapp")) return "whatsapp";
  if (pathname.startsWith("/messenger")) return "messenger";
  return "imessage";
}

function getTheme(platform: Platform, colorMode: ColorMode) {
  if (platform === "imessage")
    return colorMode === "dark" ? iMessageDark : iMessageLight;
  if (platform === "whatsapp")
    return colorMode === "dark" ? whatsAppDark : whatsAppLight;
  return colorMode === "dark" ? messengerDark : messengerLight;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform>(() =>
    pathToPlatform(location.pathname),
  );
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [contactName, setContactName] = useState("Alice");
  const [inputText, setInputText] = useState("");
  const [senderRole, setSenderRole] = useState<"me" | "them">("them");
  const [isExporting, setIsExporting] = useState(false);
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [messages, dispatch] = useReducer(messagesReducer, getSeedMessages());

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const theme = getTheme(platform, colorMode);
  const accentColor = PLATFORM_COLORS[platform];
  // For text on light backgrounds, WhatsApp green is too low contrast — using emerald-800 instead
  const accentTextColor =
    platform === "whatsapp" && colorMode === "light" ? "#065f46" : accentColor;

  const handleAddMessage = useCallback(() => {
    if (!inputText.trim()) return;
    dispatch({
      type: "ADD",
      id: generateId(),
      text: inputText.trim(),
      sender: senderRole,
      timestamp: new Date().toISOString(),
    });
    setInputText("");
    textareaRef.current?.focus();
  }, [inputText, senderRole]);

  const handleDeleteMessage = (id: string) => dispatch({ type: "DELETE", id });

  const handleClearMessages = () => dispatch({ type: "CLEAR" });

  const handleInsertGenerated = (
    rawMessages: GeneratedMessage[],
    mode: "replace" | "append",
  ) => {
    const now = new Date();
    now.setHours(now.getHours() - 1);
    const newMessages = rawMessages.map((m, i) => ({
      id: generateId(),
      text: m.text,
      sender: m.sender,
      timestamp: new Date(now.getTime() + i * 90_000).toISOString(),
    }));
    dispatch({ type: "INSERT_GENERATED", messages: newMessages, mode });
  };

  const handleEditMessage = (id: string, text: string) =>
    dispatch({ type: "EDIT", id, text });

  const handleEditTimestamp = (id: string, timestamp: string) =>
    dispatch({ type: "EDIT_TIMESTAMP", id, timestamp });

  const handleToggleReaction = (id: string, emoji: string) =>
    dispatch({ type: "TOGGLE_REACTION", id, emoji });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Enter") return;
      const isMobile = window.matchMedia(
        "(hover: none) and (pointer: coarse)",
      ).matches;
      if (isMobile) return;
      if (!e.shiftKey) {
        e.preventDefault();
        handleAddMessage();
      }
    },
    [handleAddMessage],
  );

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    await exportAsPng("phone-frame", `mockshot-${platform}-${colorMode}`);
    setIsExporting(false);
  }, [platform, colorMode]);

  const handleAvatarFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === "string")
          setAvatarUrl(ev.target.result);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [],
  );

  const handleSetPlatform = useCallback(
    (p: Platform) => {
      setPlatform(p);
      navigate(`/${p}`, { replace: true });
    },
    [navigate],
  );

  useEffect(() => {
    const isRoot = location.pathname === "/" || location.pathname === "";
    const title = isRoot
      ? "MockShot — Fake Chat Screenshot Generator"
      : PLATFORM_META[platform].title;
    const desc = isRoot
      ? "Create realistic fake iMessage, WhatsApp, and Messenger screenshots instantly. Free, no sign-up required."
      : PLATFORM_META[platform].description;
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc);
  }, [platform, location.pathname]);

  // Revoke previous object URLs on unmount (data URLs don't need it, but good practice)
  useEffect(
    () => () => {
      if (avatarUrl?.startsWith("blob:")) URL.revokeObjectURL(avatarUrl);
    },
    [avatarUrl],
  );

  return (
    <>
      <div className="flex flex-col h-dvh w-screen overflow-hidden">
        <MobileTopBar
          colorMode={colorMode}
          theme={theme}
          accentColor={accentColor}
          accentTextColor={accentTextColor}
          isExporting={isExporting}
          onAiGenerate={() => setAiDrawerOpen(true)}
          onSettings={() => setMobileSettingsOpen(true)}
          onExport={handleExport}
        />

        {/* CENTER: Conversation preview */}
        <main
          className="flex-1 flex md:items-center md:justify-center overflow-hidden min-h-0"
          style={{ backgroundColor: theme.chatBg }}
        >
          <div className="flex h-full items-stretch w-full md:w-auto">
            <DesktopSidebar
              platform={platform}
              colorMode={colorMode}
              theme={theme}
              accentTextColor={accentTextColor}
              isExporting={isExporting}
              onSetPlatform={handleSetPlatform}
              onSetColorMode={setColorMode}
              onOpenContact={() => setContactDrawerOpen(true)}
              onAiGenerate={() => setAiDrawerOpen(true)}
              onExport={handleExport}
            />

            {/* Chat column */}
            <div className="h-full w-full md:w-96 flex flex-col overflow-hidden">
              {/* Logo + title — desktop only */}
              <div className="hidden md:flex shrink-0 items-center justify-center gap-2.5 pt-4 pb-1">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                  }}
                >
                  <img
                    src={logoSvg}
                    alt=""
                    aria-hidden="true"
                    className="w-4 h-4 object-contain"
                  />
                </div>
                <span
                  className={`text-base font-bold tracking-tight ${colorMode === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Mock Shot
                </span>
              </div>

              {/* Exportable conversation */}
              <div
                id="phone-frame"
                className="flex-1 overflow-hidden"
                style={{ backgroundColor: theme.chatBg }}
              >
                {platform === "imessage" && (
                  <IMessageChat
                    messages={messages}
                    theme={theme}
                    contactName={contactName}
                    onDeleteMessage={handleDeleteMessage}
                    onEditMessage={handleEditMessage}
                    onEditTimestamp={handleEditTimestamp}
                    onReact={handleToggleReaction}
                    onAvatarClick={() => setContactDrawerOpen(true)}
                    avatarUrl={avatarUrl ?? undefined}
                  />
                )}
                {platform === "whatsapp" && (
                  <WhatsAppChat
                    messages={messages}
                    theme={theme}
                    contactName={contactName}
                    onDeleteMessage={handleDeleteMessage}
                    onEditMessage={handleEditMessage}
                    onEditTimestamp={handleEditTimestamp}
                    onReact={handleToggleReaction}
                    onAvatarClick={() => setContactDrawerOpen(true)}
                    avatarUrl={avatarUrl ?? undefined}
                  />
                )}
                {platform === "messenger" && (
                  <MessengerChat
                    messages={messages}
                    theme={theme}
                    contactName={contactName}
                    onDeleteMessage={handleDeleteMessage}
                    onEditMessage={handleEditMessage}
                    onEditTimestamp={handleEditTimestamp}
                    onReact={handleToggleReaction}
                    onAvatarClick={() => setContactDrawerOpen(true)}
                    avatarUrl={avatarUrl ?? undefined}
                  />
                )}
              </div>

              <ComposeBar
                colorMode={colorMode}
                accentColor={accentColor}
                accentTextColor={accentTextColor}
                senderRole={senderRole}
                inputText={inputText}
                messages={messages}
                textareaRef={textareaRef}
                onSenderRoleChange={setSenderRole}
                onInputChange={setInputText}
                onKeyDown={handleKeyDown}
                onAddMessage={handleAddMessage}
                onClearMessages={handleClearMessages}
              />
            </div>
          </div>
        </main>

        <MobileSettingsDrawer
          open={mobileSettingsOpen}
          onOpenChange={setMobileSettingsOpen}
          platform={platform}
          colorMode={colorMode}
          contactName={contactName}
          onSetPlatform={handleSetPlatform}
          onSetColorMode={setColorMode}
          onOpenContact={() => setContactDrawerOpen(true)}
        />

        <ContactDrawer
          open={contactDrawerOpen}
          onOpenChange={setContactDrawerOpen}
          contactName={contactName}
          avatarUrl={avatarUrl}
          accentColor={accentColor}
          onContactNameChange={setContactName}
          onAvatarFileChange={handleAvatarFileChange}
          onRemoveAvatar={() => setAvatarUrl(null)}
        />
      </div>

      <Button
        variant="link"
        size="sm"
        className={`hidden md:inline-flex fixed top-4 right-4 z-50 ${colorMode === "dark" ? "text-white/50 hover:text-white" : "text-black/40 hover:text-black"}`}
        asChild
      >
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
  );
}
