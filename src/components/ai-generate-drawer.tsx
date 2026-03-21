import { useState, useActionState, useCallback } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { GeneratedMessage } from "@/types/ai";
import type { Platform } from "@/types/theme";
import { generateConversation } from "@/utils/ai";
import { trackAiGenerate } from "@/utils/analytics";
import {
  getCustomConfig,
  saveCustomConfig,
  clearCustomConfig,
  getUsageCount,
} from "@/utils/ai-storage";

const DAILY_LIMIT = 5;

const TEMPLATES: Record<string, Array<{ label: string; prompt: string }>> = {
  Work: [
    {
      label: "Getting Fired",
      prompt:
        "A boss fires an employee over text in the most unprofessional way possible",
    },
    {
      label: "Unreasonable Boss",
      prompt:
        "Boss texts demanding I work overtime on my day off, I finally push back",
    },
  ],
  Scary: [
    {
      label: "3AM Text",
      prompt:
        "Receiving a cryptic terrifying text at 3am from an unknown number that seems to know where I am",
    },
    {
      label: "Wrong Number",
      prompt:
        "A wrong number text that slowly escalates into something deeply unsettling",
    },
    {
      label: "Still Outside",
      prompt:
        "Friend frantically texts that someone has been standing outside their house for hours and won't leave",
    },
    {
      label: "Someone Knows",
      prompt:
        "Anonymous texts claiming someone knows a dark secret I've kept hidden for years",
    },
    {
      label: "Don't Come Home",
      prompt:
        "Urgent texts warning me not to come home tonight — something is very wrong inside",
    },
  ],
  Positive: [
    {
      label: "Big Announcement",
      prompt:
        "Sharing an exciting life announcement over text — friends and family react with joy and surprise",
    },
  ],
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: Platform;
  contactName: string;
  accentColor: string;
  onInsert: (messages: GeneratedMessage[], mode: "replace" | "append") => void;
}

export function AiGenerateDrawer({
  open,
  onOpenChange,
  platform,
  contactName,
  accentColor,
  onInsert,
}: Props) {
  const [scenario, setScenario] = useState("");
  const [insertMode, setInsertMode] = useState<"replace" | "append">("replace");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [customModel, setCustomModel] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  const [error, formAction, isGenerating] = useActionState(
    async (_: string | null, formData: FormData) => {
      try {
        const messages = await generateConversation({
          scenario: formData.get("scenario") as string,
          platform,
          contactName,
        });
        onInsert(messages, insertMode);
        trackAiGenerate(platform, formData.get("scenario") as string, insertMode);
        setUsageCount(getUsageCount());
        onOpenChange(false);
        return null;
      } catch (err) {
        return err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      }
    },
    null,
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      const config = getCustomConfig();
      setCustomModel(config?.model ?? "");
      setCustomApiKey(config?.apiKey ?? "");
      setHasCustomKey(!!config);
      setUsageCount(getUsageCount());
      setScenario("");
    }
    onOpenChange(nextOpen);
  };

  const handleSaveCustom = useCallback(() => {
    if (!customApiKey.trim() || !customModel.trim()) return;
    saveCustomConfig(customApiKey.trim(), customModel.trim());
    setHasCustomKey(true);
  }, [customApiKey, customModel]);

  const handleClearCustom = useCallback(() => {
    clearCustomConfig();
    setCustomApiKey("");
    setCustomModel("");
    setHasCustomKey(false);
  }, []);

  const remaining = Math.max(0, DAILY_LIMIT - usageCount);
  const isLimitReached = !hasCustomKey && remaining === 0;

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2 justify-center">
            <i className="ri-sparkling-2-line" aria-hidden="true" />
            Generate Conversation
          </DrawerTitle>
        </DrawerHeader>

        <div className="overflow-y-auto max-h-[75vh]">
          <form
            action={formAction}
            className="max-w-md mx-auto px-4 pb-8 flex flex-col gap-5"
          >
            {/* Template groups */}
            {Object.entries(TEMPLATES).map(([category, templates]) => (
              <div key={category}>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-2">
                  {category}
                </p>
                <ToggleGroup
                  type="single"
                  value={scenario}
                  onValueChange={(val) => setScenario(val)}
                  spacing={2}
                  className="flex-wrap w-full justify-start"
                >
                  {templates.map((t) => {
                    const isSelected = scenario === t.prompt;
                    return (
                      <ToggleGroupItem
                        key={t.label}
                        value={t.prompt}
                        variant="outline"
                      >
                        {t.label}
                      </ToggleGroupItem>
                    );
                  })}
                </ToggleGroup>
              </div>
            ))}

            {/* Scenario textarea */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-2">
                Scenario
              </p>
              <Textarea
                name="scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Describe your conversation scenario…"
                rows={3}
              />
            </div>

            {/* Insert mode */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-2">
                Insert Mode
              </p>
              <ToggleGroup
                type="single"
                value={insertMode}
                onValueChange={(val) => {
                  if (val) setInsertMode(val as "replace" | "append");
                }}
                spacing={2}
                className="w-full"
              >
                {(["replace", "append"] as const).map((mode) => (
                  <ToggleGroupItem
                    key={mode}
                    value={mode}
                    variant="outline"
                    className="flex-1"
                  >
                    {mode === "replace" ? "Replace chat" : "Add to chat"}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Error */}
            {error !== null && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            {/* Generate button */}
            <Button
              type="submit"
              disabled={!scenario.trim() || isGenerating || isLimitReached}
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                fontFamily: "inherit",
              }}
            >
              {isGenerating ? (
                <>
                  <i
                    className="ri-loader-4-line animate-spin"
                    aria-hidden="true"
                  />
                  Generating…
                </>
              ) : (
                <>
                  <i className="ri-sparkling-2-line" aria-hidden="true" />
                  Generate
                </>
              )}
            </Button>

            {/* Usage info */}
            {hasCustomKey ? (
              <p className="text-xs text-center text-black/40">
                Using your API key · no daily limit
              </p>
            ) : (
              <p
                className={`text-xs text-center ${remaining === 0 ? "text-red-400" : "text-black/40"}`}
              >
                {remaining === 0
                  ? "Daily limit reached. Try again tomorrow or use your own API key."
                  : `${remaining} of ${DAILY_LIMIT} free generations left today`}
              </p>
            )}

            {/* Advanced section */}
            <Collapsible
              open={advancedOpen}
              onOpenChange={setAdvancedOpen}
              className="border border-black/10 rounded-xl overflow-hidden"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-black/60 hover:bg-black/5 transition-colors">
                <span className="flex items-center gap-2">
                  <i
                    className="ri-settings-3-line text-base"
                    aria-hidden="true"
                  />
                  Advanced · Use your own API key
                </span>
                <i
                  className={`ri-arrow-down-s-line text-base transition-transform ${advancedOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-4 pb-4 flex flex-col gap-3 border-t border-black/10">
                  <div className="pt-3 flex flex-col gap-3">
                    <div>
                      <label className="text-xs text-black/50 mb-1 block">
                        Model
                      </label>
                      <Input
                        type="text"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder="anthropic/claude-haiku-4-5-20251001"
                        className="rounded-xl px-4 py-2.5 text-sm border-black/15 bg-black/5 text-slate-950 placeholder:text-black/35"
                        style={{ fontFamily: "inherit" }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-black/50 mb-1 block">
                        API Key
                      </label>
                      <Input
                        type="password"
                        value={customApiKey}
                        onChange={(e) => setCustomApiKey(e.target.value)}
                        placeholder="sk-ant-… or sk-…"
                        className="rounded-xl px-4 py-2.5 text-sm border-black/15 bg-black/5 text-slate-950 placeholder:text-black/35"
                        style={{ fontFamily: "inherit" }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        onClick={handleSaveCustom}
                        disabled={!customApiKey.trim() || !customModel.trim()}
                        className="flex-1"
                      >
                        Save key
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleClearCustom}
                        disabled={!hasCustomKey}
                        className="border-red-200 text-red-400 hover:bg-red-50"
                      >
                        Clear
                      </Button>
                    </div>
                    <p className="text-xs text-black/40">
                      Your key is stored in your browser only and never sent to
                      our servers.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
