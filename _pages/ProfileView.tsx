"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MessageSquare, MapPin, Globe, ExternalLink,
  Users, Send, Edit2, Plus, Trash2, Check, X, UserPlus,
  UserCheck, Clock, Briefcase, BarChart3, Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMessaging } from "@/components/messaging/MessagingContext";
import {
  getProfileAction,
  updateProfileAction,
  updateSocialLinksAction,
  type PublicProfile,
  type SocialLink,
} from "@/app/actions/profile";
import { sendMessageAction } from "@/app/actions/messages";
import {
  getConnectionStatusAction,
  sendConnectionRequestAction,
  withdrawConnectionAction,
  acceptConnectionAction,
  rejectConnectionAction,
  removeConnectionAction,
  type ConnectionStatusResult,
} from "@/app/actions/connections";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

const PLATFORM_OPTIONS = [
  "Instagram", "TikTok", "YouTube", "Twitter", "LinkedIn",
  "Twitch", "Facebook", "Pinterest", "Snapchat", "Other",
];

// ─── Social Links Editor ───────────────────────────────────────────────────────

function SocialLinksSection({
  links,
  isOwn,
  onSave,
}: {
  links: SocialLink[];
  isOwn: boolean;
  onSave: (links: SocialLink[]) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<SocialLink[]>(links);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const addLink = () => setDraft((prev) => [...prev, { platform: "Instagram", url: "" }]);
  const removeLink = (i: number) => setDraft((prev) => prev.filter((_, idx) => idx !== i));
  const updateLink = (i: number, field: keyof SocialLink, val: string) =>
    setDraft((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: val } : l)));

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft.filter((l) => l.url.trim()));
    setSaving(false);
    setEditing(false);
    toast({ title: "Social links updated" });
  };

  if (!editing) {
    return (
      <div>
        {links.length === 0 && !isOwn ? null : (
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Social Links</h3>
            {isOwn && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1"
                onClick={() => { setDraft(links); setEditing(true); }}
              >
                <Edit2 className="w-3 h-3" /> Edit
              </Button>
            )}
          </div>
        )}
        {links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map((l, i) => (
              <a
                key={i}
                href={l.url.startsWith("http") ? l.url : `https://${l.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
              >
                <Link2 className="w-3 h-3" />
                {l.platform}
                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
              </a>
            ))}
            {isOwn && (
              <button
                onClick={() => { setDraft(links); setEditing(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 text-xs text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            )}
          </div>
        )}
        {links.length === 0 && isOwn && (
          <button
            onClick={() => { setDraft([]); setEditing(true); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Plus className="w-4 h-4" /> Add social links
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Social Links</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button size="sm" className="h-7 px-2 text-xs btn-gradient" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : <><Check className="w-3 h-3 mr-1" />Save</>}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {draft.map((l, i) => (
          <div key={i} className="flex gap-2 items-center">
            <select
              value={l.platform}
              onChange={(e) => updateLink(i, "platform", e.target.value)}
              className="h-9 px-2 text-xs border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background w-28 shrink-0"
            >
              {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <Input
              value={l.url}
              onChange={(e) => updateLink(i, "url", e.target.value)}
              placeholder="https://..."
              className="h-9 text-xs flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-muted-foreground hover:text-red-500 shrink-0"
              onClick={() => removeLink(i)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1 w-full" onClick={addLink}>
          <Plus className="w-3 h-3" /> Add link
        </Button>
      </div>
    </div>
  );
}

// ─── Edit Profile Modal ────────────────────────────────────────────────────────

function EditProfileModal({
  profile,
  onSave,
  onClose,
}: {
  profile: PublicProfile;
  onSave: (data: Parameters<typeof updateProfileAction>[0]) => Promise<void>;
  onClose: () => void;
}) {
  const isCreator = profile.user_type === "creator";
  const [name, setName] = useState(profile.full_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [niche, setNiche] = useState(profile.niche ?? "");
  const [primaryPlatform, setPrimaryPlatform] = useState(profile.primary_platform ?? "");
  const [companyName, setCompanyName] = useState(profile.company_name ?? "");
  const [industry, setIndustry] = useState(profile.industry ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      name,
      bio,
      location,
      ...(isCreator ? { niche, primaryPlatform } : { companyName, industry, website }),
    });
    setSaving(false);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>Update your public profile information.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Display Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself…"
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1">{bio.length}/500</p>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
        </div>
        {isCreator ? (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Niche / Categories</label>
              <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="beauty, fashion, lifestyle" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Primary Platform</label>
              <select
                value={primaryPlatform}
                onChange={(e) => setPrimaryPlatform(e.target.value)}
                className="w-full h-9 px-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background"
              >
                <option value="">None</option>
                {["youtube", "tiktok", "instagram", "twitter", "twitch", "linkedin"].map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Company Name</label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Industry</label>
              <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Fashion, Tech…" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Website</label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
            </div>
          </>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving} className="btn-gradient">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// ─── Connection Button ─────────────────────────────────────────────────────────

function ConnectButton({
  status,
  connectionId,
  onStatusChange,
}: {
  status: ConnectionStatusResult;
  connectionId: string | null;
  onStatusChange: (s: ConnectionStatusResult, id: string | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handle = async () => {
    setLoading(true);
    if (status === "none") {
      // handled by parent since we need targetId — passed via parent callback
      onStatusChange("pending_sent", null);
    } else if (status === "pending_sent" && connectionId) {
      await withdrawConnectionAction(connectionId);
      onStatusChange("none", null);
      toast({ title: "Request withdrawn" });
    } else if (status === "accepted" && connectionId) {
      await removeConnectionAction(connectionId);
      onStatusChange("none", null);
      toast({ title: "Connection removed" });
    }
    setLoading(false);
  };

  if (status === "pending_received" && connectionId) {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          className="gap-2 btn-gradient"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await acceptConnectionAction(connectionId);
            onStatusChange("accepted", connectionId);
            toast({ title: "Connected!" });
            setLoading(false);
          }}
        >
          <Check className="w-4 h-4" /> Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await rejectConnectionAction(connectionId);
            onStatusChange("rejected", null);
            toast({ title: "Request declined" });
            setLoading(false);
          }}
        >
          <X className="w-4 h-4" /> Decline
        </Button>
      </div>
    );
  }

  const label =
    status === "accepted" ? "Connected" :
    status === "pending_sent" ? "Pending" :
    "Connect";
  const Icon =
    status === "accepted" ? UserCheck :
    status === "pending_sent" ? Clock :
    UserPlus;

  return (
    <Button
      size="sm"
      variant={status === "none" ? "default" : "outline"}
      className={cn("gap-2", status === "none" && "btn-gradient")}
      disabled={loading}
      onClick={handle}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatItem({ icon: Icon, value, label, href }: { icon: React.ElementType; value: number | string; label: string; href?: string }) {
  const content = (
    <div className="flex flex-col items-center gap-0.5 p-3 text-center">
      <Icon className="w-4 h-4 text-muted-foreground mb-1" />
      <span className="text-lg font-bold font-display">{value}</span>
      <span className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  );
  if (href) return <Link href={href} className="hover:bg-secondary/50 rounded-lg transition-colors">{content}</Link>;
  return content;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ProfileView = ({ profileId }: { profileId?: string }) => {
  const params = useParams();
  const id = profileId ?? (params?.id as string | undefined);
  const router = useRouter();
  const { profile: currentUser } = useAuth();
  const { toast } = useToast();
  const { openChatWindow } = useMessaging();

  const [profileData, setProfileData] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [connStatus, setConnStatus] = useState<ConnectionStatusResult>("none");
  const [connId, setConnId] = useState<string | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalText, setProposalText] = useState("");
  const [sendingProposal, setSendingProposal] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProfileAction(id).then((data) => {
      if (!data) setNotFound(true);
      else setProfileData(data);
      setLoading(false);
    });
    getConnectionStatusAction(id).then((info) => {
      setConnStatus(info.status);
      setConnId(info.connectionId);
    });
  }, [id]);

  const handleMessage = () => {
    if (!profileData || !currentUser) return;
    openChatWindow({
      id: profileData.userId,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url,
      user_type: profileData.user_type,
    });
  };

  const handleConnect = async () => {
    if (!id) return;
    const res = await sendConnectionRequestAction(id);
    if (!res.error && res.connectionId) {
      setConnStatus("pending_sent");
      setConnId(res.connectionId);
      toast({ title: "Connection request sent!" });
    } else if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
  };

  const handleSaveProfile = async (data: Parameters<typeof updateProfileAction>[0]) => {
    const res = await updateProfileAction(data);
    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Profile updated" });
      if (id) {
        getProfileAction(id).then((d) => { if (d) setProfileData(d); });
      }
    }
  };

  const handleSaveSocialLinks = async (links: SocialLink[]) => {
    const res = await updateSocialLinksAction(links);
    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else if (id) {
      getProfileAction(id).then((d) => { if (d) setProfileData(d); });
    }
  };

  const handleSendProposal = async () => {
    if (!profileData || !currentUser || !proposalText.trim()) return;
    setSendingProposal(true);
    const res = await sendMessageAction(profileData.userId, proposalText.trim());
    setSendingProposal(false);
    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Proposal sent!" });
      setProposalText("");
      setShowProposalModal(false);
      openChatWindow({
        id: profileData.userId,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        user_type: profileData.user_type,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (notFound || !profileData) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Profile not found</h1>
          <Button asChild><Link href="/">Go Home</Link></Button>
        </div>
      </div>
    );
  }

  const isCreator = profileData.user_type === "creator";
  const isOwnProfile = currentUser?.id === profileData.userId;

  return (
    <>
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{profileData.full_name ?? "Profile"}</p>
            <p className="text-xs text-muted-foreground capitalize">{profileData.user_type}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* ── Profile card (LinkedIn-style) ── */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
          {/* Cover */}
          <div
            className={cn(
              "h-24 w-full",
              isCreator
                ? "bg-gradient-to-r from-violet-600/80 to-purple-600/80"
                : "bg-gradient-to-r from-teal-600/80 to-cyan-600/80",
            )}
          />

          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-xl ring-4 ring-white dark:ring-zinc-900 overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg">
                {profileData.avatar_url ? (
                  <img src={profileData.avatar_url} alt={profileData.full_name ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <div className={cn(
                    "w-full h-full flex items-center justify-center text-2xl font-bold text-white",
                    isCreator ? "bg-gradient-to-br from-violet-600 to-purple-600" : "bg-gradient-to-br from-teal-600 to-cyan-600",
                  )}>
                    {(profileData.full_name ?? "U")[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {isOwnProfile ? (
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowEditModal(true)}>
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </Button>
                ) : currentUser ? (
                  <>
                    {connStatus === "none" ? (
                      <Button size="sm" className="gap-2 btn-gradient" onClick={handleConnect}>
                        <UserPlus className="w-4 h-4" /> Connect
                      </Button>
                    ) : (
                      <ConnectButton
                        status={connStatus}
                        connectionId={connId}
                        onStatusChange={(s, cid) => { setConnStatus(s); setConnId(cid); }}
                      />
                    )}
                    <Button size="sm" variant="outline" className="gap-2" onClick={handleMessage}>
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </Button>
                    {currentUser.user_type === "brand" && isCreator && (
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowProposalModal(true)}>
                        <Send className="w-3.5 h-3.5" /> Proposal
                      </Button>
                    )}
                  </>
                ) : null}
              </div>
            </div>

            {/* Name + badges */}
            <div className="mb-3">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="font-display text-2xl font-bold">{profileData.full_name ?? "User"}</h1>
                <Badge variant={isCreator ? "default" : "secondary"} className="capitalize text-xs">
                  {profileData.user_type}
                </Badge>
              </div>

              {isCreator ? (
                <>
                  {profileData.niche && (
                    <p className="text-muted-foreground text-sm mb-2">{profileData.niche}</p>
                  )}
                </>
              ) : (
                <>
                  {profileData.company_name && (
                    <p className="font-medium text-sm mb-0.5">{profileData.company_name}</p>
                  )}
                  {profileData.industry && (
                    <p className="text-muted-foreground text-sm mb-2">{profileData.industry}</p>
                  )}
                </>
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {profileData.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {profileData.location}
                  </span>
                )}
                {profileData.website && (
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline">
                    <Globe className="w-3 h-3" /> {profileData.website.replace(/^https?:\/\//, "")}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-0 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl overflow-hidden mb-4">
              <StatItem icon={Users} value={formatNumber(profileData.connectionCount)} label="Connections" />
              {isCreator ? (
                <>
                  <div className="border-x border-zinc-200/60 dark:border-zinc-800/80">
                    <StatItem icon={BarChart3} value={`${profileData.avg_engagement_rate}%`} label="Eng Rate" />
                  </div>
                  <StatItem icon={Users} value={formatNumber(profileData.total_followers)} label="Followers" />
                </>
              ) : (
                <>
                  <div className="border-x border-zinc-200/60 dark:border-zinc-800/80">
                    <StatItem icon={Briefcase} value={profileData.campaigns.length} label="Campaigns" />
                  </div>
                  <StatItem icon={Users} value={profileData.communityListCount ?? 0} label="Lists" />
                </>
              )}
            </div>

            {/* Bio */}
            {profileData.bio ? (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{profileData.bio}</p>
            ) : isOwnProfile ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="text-sm text-muted-foreground hover:text-primary mb-4 block transition-colors"
              >
                + Add a bio
              </button>
            ) : null}

            {/* Social links */}
            <SocialLinksSection
              links={profileData.socialLinks ?? []}
              isOwn={isOwnProfile}
              onSave={handleSaveSocialLinks}
            />
          </div>
        </div>

        {/* ── Platform Stats ── */}
        {isCreator && profileData.platformStats.length > 0 && (
          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-bold mb-4">Platform Stats</h2>
            <div className="space-y-3">
              {profileData.platformStats.map((s) => (
                <div key={s.platform} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <span className="text-sm font-medium capitalize">{s.platform}</span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {s.followerCount != null && (
                      <span>{formatNumber(s.followerCount)} followers</span>
                    )}
                    {s.engagementRate != null && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {s.engagementRate}% eng
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Active Campaigns (for brands) ── */}
        {!isCreator && profileData.campaigns.length > 0 && (
          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-bold mb-4">Active Campaigns</h2>
            <div className="space-y-3">
              {profileData.campaigns.map((c) => (
                <div key={c.id} className="flex items-start justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{c.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">${c.budget.toLocaleString()}</p>
                    <Badge
                      variant={c.status === "ACTIVE" ? "default" : "secondary"}
                      className="text-[10px] capitalize mt-0.5"
                    >
                      {c.status.toLowerCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <EditProfileModal
          profile={profileData}
          onSave={handleSaveProfile}
          onClose={() => setShowEditModal(false)}
        />
      </Dialog>

      {/* Proposal Modal */}
      <Dialog open={showProposalModal} onOpenChange={setShowProposalModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Proposal</DialogTitle>
            <DialogDescription>
              Send a collaboration proposal to {profileData.full_name ?? "this creator"}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              placeholder="Describe your campaign, budget expectations, and what you're looking for…"
              value={proposalText}
              onChange={(e) => setProposalText(e.target.value)}
              rows={5}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground mt-1">{proposalText.length}/2000</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProposalModal(false)}>Cancel</Button>
            <Button
              onClick={handleSendProposal}
              disabled={sendingProposal || !proposalText.trim()}
              className="btn-gradient gap-2"
            >
              <Send className="w-4 h-4" />
              {sendingProposal ? "Sending…" : "Send Proposal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileView;
