"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Shield,
  Trash2,
  X,
  Save,
  Loader2,
  AlertTriangle,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Label } from "@/app/_components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/uploadthing";
import { updateAvatarAction, updateProfileAction } from "@/app/actions/profile";
import { deleteAccount } from "@/app/actions/account";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavTab = "profile" | "security" | "danger";

// ─── Shared glass section ─────────────────────────────────────────────────────

function GlassSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Avatar / Logo Section ────────────────────────────────────────────────────

function LogoSection({
  avatarUrl,
  name,
  onAvatarChange,
}: {
  avatarUrl: string | null;
  name: string | null;
  onAvatarChange: (url: string | null) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const initials = (name ?? "B")
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleRemove() {
    setIsUpdating(true);
    const { error } = await updateAvatarAction(null);
    if (error) {
      toast.error(error);
    } else {
      onAvatarChange(null);
      toast.success("Logo removed");
    }
    setIsUpdating(false);
  }

  return (
    <GlassSection>
      <h3 className="text-zinc-200 font-semibold text-sm mb-4">Brand Logo</h3>
      <div className="flex items-center gap-5">
        <div className="relative group shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-zinc-700">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={name ?? ""} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-teal-600/20 flex items-center justify-center">
                <span className="text-teal-300 font-bold text-lg">{initials}</span>
              </div>
            )}
          </div>
          {isUpdating && (
            <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <UploadButton
            endpoint="profileImageUploader"
            onClientUploadComplete={async (res) => {
              const url = res[0]?.ufsUrl ?? res[0]?.url;
              if (!url) return;
              setIsUpdating(true);
              const { error } = await updateAvatarAction(url);
              if (error) {
                toast.error(error);
              } else {
                onAvatarChange(url);
                toast.success("Logo updated");
              }
              setIsUpdating(false);
            }}
            onUploadError={(err) => {
              console.error("[UploadThing] logo upload error:", err);
              toast.error("Upload failed — please try again");
            }}
            appearance={{
              button:
                "ut-uploading:cursor-not-allowed bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors h-auto",
              allowedContent: "hidden",
            }}
            content={{ button: "Change logo" }}
          />
          {avatarUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUpdating}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-red-400 text-xs transition-colors disabled:opacity-50"
            >
              <X className="w-3 h-3" />
              Remove logo
            </button>
          )}
        </div>
      </div>
    </GlassSection>
  );
}

// ─── Profile Details Tab ──────────────────────────────────────────────────────

function ProfileTab({
  avatarUrl,
  onAvatarChange,
}: {
  avatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
}) {
  const { profile, refreshProfile } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: profile?.full_name ?? "",
    companyName: profile?.company_name ?? "",
    bio: profile?.bio ?? "",
    industry: profile?.industry ?? "",
    website: profile?.website ?? "",
    location: profile?.location ?? "",
  });

  function handleSave() {
    startTransition(async () => {
      const { error } = await updateProfileAction({
        name: form.name || null,
        companyName: form.companyName || null,
        bio: form.bio || null,
        industry: form.industry || null,
        website: form.website || null,
        location: form.location || null,
      });
      if (error) {
        toast.error(error);
      } else {
        await refreshProfile();
        toast.success("Profile saved");
      }
    });
  }

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      <LogoSection
        avatarUrl={avatarUrl}
        name={profile?.company_name ?? profile?.full_name ?? null}
        onAvatarChange={onAvatarChange}
      />

      <GlassSection>
        <h3 className="text-zinc-200 font-semibold text-sm mb-4">Brand Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs font-medium">Contact Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                placeholder="Jane Smith"
                className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500/30 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs font-medium">Company Name</Label>
              <Input
                value={form.companyName}
                onChange={(e) => setForm((s) => ({ ...s, companyName: e.target.value }))}
                placeholder="Acme Corp"
                className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500/30 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-400 text-xs font-medium">About</Label>
            <Textarea
              value={form.bio}
              onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))}
              placeholder="Tell creators about your brand and campaigns..."
              rows={4}
              className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500/30 rounded-xl resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs font-medium">Industry</Label>
              <Input
                value={form.industry}
                onChange={(e) => setForm((s) => ({ ...s, industry: e.target.value }))}
                placeholder="e.g., Technology"
                className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500/30 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs font-medium">Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
                placeholder="City, Country"
                className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500/30 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-400 text-xs font-medium">Website</Label>
            <Input
              value={form.website}
              onChange={(e) => setForm((s) => ({ ...s, website: e.target.value }))}
              placeholder="https://acme.com"
              type="url"
              className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500/30 rounded-xl"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isPending}
          className="mt-5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-5 h-9 text-sm font-medium transition-colors disabled:opacity-40"
        >
          {isPending ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Saving…</>
          ) : (
            <><Save className="w-3.5 h-3.5 mr-1.5" />Save Changes</>
          )}
        </Button>
      </GlassSection>
    </motion.div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const { profile } = useAuth();

  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      <GlassSection>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center">
            <Shield className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <h3 className="text-zinc-200 font-semibold text-sm">Account Security</h3>
            <p className="text-zinc-500 text-xs">Manage your authentication settings</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-zinc-800">
            <div>
              <p className="text-zinc-300 text-sm">Email Address</p>
              <p className="text-zinc-500 text-xs mt-0.5">{profile?.email}</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              Verified
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-zinc-800">
            <div>
              <p className="text-zinc-300 text-sm">Password</p>
              <p className="text-zinc-500 text-xs mt-0.5">Last changed: never</p>
            </div>
            <button
              type="button"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Change
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-zinc-300 text-sm">Two-Factor Authentication</p>
              <p className="text-zinc-500 text-xs mt-0.5">Add an extra layer of security</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
              Coming soon
            </span>
          </div>
        </div>
      </GlassSection>
    </motion.div>
  );
}

// ─── Danger Zone Tab ──────────────────────────────────────────────────────────

function DangerTab() {
  const [confirmText, setConfirmText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAccount();
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete account");
        return;
      }
      toast.success("Account deleted");
      router.replace("/auth");
    });
  }

  return (
    <motion.div
      key="danger"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      <div className="bg-red-950/30 backdrop-blur-md border border-red-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-red-900/40 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-red-200 font-semibold text-sm">Delete Account</h3>
            <p className="text-red-400/70 text-xs">This action is permanent and cannot be undone</p>
          </div>
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed mb-5">
          Deleting your account will permanently remove all your data, brand profile, campaigns,
          and history from Nexly. This cannot be reversed.
        </p>

        {!showConfirm ? (
          <Button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 hover:border-red-600/50 rounded-xl h-9 px-4 text-sm font-medium transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Delete my account
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label className="text-red-300/80 text-xs">
                Type <span className="font-mono font-bold text-red-300">DELETE</span> to confirm
              </Label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="bg-red-950/30 border-red-900/50 text-red-200 placeholder:text-red-900 focus-visible:ring-red-500/30 rounded-xl font-mono"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || isPending}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-9 px-4 text-sm font-medium transition-colors disabled:opacity-40"
              >
                {isPending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Deleting…</>
                ) : (
                  <><Trash2 className="w-3.5 h-3.5 mr-1.5" />Confirm Delete</>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => { setShowConfirm(false); setConfirmText(""); }}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl h-9 px-4 text-sm font-medium transition-colors"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const NAV_TABS: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile Details", icon: <Building2 className="w-4 h-4" /> },
  { id: "security", label: "Account Security", icon: <Shield className="w-4 h-4" /> },
  { id: "danger", label: "Danger Zone", icon: <Trash2 className="w-4 h-4" /> },
];

const BrandSettings = () => {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NavTab>("profile");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);

  async function handleSignOut() {
    await signOut();
    router.push("/auth");
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-8">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 right-1/3 w-[500px] h-[400px] rounded-full bg-teal-600/6 blur-[140px]" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/brand/dashboard"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-opacity hover:opacity-80 mb-5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Manage your brand profile</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
          {/* Left nav */}
          <nav className="lg:sticky lg:top-8 self-start">
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-2 space-y-1">
              {NAV_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? tab.id === "danger"
                        ? "bg-red-900/30 text-red-300"
                        : "bg-violet-500/15 text-violet-300"
                      : tab.id === "danger"
                      ? "text-zinc-500 hover:text-red-400 hover:bg-red-900/10"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60",
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Right content */}
          <div>
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <ProfileTab avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />
              )}
              {activeTab === "security" && <SecurityTab />}
              {activeTab === "danger" && <DangerTab />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSettings;
