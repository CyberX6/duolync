"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Loader2, Save, BookOpen, Target, ThumbsUp, Edit3, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateCampaignBriefAction } from "@/app/actions/campaigns";
import { cn } from "@/lib/utils";

interface BriefData {
  briefDescription: string | null;
  goal: string | null;
  dosAndDonts: string | null;
}

interface CampaignBriefFormProps {
  campaignId: string;
  initialData: BriefData;
  /** Called after a successful save so the parent can refresh its server state */
  onSaved?: (data: BriefData) => void;
}

const FIELDS: {
  key: keyof BriefData;
  label: string;
  icon: React.ElementType;
  placeholder: string;
  hint: string;
}[] = [
  {
    key: "briefDescription",
    label: "Brief Description",
    icon: BookOpen,
    placeholder:
      "Describe the campaign in detail — tone, target audience, key messages, and what you want creators to communicate…",
    hint: "A clear brief helps creators understand your vision.",
  },
  {
    key: "goal",
    label: "Campaign Goal",
    icon: Target,
    placeholder:
      "What is the primary objective? (e.g. Drive 500 sign-ups, increase brand awareness among 18–24 year olds, launch a new product…)",
    hint: "Be specific so creators can align their content with your KPIs.",
  },
  {
    key: "dosAndDonts",
    label: "Do's & Don'ts",
    icon: ThumbsUp,
    placeholder:
      "Do: mention our discount code, tag our handle, show the product in use.\nDon't: promote competitor brands, use profanity, make medical claims…",
    hint: "Clear guidelines prevent revisions and keep brand safety intact.",
  },
];

function toForm(data: BriefData): BriefData {
  return {
    briefDescription: data.briefDescription ?? "",
    goal: data.goal ?? "",
    dosAndDonts: data.dosAndDonts ?? "",
  };
}

function hasContent(data: BriefData): boolean {
  return !!(data.briefDescription || data.goal || data.dosAndDonts);
}

export function CampaignBriefForm({ campaignId, initialData, onSaved }: CampaignBriefFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  // `saved` is the source of truth for what's persisted — drives the read view
  const [saved, setSaved] = useState<BriefData>(toForm(initialData));
  // `values` is the in-flight edit state
  const [values, setValues] = useState<BriefData>(toForm(initialData));

  const [isEditing, setIsEditing] = useState(false);

  // Track whether a local save is in flight so the effect below doesn't
  // immediately overwrite the committed state with stale initialData.
  const justSavedRef = useRef(false);

  // Sync from parent only when the actual string values change (e.g. after
  // router.refresh() brings fresh server data), not on every render caused by
  // the parent creating a new object literal for initialData.
  useEffect(() => {
    if (justSavedRef.current) {
      // Skip the first sync after a local save — our `saved` state is already
      // correct. Clear the guard so future parent updates are accepted.
      justSavedRef.current = false;
      return;
    }
    const fresh = toForm(initialData);
    setSaved(fresh);
    if (!isEditing) setValues(fresh);
    // Depend on primitive values, not the object reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData.briefDescription, initialData.goal, initialData.dosAndDonts]);

  const isDirty =
    values.briefDescription !== saved.briefDescription ||
    values.goal !== saved.goal ||
    values.dosAndDonts !== saved.dosAndDonts;

  // isEmpty is derived from `saved`, not `initialData`, so it updates after a save
  const isEmpty = !hasContent(saved);

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateCampaignBriefAction(campaignId, {
        briefDescription: values.briefDescription || null,
        goal: values.goal || null,
        dosAndDonts: values.dosAndDonts || null,
      });
      if (result.error) {
        toast({ variant: "destructive", title: result.error });
        return;
      }

      const committed: BriefData = {
        briefDescription: values.briefDescription || null,
        goal: values.goal || null,
        dosAndDonts: values.dosAndDonts || null,
      };

      // Guard the effect so it won't overwrite this state when the parent
      // re-renders before it has fetched the new server data.
      justSavedRef.current = true;

      // Immediately reflect saved content in the read-only view
      setSaved(toForm(committed));
      setIsEditing(false);

      // Flash the "saved" indicator for 2 s
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);

      toast({
        title: "Brief saved successfully",
        description: "Creators will see the updated brief on this campaign.",
      });

      // Tell the parent so it can call router.refresh() and stay in sync
      onSaved?.(committed);
    });
  };

  const handleCancel = () => {
    setValues({ ...saved });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setValues({ ...saved });
    setIsEditing(true);
  };

  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-white/[0.06] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-white/[0.05]">
        <div>
          <h3 className="text-sm font-semibold">Collaboration Brief</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Shared with creators who join this campaign
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Inline save confirmation badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium transition-all duration-300",
              justSaved ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none",
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Saved
          </span>

          {!isEditing && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs"
              onClick={handleEdit}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEmpty ? "Add Brief" : "Edit"}
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {isEditing ? (
          // ── Edit mode ──────────────────────────────────────────────────────
          <div className="space-y-5">
            {FIELDS.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key} className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    {field.label}
                  </label>
                  <textarea
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    rows={4}
                    maxLength={2000}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none transition-colors"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{field.hint}</p>
                    <span className="text-xs text-muted-foreground">
                      {(values[field.key] ?? "").length}/2000
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={handleSave}
                disabled={isPending || !isDirty}
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                )}
                Save Brief
              </Button>
            </div>
          </div>
        ) : isEmpty ? (
          // ── Empty state ────────────────────────────────────────────────────
          <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No brief added yet</p>
            <p className="text-xs text-muted-foreground/70">
              Add a brief to give creators clear guidelines for this campaign.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 h-8 gap-1.5 text-xs"
              onClick={handleEdit}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Add Brief
            </Button>
          </div>
        ) : (
          // ── Read-only view ─────────────────────────────────────────────────
          <div className="space-y-5">
            {FIELDS.map((field) => {
              const Icon = field.icon;
              const val = saved[field.key];
              if (!val) return null;
              return (
                <div key={field.key}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {field.label}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">
                    {val}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
