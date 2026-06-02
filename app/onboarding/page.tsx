"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  User,
  Loader2,
  X,
  CheckCircle2,
  ChevronDown,
  Check,
  Camera,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/_components/ui/command";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { UploadButton } from "@/lib/uploadthing";
import { completeOnboarding, selectRole } from "@/app/actions/onboarding";
import type {
  BrandOnboardingInput,
  CreatorOnboardingInput,
} from "@/app/actions/onboarding";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "fashion", label: "Fashion" },
  { value: "beauty", label: "Beauty" },
  { value: "food-beverage", label: "Food & Beverage" },
  { value: "health-fitness", label: "Health & Fitness" },
  { value: "travel", label: "Travel" },
  { value: "gaming", label: "Gaming" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

const NICHES = [
  { value: "lifestyle", label: "Lifestyle" },
  { value: "tech-reviews", label: "Tech Reviews" },
  { value: "gaming", label: "Gaming" },
  { value: "beauty-makeup", label: "Beauty & Makeup" },
  { value: "fashion", label: "Fashion" },
  { value: "fitness", label: "Fitness" },
  { value: "food-cooking", label: "Food & Cooking" },
  { value: "travel", label: "Travel" },
  { value: "comedy", label: "Comedy" },
  { value: "education", label: "Education" },
  { value: "music", label: "Music" },
  { value: "other", label: "Other" },
];

const PLATFORMS = [
  { value: "instagram", label: "Instagram", color: "#E1306C" },
  { value: "youtube", label: "YouTube", color: "#FF0000" },
  { value: "tiktok", label: "TikTok", color: "#69C9D0" },
  { value: "twitter", label: "Twitter / X", color: "#1DA1F2" },
  { value: "twitch", label: "Twitch", color: "#9146FF" },
  { value: "linkedin", label: "LinkedIn", color: "#0A66C2" },
];

// ─── Shared animation variants ────────────────────────────────────────────────

const slideVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const transition = { duration: 0.32, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

// ─── Sub-components ───────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Circular Avatar Uploader ─────────────────────────────────────────────────

interface AvatarUploaderProps {
  imageUrl: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

function AvatarUploader({ imageUrl, onUpload, onRemove }: AvatarUploaderProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div
          className={cn(
            "w-24 h-24 rounded-full overflow-hidden flex items-center justify-center transition-all duration-200",
            imageUrl
              ? "border-2 border-violet-500/50"
              : "border-2 border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-800/60",
          )}
        >
          {imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={onRemove}
                  className="w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </>
          ) : (
            <Camera className="w-7 h-7 text-zinc-500" />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <UploadButton
          endpoint="profileImageUploader"
          onClientUploadComplete={(res) => {
            const url = res[0]?.ufsUrl ?? res[0]?.url;
            if (url) onUpload(url);
          }}
          appearance={{
            button:
              "ut-uploading:cursor-not-allowed bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors h-auto",
            allowedContent: "hidden",
          }}
          content={{ button: imageUrl ? "Change photo" : "Upload photo" }}
        />
        <p className="text-zinc-600 text-[11px]">Optional · JPEG, PNG up to 4 MB</p>
      </div>
    </div>
  );
}

// ─── Popover Command Select ───────────────────────────────────────────────────

interface PopoverSelectOption {
  value: string;
  label: string;
  color?: string;
}

interface PopoverSelectProps {
  value: string;
  onValueChange: (val: string) => void;
  options: PopoverSelectOption[];
  placeholder: string;
  searchPlaceholder?: string;
}

function PopoverSelect({
  value,
  onValueChange,
  options,
  placeholder,
  searchPlaceholder = "Search...",
}: PopoverSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm transition-colors",
            "bg-zinc-800/60 border-zinc-700 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30",
            selected ? "text-zinc-100" : "text-zinc-500",
          )}
        >
          <span className="flex items-center gap-2">
            {selected?.color && (
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: selected.color }}
              />
            )}
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[260px] p-0 bg-zinc-900 border-zinc-800 shadow-xl"
        align="start"
      >
        <Command className="bg-transparent">
          <CommandInput
            placeholder={searchPlaceholder}
            className="border-b border-zinc-800 text-zinc-200 placeholder:text-zinc-600 h-9"
          />
          <CommandList>
            <CommandEmpty className="text-zinc-500 py-4 text-center text-sm">
              No results found.
            </CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={() => {
                    onValueChange(opt.value);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2.5 text-zinc-300 data-[selected=true]:bg-zinc-800 data-[selected=true]:text-white cursor-pointer"
                >
                  {opt.color && (
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: opt.color }}
                    />
                  )}
                  <span className="flex-1">{opt.label}</span>
                  {value === opt.value && (
                    <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─── Step 1: Role Selection ───────────────────────────────────────────────────

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function RoleCard({ icon, title, description, selected, onClick }: RoleCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
        selected
          ? "border-violet-500/60 bg-violet-500/10 shadow-[0_0_24px_rgba(139,92,246,0.15)]"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/40"
      }`}
    >
      {selected && (
        <motion.span
          layoutId="selected-indicator"
          className="absolute top-4 right-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <CheckCircle2 className="w-5 h-5 text-violet-400" />
        </motion.span>
      )}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
          selected ? "bg-violet-500/20 text-violet-400" : "bg-zinc-800 text-zinc-400"
        }`}
      >
        {icon}
      </div>
      <p className={`font-semibold text-base mb-1 ${selected ? "text-white" : "text-zinc-200"}`}>
        {title}
      </p>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </motion.button>
  );
}

// ─── Step 2 Forms ─────────────────────────────────────────────────────────────

interface BrandFormState {
  companyName: string;
  industry: string;
  website: string;
  noWebsite: boolean;
  brandAccountType: "company" | "personal" | "";
  imageUrl: string | null;
}

interface CreatorFormState {
  fullName: string;
  niche: string;
  primaryPlatform: string;
  imageUrl: string | null;
}

interface BrandFormProps {
  state: BrandFormState;
  onChange: (patch: Partial<BrandFormState>) => void;
}

function BrandForm({ state, onChange }: BrandFormProps) {
  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex justify-center pb-2">
        <AvatarUploader
          imageUrl={state.imageUrl}
          onUpload={(url) => onChange({ imageUrl: url })}
          onRemove={() => onChange({ imageUrl: null })}
        />
      </div>

      {/* Account type */}
      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">Account Type</Label>
        <RadioGroup
          value={state.brandAccountType}
          onValueChange={(v) =>
            onChange({ brandAccountType: v as "company" | "personal" })
          }
          className="flex gap-4"
        >
          {[
            { value: "company", label: "Company" },
            { value: "personal", label: "Individual" },
          ].map(({ value, label }) => (
            <label
              key={value}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm",
                state.brandAccountType === value
                  ? "border-violet-500/60 bg-violet-500/10 text-violet-300"
                  : "border-zinc-700 bg-zinc-800/40 text-zinc-400 hover:border-zinc-600",
              )}
            >
              <RadioGroupItem value={value} className="border-zinc-600 text-violet-400" />
              {label}
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">Company Name *</Label>
        <Input
          value={state.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          placeholder="Acme Corp"
          className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/60 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">Industry</Label>
        <PopoverSelect
          value={state.industry}
          onValueChange={(v) => onChange({ industry: v })}
          options={INDUSTRIES}
          placeholder="Select an industry"
          searchPlaceholder="Search industries..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">Website</Label>
        <Input
          value={state.website}
          onChange={(e) => onChange({ website: e.target.value })}
          placeholder="https://acme.com"
          type="url"
          disabled={state.noWebsite}
          className={cn(
            "bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/60 rounded-xl transition-opacity",
            state.noWebsite && "opacity-40 cursor-not-allowed",
          )}
        />
        <label className="flex items-center gap-2 cursor-pointer mt-1.5">
          <Checkbox
            checked={state.noWebsite}
            onCheckedChange={(checked) =>
              onChange({ noWebsite: !!checked, website: checked ? "" : state.website })
            }
            className="border-zinc-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
          />
          <span className="text-zinc-500 text-xs select-none">I don&apos;t have a website</span>
        </label>
      </div>
    </div>
  );
}

interface CreatorFormProps {
  state: CreatorFormState;
  onChange: (patch: Partial<CreatorFormState>) => void;
}

function CreatorForm({ state, onChange }: CreatorFormProps) {
  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex justify-center pb-2">
        <AvatarUploader
          imageUrl={state.imageUrl}
          onUpload={(url) => onChange({ imageUrl: url })}
          onRemove={() => onChange({ imageUrl: null })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">Full Name / Handle *</Label>
        <Input
          value={state.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="@yourhandle"
          className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/60 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">Primary Niche</Label>
        <PopoverSelect
          value={state.niche}
          onValueChange={(v) => onChange({ niche: v })}
          options={NICHES}
          placeholder="Select your niche"
          searchPlaceholder="Search niches..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">Main Social Platform</Label>
        <PopoverSelect
          value={state.primaryPlatform}
          onValueChange={(v) => onChange({ primaryPlatform: v })}
          options={PLATFORMS}
          placeholder="Where are you most active?"
          searchPlaceholder="Search platforms..."
        />
      </div>
    </div>
  );
}

// ─── Main Onboarding Page ─────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<"BRAND" | "CREATOR" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSettingRole, setIsSettingRole] = useState(false);

  const [brandForm, setBrandForm] = useState<BrandFormState>({
    companyName: "",
    industry: "",
    website: "",
    noWebsite: false,
    brandAccountType: "",
    imageUrl: null,
  });

  const [creatorForm, setCreatorForm] = useState<CreatorFormState>({
    fullName: "",
    niche: "",
    primaryPlatform: "",
    imageUrl: null,
  });

  async function handleRoleConfirm() {
    if (!selectedRole) return;
    setError(null);
    setIsSettingRole(true);
    try {
      const result = await selectRole(selectedRole);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setStep(2);
    } finally {
      setIsSettingRole(false);
    }
  }

  function handleSubmit() {
    if (!selectedRole) return;
    setError(null);

    const input: BrandOnboardingInput | CreatorOnboardingInput =
      selectedRole === "BRAND"
        ? {
            companyName: brandForm.companyName,
            industry: brandForm.industry || undefined,
            website: brandForm.noWebsite ? "" : brandForm.website || undefined,
            brandAccountType: (brandForm.brandAccountType as "company" | "personal") || undefined,
            imageUrl: brandForm.imageUrl ?? undefined,
          }
        : {
            niche: creatorForm.niche || undefined,
            primaryPlatform: creatorForm.primaryPlatform || undefined,
            imageUrl: creatorForm.imageUrl ?? undefined,
          };

    startTransition(async () => {
      const result = await completeOnboarding(input);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.replace(
        selectedRole === "BRAND" ? "/brand/dashboard" : "/creator/dashboard",
      );
    });
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {([1, 2] as const).map((s) => (
            <motion.div
              key={s}
              animate={{
                width: s === step ? 24 : 8,
                backgroundColor: s <= step ? "rgb(139 92 246)" : "rgb(63 63 70)",
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        <GlassCard className="p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                <div className="mb-8 text-center">
                  <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    Welcome to Nexly
                  </h1>
                  <p className="text-zinc-400 text-sm">
                    Tell us who you are so we can personalise your experience.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
                  <RoleCard
                    icon={<Building2 className="w-5 h-5" />}
                    title="Brand"
                    description="Connect with creators and run influencer campaigns."
                    selected={selectedRole === "BRAND"}
                    onClick={() => setSelectedRole("BRAND")}
                  />
                  <RoleCard
                    icon={<User className="w-5 h-5" />}
                    title="Creator"
                    description="Grow your audience and partner with leading brands."
                    selected={selectedRole === "CREATOR"}
                    onClick={() => setSelectedRole("CREATOR")}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
                )}

                <Button
                  onClick={handleRoleConfirm}
                  disabled={!selectedRole || isSettingRole}
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl h-11 font-medium transition-colors disabled:opacity-40"
                >
                  {isSettingRole ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Continue
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step-2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                <div className="mb-7">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(null); }}
                    className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-5 flex items-center gap-1"
                  >
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
                    {selectedRole === "BRAND" ? "Set up your brand" : "Set up your profile"}
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    {selectedRole === "BRAND"
                      ? "Help creators find the right partnership with you."
                      : "Help brands discover your unique voice and audience."}
                  </p>
                </div>

                {selectedRole === "BRAND" ? (
                  <BrandForm
                    state={brandForm}
                    onChange={(patch) => setBrandForm((s) => ({ ...s, ...patch }))}
                  />
                ) : (
                  <CreatorForm
                    state={creatorForm}
                    onChange={(patch) => setCreatorForm((s) => ({ ...s, ...patch }))}
                  />
                )}

                {error && (
                  <p className="text-red-400 text-sm mt-4">{error}</p>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={
                    isPending ||
                    (selectedRole === "BRAND" && !brandForm.companyName.trim())
                  }
                  className="w-full mt-7 bg-violet-600 hover:bg-violet-500 text-white rounded-xl h-11 font-medium transition-colors disabled:opacity-40"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Setting up your account…
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        <p className="text-center text-zinc-600 text-xs mt-6">
          You can update these details anytime in your settings.
        </p>
      </div>
    </div>
  );
}
