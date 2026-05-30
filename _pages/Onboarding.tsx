import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { completeOnboardingAction } from "@/app/actions/profile";

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

// Reusable full-screen dark hold screen shown while we verify session +
// onboarding state. Prevents the wizard from ever flashing on the screen
// for users who have already completed setup.
const HoldScreen = () => (
  <div className="min-h-screen gradient-hero flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
  </div>
);

const Onboarding = () => {
  const { user, profile, refreshProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Blocks the wizard from painting until we've confirmed, via localStorage,
  // that the user actually needs to complete onboarding. Stays true while:
  //   • Better Auth is still resolving the session cookie, OR
  //   • We are in the process of redirecting away
  // Only flips to false when all three conditions are met:
  //   1. loading resolved, 2. user is authenticated, 3. onboarding is incomplete
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

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
    // Still waiting for Better Auth session resolution — hold screen stays up.
    if (loading) return;

    if (!user || !profile) {
      router.replace("/auth");
      return; // Redirecting — keep hold screen; wizard must not render.
    }

    if (profile.hasCompletedOnboarding) {
      router.replace(profile.user_type === "brand" ? "/brand/dashboard" : "/creator/dashboard");
      return; // Redirecting — keep hold screen; wizard must not render.
    }

    // All clear: session is valid, onboarding is genuinely incomplete.
    setIsCheckingOnboarding(false);
  }, [loading, user, profile, router]);

  // Hold screen covers all pre-decision states — auth loading, redirect
  // in-flight, and the very first paint before useEffect runs.
  if (isCheckingOnboarding) return <HoldScreen />;

  // At this point we know: user is non-null, profile is non-null,
  // and onboarding has NOT been completed. Safe to cast.
  const isBrand = profile!.user_type === "brand";
  const totalSteps = 2;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      const data = isBrand
        ? {
            brandAccountType,
            companyName: companyName || undefined,
            industry,
            website: website || undefined,
            bio: bio || undefined,
          }
        : {
            niche,
            primaryPlatform,
            location: location || undefined,
            bio: bio || undefined,
          };

      const { error } = await completeOnboardingAction(data);
      if (error) throw new Error(error);

      // Refresh the DB-backed profile so hasCompletedOnboarding flips to true,
      // then show the hold screen while the route transition completes.
      setIsCheckingOnboarding(true);
      await refreshProfile();

      toast({ title: "Profile complete!", description: "Welcome to Duolync!" });
      router.replace(isBrand ? "/brand/dashboard" : "/creator/dashboard");
    } catch (err: unknown) {
      setIsCheckingOnboarding(false);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Role-specific visual tokens
  const roleClasses = isBrand
    ? {
        iconBg: "bg-cyan-500/10",
        iconColor: "text-cyan-400",
        progressActive: "bg-cyan-400",
        selectedBorder: "border-cyan-500 bg-cyan-500/5",
        selectedText: "text-cyan-300",
        checkColor: "text-cyan-400",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      }
    : {
        iconBg: "bg-violet-500/10",
        iconColor: "text-violet-400",
        progressActive: "bg-violet-500",
        selectedBorder: "border-violet-500 bg-violet-500/5",
        selectedText: "text-violet-300",
        checkColor: "text-violet-400",
        badgeBg: "bg-violet-500/10 text-violet-400 border-violet-500/30",
      };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="card-elevated p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${roleClasses.iconBg}`}>
              {isBrand ? (
                <Building2 className={`w-8 h-8 ${roleClasses.iconColor}`} />
              ) : (
                <User className={`w-8 h-8 ${roleClasses.iconColor}`} />
              )}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Complete Your {isBrand ? "Brand" : "Creator"} Profile
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <p className="text-muted-foreground">Step {step} of {totalSteps}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${roleClasses.badgeBg}`}>
                {isBrand ? "Brand Account" : "Creator Account"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                  i < step ? roleClasses.progressActive : "bg-secondary"
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
                            ? roleClasses.selectedBorder
                            : "border-border hover:border-cyan-500/50"
                        }`}
                      >
                        <Building2 className={`w-6 h-6 mb-2 ${brandAccountType === "company" ? roleClasses.iconColor : ""}`} />
                        <div className={`font-semibold ${brandAccountType === "company" ? roleClasses.selectedText : ""}`}>Company</div>
                        <div className="text-sm text-muted-foreground">For businesses</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBrandAccountType("personal")}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          brandAccountType === "personal"
                            ? roleClasses.selectedBorder
                            : "border-border hover:border-cyan-500/50"
                        }`}
                      >
                        <User className={`w-6 h-6 mb-2 ${brandAccountType === "personal" ? roleClasses.iconColor : ""}`} />
                        <div className={`font-semibold ${brandAccountType === "personal" ? roleClasses.selectedText : ""}`}>Personal</div>
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
                        className="h-12 focus-visible:ring-cyan-500/50"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="h-12 data-[state=open]:ring-cyan-500/50">
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
                      className="h-12 focus-visible:ring-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell creators about your brand..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-[120px] resize-none focus-visible:ring-cyan-500/50"
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
                      <SelectTrigger className="h-12 data-[state=open]:ring-violet-500/50">
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
                      <SelectTrigger className="h-12 data-[state=open]:ring-violet-500/50">
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
                      className="h-12 focus-visible:ring-violet-500/50"
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
                      className="min-h-[120px] resize-none focus-visible:ring-violet-500/50"
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
                className={`gap-2 font-semibold text-white ${
                  isBrand
                    ? "bg-cyan-500 hover:bg-cyan-600 shadow-[0_4px_20px_rgba(6,182,212,0.35)]"
                    : "btn-gradient"
                }`}
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
                className={`gap-2 font-semibold text-white ${
                  isBrand
                    ? "bg-cyan-500 hover:bg-cyan-600 shadow-[0_4px_20px_rgba(6,182,212,0.35)]"
                    : "btn-gradient"
                }`}
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
