import { useState } from "react";
import { Save, User, Globe, MapPin, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { profileSchema } from "@/lib/validation";

const CreatorSettings = () => {
  const { profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    niche: profile?.niche || "",
    location: profile?.location || "",
    website: profile?.website || "",
  });

  const handleSave = async () => {
    if (!profile) return;

    // Validate form data before submission
    const validation = profileSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError?.message || "Please check your input");
      return;
    }

    setSaving(true);
    // TODO: implement via server action
    await new Promise((r) => setTimeout(r, 300));
    setSaving(false);
    toast.success("Profile updated successfully");
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="card-elevated p-6">
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell brands about yourself..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="niche">Niche</Label>
                <Input
                  id="niche"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  placeholder="e.g., Tech, Gaming, Lifestyle"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <Label htmlFor="website" className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={saving} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatorSettings;
