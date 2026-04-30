import { useState, useCallback } from "react";
import { Plus, Link2, Trash2, Star, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { socialAccountSchema } from "@/lib/validation";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  profile_url: string | null;
  followers: number;
  total_views: number;
  engagement_rate: number;
  is_primary: boolean;
}

const platforms = [
  { value: "youtube", label: "YouTube", emoji: "▶️" },
  { value: "tiktok", label: "TikTok", emoji: "📱" },
  { value: "instagram", label: "Instagram", emoji: "📷" },
  { value: "twitter", label: "Twitter", emoji: "🐦" },
  { value: "twitch", label: "Twitch", emoji: "🎮" },
  { value: "linkedin", label: "LinkedIn", emoji: "💼" },
];

const SocialAccounts = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [phylloLoading, setPhylloLoading] = useState(false);
  const [phylloSyncing, setPhylloSyncing] = useState(false);

  // New account form
  const [newPlatform, setNewPlatform] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newProfileUrl, setNewProfileUrl] = useState("");
  const [newFollowers, setNewFollowers] = useState("");
  const [newViews, setNewViews] = useState("");
  const [newEngagement, setNewEngagement] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Phyllo Connect Flow ──────────────────────────────────────
  const handlePhylloConnect = useCallback(() => {
    toast({ title: "Auto-Connect coming soon", description: "Phyllo integration will be available after backend setup." });
  }, [toast]);

  // ─── Manual Add ──────────────────────────────────────────────
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const validation = socialAccountSchema.safeParse({
      platform: newPlatform || undefined,
      username: newUsername,
      profile_url: newProfileUrl || undefined,
      followers: newFollowers ? parseInt(newFollowers) : undefined,
      total_views: newViews ? parseInt(newViews) : undefined,
      engagement_rate: newEngagement ? parseFloat(newEngagement) : undefined,
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({ title: "Validation Error", description: firstError?.message || "Please check your input", variant: "destructive" });
      return;
    }

    const data = validation.data;
    setIsSubmitting(true);
    const newAccount: SocialAccount = {
      id: Date.now().toString(),
      platform: data.platform,
      username: data.username,
      profile_url: data.profile_url || null,
      followers: Number.isNaN(data.followers) ? 0 : (data.followers || 0),
      total_views: Number.isNaN(data.total_views) ? 0 : (data.total_views || 0),
      engagement_rate: Number.isNaN(data.engagement_rate) ? 0 : (data.engagement_rate || 0),
      is_primary: accounts.length === 0,
    };
    setAccounts((prev) => [...prev, newAccount]);
    toast({ title: "Account added successfully!" });
    setDialogOpen(false);
    resetForm();
    setIsSubmitting(false);
  };

  const handleSetPrimary = (accountId: string) => {
    setAccounts((prev) => prev.map((a) => ({ ...a, is_primary: a.id === accountId })));
    toast({ title: "Primary account updated" });
  };

  const handleDelete = (accountId: string) => {
    if (!confirm("Are you sure you want to remove this account?")) return;
    setAccounts((prev) => prev.filter((a) => a.id !== accountId));
    toast({ title: "Account removed" });
  };

  const resetForm = () => {
    setNewPlatform("");
    setNewUsername("");
    setNewProfileUrl("");
    setNewFollowers("");
    setNewViews("");
    setNewEngagement("");
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPlatformEmoji = (platform: string) => {
    return platforms.find((p) => p.value === platform)?.emoji || "📱";
  };

  const connectedPlatforms = accounts.map((a) => a.platform);
  const availablePlatforms = platforms.filter((p) => !connectedPlatforms.includes(p.value));

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Social Accounts</h1>
            <p className="text-muted-foreground">
              Connect your social media accounts to showcase your stats
            </p>
          </div>

          <div className="flex gap-2">
            {/* Phyllo Auto-Connect Button */}
            <Button
              onClick={handlePhylloConnect}
              disabled={phylloLoading || phylloSyncing}
              className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              {phylloLoading || phylloSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {phylloSyncing ? "Syncing..." : phylloLoading ? "Connecting..." : "Auto-Connect"}
            </Button>

            {/* Manual Add */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={availablePlatforms.length === 0}>
                  <Plus className="w-4 h-4" />
                  Add Manually
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Social Account</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddAccount} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Platform *</Label>
                    <Select value={newPlatform} onValueChange={setNewPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePlatforms.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            <span className="flex items-center gap-2">
                              <span>{p.emoji}</span>
                              <span>{p.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Username *</Label>
                    <Input
                      placeholder="@yourusername"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Profile URL</Label>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={newProfileUrl}
                      onChange={(e) => setNewProfileUrl(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Followers</Label>
                      <Input
                        type="number"
                        placeholder="10000"
                        value={newFollowers}
                        onChange={(e) => setNewFollowers(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Views</Label>
                      <Input
                        type="number"
                        placeholder="500000"
                        value={newViews}
                        onChange={(e) => setNewViews(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Eng. Rate %</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="4.5"
                        value={newEngagement}
                        onChange={(e) => setNewEngagement(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !newPlatform || !newUsername}>
                      {isSubmitting ? "Adding..." : "Add Account"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Auto-Connect Info Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-foreground">Auto-Connect with Phyllo</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Auto-Connect" to securely link your social accounts and automatically import 
                your real follower counts, views, and engagement rates. No manual entry needed!
              </p>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-elevated p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-secondary" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-secondary rounded w-1/4" />
                    <div className="h-4 bg-secondary rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : accounts.length > 0 ? (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="card-elevated p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-3xl shrink-0">
                    {getPlatformEmoji(account.platform)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-lg capitalize">
                        {account.platform}
                      </h3>
                      {account.is_primary && (
                        <span className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-current" />
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">@{account.username}</p>
                    {account.profile_url && (
                      <a
                        href={account.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View Profile →
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-xl font-display font-bold">
                        {formatNumber(account.followers)}
                      </div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div>
                      <div className="text-xl font-display font-bold">
                        {formatNumber(Number(account.total_views))}
                      </div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div>
                      <div className="text-xl font-display font-bold text-green-600">
                        {account.engagement_rate}%
                      </div>
                      <div className="text-xs text-muted-foreground">Engagement</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!account.is_primary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetPrimary(account.id)}
                        title="Set as primary"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(account.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-elevated p-12 text-center">
            <Link2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">No accounts connected</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Connect your social media accounts to let brands see your stats and reach
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={handlePhylloConnect} className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <Zap className="w-4 h-4" />
                Auto-Connect
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Manually
              </Button>
            </div>
          </div>
        )}

        {/* Tip Card */}
        <div className="mt-8 p-6 rounded-2xl bg-secondary/50 border border-border">
          <h4 className="font-semibold mb-2">💡 Tip</h4>
          <p className="text-sm text-muted-foreground">
            Use Auto-Connect for accurate, verified stats that brands trust more. 
            Manually added stats can be updated anytime but may carry less weight with brands.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SocialAccounts;
