import { useState, useRef, useCallback, useReducer, useTransition, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Platform, ColorMode } from "../types/theme";
import { iMessageDark, iMessageLight } from "../themes/imessage";
import { whatsAppDark, whatsAppLight } from "../themes/whatsapp";
import { messengerLight, messengerDark } from "../themes/messenger";
import { generateId } from "../utils/helpers";
import { messagesReducer } from "../utils/messages-reducer";
import { getSeedMessages } from "../data/seed-messages";
import { exportAsPng } from "../utils/export";
import { PLATFORM_COLORS } from "../platforms";
import type { GeneratedMessage } from "../types/ai";

const PLATFORM_META: Record<
  Platform,
  { title: string; description: string }
> = {
  imessage: {
    title: "iMessage Screenshot Generator — MockShot",
    description:
      "Create realistic fake iMessage screenshots instantly. Customize conversations with dark/light mode and export as PNG. Free to use.",
  },
  whatsapp: {
    title: "WhatsApp Screenshot Generator — MockShot",
    description:
      "Generate fake WhatsApp chat screenshots for free. Set sender, receiver, and timestamps. Export as high-quality PNG instantly.",
  },
  messenger: {
    title: "Facebook Messenger Screenshot Generator — MockShot",
    description:
      "Create fake Facebook Messenger chat screenshots online. Customize names, avatars, and reactions. Free PNG export.",
  },
};

export function pathToPlatform(pathname: string): Platform {
  if (pathname.startsWith("/whatsapp")) return "whatsapp";
  if (pathname.startsWith("/messenger")) return "messenger";
  return "imessage";
}

export function getTheme(platform: Platform, colorMode: ColorMode) {
  if (platform === "imessage")
    return colorMode === "dark" ? iMessageDark : iMessageLight;
  if (platform === "whatsapp")
    return colorMode === "dark" ? whatsAppDark : whatsAppLight;
  return colorMode === "dark" ? messengerDark : messengerLight;
}

export function useAppState() {
  const location = useLocation();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform>(() =>
    pathToPlatform(location.pathname),
  );
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [contactName, setContactName] = useState("Alice");
  const [inputText, setInputText] = useState("");
  const [senderRole, setSenderRole] = useState<"me" | "them">("them");
  const [isExporting, startExport] = useTransition();
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [messages, dispatch] = useReducer(messagesReducer, getSeedMessages());

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const theme = getTheme(platform, colorMode);
  const accentColor = PLATFORM_COLORS[platform];
  const accentTextColor =
    platform === "whatsapp" && colorMode === "light" ? "#065f46" : accentColor;
  const themeContextValue = useMemo(
    () => ({ theme, colorMode, accentColor, accentTextColor }),
    [theme, colorMode, accentColor, accentTextColor],
  );

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

  const handleExport = useCallback(() => {
    startExport(async () => {
      await exportAsPng("phone-frame", `mockshot-${platform}-${colorMode}`);
    });
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

  const isRoot = location.pathname === "/" || location.pathname === "";
  const pageTitle = isRoot
    ? "MockShot — Fake Chat Screenshot Generator"
    : PLATFORM_META[platform].title;
  const pageDescription = isRoot
    ? "Create realistic fake iMessage, WhatsApp, and Messenger screenshots instantly. Free, no sign-up required."
    : PLATFORM_META[platform].description;

  return {
    platform,
    colorMode,
    contactName,
    inputText,
    senderRole,
    isExporting,
    contactDrawerOpen,
    mobileSettingsOpen,
    aiDrawerOpen,
    avatarUrl,
    messages,
    textareaRef,
    theme,
    accentColor,
    themeContextValue,
    pageTitle,
    pageDescription,
    handleAddMessage,
    handleDeleteMessage,
    handleClearMessages,
    handleInsertGenerated,
    handleEditMessage,
    handleEditTimestamp,
    handleToggleReaction,
    handleKeyDown,
    handleExport,
    handleAvatarFileChange,
    handleSetPlatform,
    setColorMode,
    setContactName,
    setInputText,
    setSenderRole,
    setContactDrawerOpen,
    setMobileSettingsOpen,
    setAiDrawerOpen,
    setAvatarUrl,
  };
}
