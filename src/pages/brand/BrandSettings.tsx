import { useState } from "react";
import { Save, Building2, Globe, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { profileSchema } from "@/lib/validation";

const BrandSettings = () => {
  const { profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    company_name: profile?.company_name || "",
    bio: profile?.bio || "",
    industry: profile?.industry || "",
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
          <p className="text-muted-foreground">Manage your brand profile and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="card-elevated p-6">
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Brand Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Contact Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Your company name"
                />
              </div>

              <div>
                <Label htmlFor="bio">About</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell creators about your brand..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry" className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Industry
                  </Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., Technology"
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

export default BrandSettings;
