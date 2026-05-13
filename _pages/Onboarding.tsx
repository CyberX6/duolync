import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, User, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const industries = [
  "Technology", "Fashion", "Beauty", "Food & Beverage", "Health & Fitness",
  "Travel", "Gaming", "Finance", "Education", "Entertainment", "Other"
];

const niches = [
  "Lifestyle", "Tech Reviews", "Gaming", "Beauty & Makeup", "Fashion",
  "Fitness", "Food & Cooking", "Travel", "Comedy", "Education", "Music", "Other"
];

const platforms = [
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "twitch", label: "Twitch" },
  { value: "linkedin", label: "LinkedIn" },
];

const Onboarding = () => {
  const { user, profile, updateProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Brand fields
  const [brandAccountType, setBrandAccountType] = useState<"company" | "personal">("company");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  
  // Creator fields
  const [niche, setNiche] = useState("");
  const [primaryPlatform, setPrimaryPlatform] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    // Check if onboarding is complete
    if (profile) {
      if (profile.user_type === "brand" && profile.industry) {
        router.replace("/brand/dashboard");
      } else if (profile.user_type === "creator" && profile.niche) {
        router.replace("/creator/dashboard");
      }
    }
  }, [profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.replace("/auth");
    }
  }, [loading, user, profile, router]);

  if (!user || !profile) {
    return null;
  }

  const isBrand = profile.user_type === "brand";
  const totalSteps = isBrand ? 2 : 2;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      const updates = isBrand
        ? {
            brand_account_type: brandAccountType,
            company_name: companyName || null,
            industry,
            website: website || null,
            bio: bio || null,
          }
        : {
            niche,
            primary_platform: primaryPlatform as any,
            location: location || null,
            bio: bio || null,
          };

      const { error } = await updateProfile(updates);
      
      if (error) throw error;
      
      toast({ title: "Profile complete!", description: "Welcome to Duolync!" });
      router.replace(isBrand ? "/brand/dashboard" : "/creator/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="card-elevated p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isBrand ? "bg-primary/10" : "bg-accent/10"}`}>
              {isBrand ? (
                <Building2 className={`w-8 h-8 text-primary`} />
              ) : (
                <User className={`w-8 h-8 text-accent`} />
              )}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Complete Your {isBrand ? "Brand" : "Creator"} Profile
            </h1>
            <p className="text-muted-foreground">Step {step} of {totalSteps}</p>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i < step ? (isBrand ? "bg-primary" : "bg-accent") : "bg-secondary"
                }`}
              />
            ))}
          </div>

          {/* Brand Onboarding */}
          {isBrand && (
            <>
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <Label className="text-base mb-4 block">Account Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setBrandAccountType("company")}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          brandAccountType === "company"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Building2 className="w-6 h-6 mb-2" />
                        <div className="font-semibold">Company</div>
                        <div className="text-sm text-muted-foreground">For businesses</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBrandAccountType("personal")}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          brandAccountType === "personal"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <User className="w-6 h-6 mb-2" />
                        <div className="font-semibold">Personal</div>
                        <div className="text-sm text-muted-foreground">For individuals</div>
                      </button>
                    </div>
                  </div>

                  {brandAccountType === "company" && (
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="Acme Inc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell creators about your brand..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Creator Onboarding */}
          {!isBrand && (
            <>
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="niche">Content Niche *</Label>
                    <Select value={niche} onValueChange={setNiche}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your niche" />
                      </SelectTrigger>
                      <SelectContent>
                        {niches.map((n) => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Primary Platform *</Label>
                    <Select value={primaryPlatform} onValueChange={setPrimaryPlatform}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your main platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((p) => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Los Angeles, CA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell brands about yourself and your content..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>You can connect your social accounts after setup</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                className={isBrand ? "btn-gradient gap-2" : "btn-accent gap-2"}
                disabled={
                  (isBrand && step === 1 && !industry) ||
                  (!isBrand && step === 1 && (!niche || !primaryPlatform))
                }
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className={isBrand ? "btn-gradient gap-2" : "btn-accent gap-2"}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Complete Setup"}
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
