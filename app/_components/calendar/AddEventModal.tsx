"use client";

import { useState, useTransition } from "react";
import { CalendarDays, Loader2, Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  createCampaignEventAction,
  type CalendarEventData,
} from "@/app/actions/calendar-events";
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from "@/lib/calendar/constants";

// ── Constants ─────────────────────────────────────────────────────────────────

const VIOLET = "#c084fc";

const PLATFORMS = [
  { id: "tiktok",     label: "TikTok",     color: "#f472b6" },
  { id: "instagram",  label: "Instagram",  color: "#c084fc" },
  { id: "youtube",    label: "YouTube",    color: "#f87171" },
  { id: "twitter",    label: "X / Twitter", color: "#60a5fa" },
  { id: "linkedin",   label: "LinkedIn",   color: "#0ea5e9" },
];

const EVENT_TYPES = [
  {
    id: "POST" as const,
    label: "Post",
    description: "Scheduled content post",
    icon: "🖼️",
  },
  {
    id: "STORY" as const,
    label: "Story",
    description: "Short-form or story",
    icon: "⚡",
  },
  {
    id: "MEETING" as const,
    label: "Meeting",
    description: "Brand sync or kickoff",
    icon: "🤝",
  },
];

// ── Add Event Modal ───────────────────────────────────────────────────────────

interface AddEventModalProps {
  campaignId: string;
  campaignTitle: string;
  platforms?: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (event: CalendarEventData) => void;
}

export function AddEventModal({
  campaignId,
  campaignTitle,
  platforms = [],
  open,
  onOpenChange,
  onCreated,
}: AddEventModalProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<"POST" | "STORY" | "MEETING">("POST");
  const [platform, setPlatform] = useState(platforms[0] ?? "");
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const reset = () => {
    setType("POST");
    setPlatform(platforms[0] ?? "");
    setTitle("");
    setScheduledAt("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAt) {
      toast({ variant: "destructive", title: "Please select a date and time" });
      return;
    }
    if (type !== "MEETING" && !platform) {
      toast({ variant: "destructive", title: "Please select a platform" });
      return;
    }

    startTransition(async () => {
      const result = await createCampaignEventAction({
        campaignId,
        type,
        platform: type === "MEETING" ? undefined : platform,
        title: title.trim() || undefined,
        scheduledAt: new Date(scheduledAt).toISOString(),
        status: type === "MEETING" ? "SCHEDULED" : "QUEUED",
      });

      if (result.error || !result.data) {
        toast({ variant: "destructive", title: result.error ?? "Failed to create event" });
        return;
      }

      toast({ title: "Event scheduled ✓" });
      onCreated(result.data);
      reset();
      onOpenChange(false);
    });
  };

  const availablePlatforms =
    platforms.length > 0
      ? PLATFORMS.filter((p) => platforms.includes(p.id))
      : PLATFORMS;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden border-white/[0.08] rounded-3xl"
        style={{ background: "#09090f" }}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{
            background: `linear-gradient(160deg, rgba(192,132,252,0.1) 0%, transparent 60%)`,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold mb-3"
            style={{ background: "rgba(192,132,252,0.12)", color: VIOLET, border: "1px solid rgba(192,132,252,0.3)" }}
          >
            <CalendarDays className="w-3 h-3" />
            Schedule Event
          </div>
          <h2 className="text-base font-bold text-white">{campaignTitle}</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Add a post, story, or meeting to the campaign calendar</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Event type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Event Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {EVENT_TYPES.map((t) => {
                const color = EVENT_TYPE_COLORS[t.id];
                const selected = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all border text-center",
                      selected
                        ? "border-violet-500/50"
                        : "border-white/[0.06] hover:border-white/[0.12]",
                    )}
                    style={{
                      background: selected ? `${color}12` : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <span className="text-xl leading-none">{t.icon}</span>
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: selected ? color : "rgba(161,161,170,1)" }}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform */}
          {type !== "MEETING" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Platform
              </label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger
                  className="h-10 rounded-xl text-sm border-white/[0.08] focus:border-violet-500/60"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <SelectValue placeholder="Select platform…" />
                </SelectTrigger>
                <SelectContent style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {availablePlatforms.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        {p.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Title <span className="normal-case font-normal text-zinc-600">(optional)</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. ${EVENT_TYPE_LABELS[type]} for ${campaignTitle}`}
              className="h-10 rounded-xl text-sm border-white/[0.08] focus:border-violet-500/60 placeholder:text-zinc-700"
              style={{ background: "rgba(255,255,255,0.03)" }}
              maxLength={120}
            />
          </div>

          {/* Date & time */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Date & Time
            </label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="h-10 rounded-xl text-sm border-white/[0.08] focus:border-violet-500/60"
              style={{ background: "rgba(255,255,255,0.03)" }}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 rounded-xl font-semibold text-white mt-1"
            style={{ background: VIOLET }}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Schedule Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Add Event Button ──────────────────────────────────────────────────────────

interface AddEventButtonProps {
  campaignId: string;
  campaignTitle: string;
  platforms?: string[];
  onCreated: (event: CalendarEventData) => void;
  className?: string;
  variant?: "default" | "outline";
}

export function AddEventButton({
  campaignId,
  campaignTitle,
  platforms,
  onCreated,
  className,
  variant = "default",
}: AddEventButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]",
          variant === "default"
            ? "text-white"
            : "border border-white/[0.12] text-zinc-300 hover:text-white hover:border-violet-500/40",
          className,
        )}
        style={
          variant === "default"
            ? { background: VIOLET, boxShadow: `0 4px 14px rgba(192,132,252,0.25)` }
            : { background: "rgba(192,132,252,0.08)" }
        }
      >
        <Plus className="w-4 h-4" />
        Add Event
      </button>
      <AddEventModal
        campaignId={campaignId}
        campaignTitle={campaignTitle}
        platforms={platforms}
        open={open}
        onOpenChange={setOpen}
        onCreated={onCreated}
      />
    </>
  );
}
