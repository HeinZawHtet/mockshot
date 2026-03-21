import { Link } from "react-router-dom";
import { IMessageChat } from "./modules/chat/imessage/imessage-chat";
import { WhatsAppChat } from "./modules/chat/whatsapp/whatsapp-chat";
import { MessengerChat } from "./modules/chat/messenger/messenger-chat";
import { Button } from "@/components/ui/button";
import { AiGenerateDrawer } from "@/components/ai-generate-drawer";
import { MobileTopBar } from "@/components/mobile-top-bar";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { ComposeBar } from "@/components/compose-bar";
import { MobileSettingsDrawer } from "@/components/mobile-settings-drawer";
import { ContactDrawer } from "@/components/contact-drawer";
import { ThemeContext } from "@/contexts/theme-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAppState } from "@/hooks/use-app-state";
import logoSvg from "./assets/logo.svg";

export default function App() {
  const s = useAppState();

  return (
    <ThemeContext value={s.themeContextValue}>
      <div className={s.colorMode}>
        <title>{s.pageTitle}</title>
        <meta name="description" content={s.pageDescription} />
        <div className="flex flex-col h-dvh w-screen overflow-hidden">
          <MobileTopBar
            isExporting={s.isExporting}
            onAiGenerate={() => s.setAiDrawerOpen(true)}
            onSettings={() => s.setMobileSettingsOpen(true)}
            onExport={s.handleExport}
          />

          {/* CENTER: Conversation preview */}
          <main
            className="flex-1 flex md:items-center md:justify-center overflow-hidden min-h-0"
            style={{ backgroundColor: s.theme.chatBg }}
          >
            <div className="flex h-full items-stretch w-full md:w-auto">
              <DesktopSidebar
                platform={s.platform}
                isExporting={s.isExporting}
                onSetPlatform={s.handleSetPlatform}
                onSetColorMode={s.setColorMode}
                onOpenContact={() => s.setContactDrawerOpen(true)}
                onAiGenerate={() => s.setAiDrawerOpen(true)}
                onExport={s.handleExport}
              />

              {/* Chat column */}
              <div className="h-full w-full md:w-96 flex flex-col overflow-hidden">
                {/* Logo + title — desktop only */}
                <div className="hidden md:flex shrink-0 items-center justify-center gap-2.5 pt-4 pb-1">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${s.accentColor}, ${s.accentColor}99)`,
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
                    className={`text-base font-bold tracking-tight ${s.colorMode === "dark" ? "text-white" : "text-slate-900"}`}
                  >
                    Mock Shot
                  </span>
                </div>

                {/* Exportable conversation */}
                <ErrorBoundary>
                  <div
                    id="phone-frame"
                    className="flex-1 overflow-hidden"
                    style={{ backgroundColor: s.theme.chatBg }}
                  >
                    {s.platform === "imessage" && (
                      <IMessageChat
                        messages={s.messages}
                        theme={s.theme}
                        contactName={s.contactName}
                        onDeleteMessage={s.handleDeleteMessage}
                        onEditMessage={s.handleEditMessage}
                        onEditTimestamp={s.handleEditTimestamp}
                        onReact={s.handleToggleReaction}
                        onAvatarClick={() => s.setContactDrawerOpen(true)}
                        avatarUrl={s.avatarUrl ?? undefined}
                      />
                    )}
                    {s.platform === "whatsapp" && (
                      <WhatsAppChat
                        messages={s.messages}
                        theme={s.theme}
                        contactName={s.contactName}
                        onDeleteMessage={s.handleDeleteMessage}
                        onEditMessage={s.handleEditMessage}
                        onEditTimestamp={s.handleEditTimestamp}
                        onReact={s.handleToggleReaction}
                        onAvatarClick={() => s.setContactDrawerOpen(true)}
                        avatarUrl={s.avatarUrl ?? undefined}
                      />
                    )}
                    {s.platform === "messenger" && (
                      <MessengerChat
                        messages={s.messages}
                        theme={s.theme}
                        contactName={s.contactName}
                        onDeleteMessage={s.handleDeleteMessage}
                        onEditMessage={s.handleEditMessage}
                        onEditTimestamp={s.handleEditTimestamp}
                        onReact={s.handleToggleReaction}
                        onAvatarClick={() => s.setContactDrawerOpen(true)}
                        avatarUrl={s.avatarUrl ?? undefined}
                      />
                    )}
                  </div>
                </ErrorBoundary>

                <ComposeBar
                  senderRole={s.senderRole}
                  inputText={s.inputText}
                  hasMessages={s.messages.length > 0}
                  textareaRef={s.textareaRef}
                  onSenderRoleChange={s.setSenderRole}
                  onInputChange={s.setInputText}
                  onKeyDown={s.handleKeyDown}
                  onAddMessage={s.handleAddMessage}
                  onClearMessages={s.handleClearMessages}
                />
              </div>
            </div>
          </main>

          <MobileSettingsDrawer
            open={s.mobileSettingsOpen}
            onOpenChange={s.setMobileSettingsOpen}
            platform={s.platform}
            colorMode={s.colorMode}
            contactName={s.contactName}
            onSetPlatform={s.handleSetPlatform}
            onSetColorMode={s.setColorMode}
            onOpenContact={() => s.setContactDrawerOpen(true)}
          />

          <ContactDrawer
            open={s.contactDrawerOpen}
            onOpenChange={s.setContactDrawerOpen}
            contactName={s.contactName}
            avatarUrl={s.avatarUrl}
            onContactNameChange={s.setContactName}
            onAvatarFileChange={s.handleAvatarFileChange}
            onRemoveAvatar={() => s.setAvatarUrl(null)}
          />
        </div>

        <Button
          variant="link"
          size="sm"
          className={`hidden md:inline-flex fixed top-4 right-4 z-50 ${s.colorMode === "dark" ? "text-white/50 hover:text-white" : "text-black/40 hover:text-black"}`}
          asChild
        >
          <Link to="/about">About</Link>
        </Button>

        <AiGenerateDrawer
          open={s.aiDrawerOpen}
          onOpenChange={s.setAiDrawerOpen}
          platform={s.platform}
          contactName={s.contactName}
          accentColor={s.accentColor}
          onInsert={s.handleInsertGenerated}
        />
      </div>
    </ThemeContext>
  );
}
