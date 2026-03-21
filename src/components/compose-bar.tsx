import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "@/contexts/theme-context";

interface ComposeBarProps {
  senderRole: "me" | "them";
  inputText: string;
  hasMessages: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onSenderRoleChange: (role: "me" | "them") => void;
  onInputChange: (text: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onAddMessage: () => void;
  onClearMessages: () => void;
}

export function ComposeBar({
  senderRole,
  inputText,
  hasMessages,
  textareaRef,
  onSenderRoleChange,
  onInputChange,
  onKeyDown,
  onAddMessage,
  onClearMessages,
}: ComposeBarProps) {
  const { accentColor } = useTheme();
  return (
    <div
      className="shrink-0 px-3 pt-2.5"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      {/* Sender role toggle */}
      <div className="flex gap-1.5 mb-2 items-center justify-between">
        <ToggleGroup
          type="single"
          value={senderRole}
          onValueChange={(val) => {
            if (val) onSenderRoleChange(val as "me" | "them");
          }}
          spacing={2}
          className="text-black/60 dark:text-white/85"
        >
          {(["them", "me"] as const).map((role) => (
            <ToggleGroupItem
              key={role}
              value={role}
              variant="outline"
              size="xs"
            >
              {role === "them" ? "Received" : "Sent"}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button
          variant="outline"
          size="xs"
          onClick={onClearMessages}
          disabled={!hasMessages}
          aria-label="Clear all messages"
          className="border-destructive text-destructive dark:border-destructive dark:text-destructive"
        >
          <i className="ri-delete-bin-line" aria-hidden="true" />
          Clear
        </Button>
      </div>

      {/* Input + send */}
      <div className="flex gap-2 items-stretch">
        <Textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message…"
          rows={2}
          className="flex-1 min-h-0 resize-none"
          style={{ fontFamily: "inherit" }}
        />
        <Button
          variant="default"
          size="icon"
          onClick={onAddMessage}
          disabled={!inputText.trim()}
          aria-label="Add message"
          className="flex size-11"
        >
          <i className="ri-arrow-up-line text-base" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
