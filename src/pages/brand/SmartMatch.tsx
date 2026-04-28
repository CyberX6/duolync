import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ArrowLeft, Check, Building2, Target, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const industries = [
  "Technology", "Fashion", "Beauty", "Food & Beverage", "Health & Fitness",
  "Travel", "Gaming", "Finance", "Education", "Entertainment"
];

const goals = [
  { id: "awareness", label: "Brand Awareness", description: "Increase visibility and reach" },
  { id: "engagement", label: "Engagement", description: "Drive likes, comments, shares" },
  { id: "sales", label: "Sales & Conversions", description: "Drive purchases or sign-ups" },
  { id: "content", label: "Content Creation", description: "Get quality branded content" },
];

const platforms = [
  { id: "youtube", label: "YouTube", emoji: "▶️" },
  { id: "tiktok", label: "TikTok", emoji: "📱" },
  { id: "instagram", label: "Instagram", emoji: "📷" },
  { id: "twitter", label: "Twitter", emoji: "🐦" },
  { id: "twitch", label: "Twitch", emoji: "🎮" },
];

interface MatchedCreator {
  id: string;
  full_name: string;
  avatar_url: string | null;
  niche: string | null;
  total_followers: number;
  avg_engagement_rate: number;
  primary_platform: string | null;
  match_score: number;
  match_reason: string;
}

const SmartMatch = () => {
  const { profile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedCreators, setMatchedCreators] = useState<MatchedCreator[]>([]);
  
  // Form data
  const [selectedIndustry, setSelectedIndustry] = useState(profile?.industry || "");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [budget, setBudget] = useState([5000]);
  const [campaignDescription, setCampaignDescription] = useState("");

  const totalSteps = 4;

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((g) => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const formatBudget = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const runSmartMatch = async () => {
    setIsMatching(true);
    // TODO: implement via server action / API route
    await new Promise((r) => setTimeout(r, 800));
    toast({ title: "No matches found", description: "Connect the backend to enable Smart Match" });
    setIsMatching(false);
  };

  const formatFollowers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const platformEmoji: Record<string, string> = {
    youtube: "▶️",
    tiktok: "📱",
    instagram: "📷",
    twitter: "🐦",
    twitch: "🎮",
    linkedin: "💼",
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6">
        {step <= totalSteps && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">Smart Match</h1>
              <p className="text-muted-foreground">
                Tell us about your campaign and we'll find the perfect creators
              </p>
            </div>

            {/* Progress */}
            <div className="flex gap-2 mb-8">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i < step ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>

            <div className="card-elevated p-8">
              {/* Step 1: Industry */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold">Your Industry</h2>
                      <p className="text-sm text-muted-foreground">Select your business category</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {industries.map((industry) => (
                      <button
                        key={industry}
                        onClick={() => setSelectedIndustry(industry)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedIndustry === industry
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Goals */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold">Campaign Goals</h2>
                      <p className="text-sm text-muted-foreground">What do you want to achieve?</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {goals.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => handleGoalToggle(goal.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                          selectedGoals.includes(goal.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedGoals.includes(goal.id) ? "border-primary bg-primary" : "border-border"
                        }`}>
                          {selectedGoals.includes(goal.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{goal.label}</div>
                          <div className="text-sm text-muted-foreground">{goal.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Platforms & Budget */}
              {step === 3 && (
                <div className="animate-fade-in space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="text-xl">📱</span>
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold">Preferred Platforms</h2>
                        <p className="text-sm text-muted-foreground">Where should your campaign run?</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {platforms.map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => handlePlatformToggle(platform.id)}
                          className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                            selectedPlatforms.includes(platform.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span>{platform.emoji}</span>
                          <span>{platform.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold">Budget Range</h2>
                        <p className="text-sm text-muted-foreground">Your campaign budget</p>
                      </div>
                    </div>

                    <div className="px-2">
                      <div className="text-3xl font-display font-bold text-center mb-6">
                        {formatBudget(budget[0])}
                      </div>
                      <Slider
                        value={budget}
                        onValueChange={setBudget}
                        min={500}
                        max={50000}
                        step={500}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>$500</span>
                        <span>$50K+</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Description */}
              {step === 4 && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-xl">✍️</span>
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold">Campaign Details</h2>
                      <p className="text-sm text-muted-foreground">Tell us more about your campaign (optional)</p>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Describe your campaign, target audience, any specific requirements..."
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < totalSteps ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    className="btn-gradient gap-2"
                    disabled={
                      (step === 1 && !selectedIndustry) ||
                      (step === 2 && selectedGoals.length === 0)
                    }
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={runSmartMatch}
                    className="btn-gradient gap-2"
                    disabled={isMatching}
                  >
                    {isMatching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Finding Matches...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Find My Matches
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Results */}
        {step === 5 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">Your Perfect Matches</h1>
              <p className="text-muted-foreground">
                Based on your criteria, here are the best creators for your campaign
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {matchedCreators.map((creator) => (
                <div key={creator.id} className="card-interactive p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl shrink-0">
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={creator.full_name || ""}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        "👤"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-display font-bold truncate">
                          {creator.full_name || "Creator"}
                        </div>
                        <div className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          {creator.match_score}% Match
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{creator.niche}</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {creator.match_reason}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span>{creator.primary_platform ? platformEmoji[creator.primary_platform] : "📱"}</span>
                      <span className="font-semibold">{formatFollowers(creator.total_followers)}</span>
                    </div>
                    <div className="text-green-600 font-medium">
                      {creator.avg_engagement_rate}% ER
                    </div>
                  </div>

                  <Button asChild className="w-full mt-4" variant="outline">
                    <a href={`/profile/${creator.id}`}>View Profile</a>
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setStep(1)}>
                Start Over
              </Button>
              <Button onClick={() => router.push("/brand/discover")} className="btn-gradient">
                Browse All Creators
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SmartMatch;
