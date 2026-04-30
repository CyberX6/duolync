import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, User, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type UserType = "brand" | "creator" | null;
type AuthMode = "select" | "login" | "signup";

const Auth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialType = searchParams?.get("type") as UserType;
  const initialMode = searchParams?.get("mode") as AuthMode | null;

  const [userType, setUserType] = useState<UserType>(initialType);
  const [mode, setMode] = useState<AuthMode>(
    initialMode === "login" ? "login" : initialType ? "signup" : "select"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, profile, signUp, signIn, signInWithProvider } = useAuth();
  const { toast } = useToast();
  const oauthCallbackURL = "http://localhost:3000/feed";

  // Redirect if already logged in
  useEffect(() => {
    if (user && profile) {
      router.replace(profile.user_type === "brand" ? "/brand/dashboard" : "/creator/dashboard");
    }
  }, [user, profile, router]);

  if (user && profile) return null;

  const handleSelectType = (type: UserType) => {
    setUserType(type);
    setMode("signup");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (!userType) {
          toast({ title: "Please select account type", variant: "destructive" });
          return;
        }
        const { error } = await signUp(email, password, userType, fullName);
        if (error) throw error;
        toast({ title: "Account created successfully!", description: "Welcome to Nexly!" });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: "Welcome back!" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (mode === "login") {
      setMode("select");
    } else if (mode === "signup") {
      setMode("select");
      setUserType(null);
    }
  };

  const handleSocialAuth = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    const { error } = await signInWithProvider(provider, oauthCallbackURL);
    if (error) {
      toast({
        title: "OAuth error",
        description: error.message || `Unable to continue with ${provider}`,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const SocialButtons = () => (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full h-12"
        onClick={() => handleSocialAuth("google")}
        disabled={isLoading}
      >
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full h-12"
        onClick={() => handleSocialAuth("facebook")}
        disabled={isLoading}
      >
        Continue with Facebook
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen gradient-hero flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">Nexly</span>
          </a>
        </div>

        <div className="relative z-10 text-white">
          <h1 className="font-display text-4xl xl:text-5xl font-bold mb-6">
            {userType === "brand" 
              ? "Find Your Perfect Creator Match"
              : userType === "creator"
              ? "Turn Your Influence Into Income"
              : "Connect. Collaborate. Grow."}
          </h1>
          <p className="text-white/80 text-lg xl:text-xl">
            {userType === "brand"
              ? "Access 50,000+ verified creators across TikTok, YouTube, Instagram and more."
              : userType === "creator"
              ? "Join thousands of creators who've found their dream brand partnerships."
              : "The leading marketplace connecting brands with authentic content creators."}
          </p>
        </div>

        <div className="relative z-10 flex gap-8 text-white/60 text-sm">
          <div>
            <div className="text-3xl font-display font-bold text-white">50K+</div>
            <div>Creators</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-white">10K+</div>
            <div>Brands</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-white">1M+</div>
            <div>Collaborations</div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="font-display font-bold text-2xl">Nexly</span>
            </a>
          </div>

          {/* User Type Selection */}
          {mode === "select" && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="font-display text-3xl font-bold mb-2">Join Nexly</h2>
                <p className="text-muted-foreground">Choose how you want to use Nexly</p>
              </div>

              <div className="grid gap-4 mb-8">
                <button
                  onClick={() => handleSelectType("brand")}
                  className="card-interactive p-6 text-left flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg mb-1">I'm a Brand</h3>
                    <p className="text-sm text-muted-foreground">Find and collaborate with influencers</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>

                <button
                  onClick={() => handleSelectType("creator")}
                  className="card-interactive p-6 text-left flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <User className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg mb-1">I'm a Creator</h3>
                    <p className="text-sm text-muted-foreground">Get discovered by top brands</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </button>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-primary font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </p>
                <div className="my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">or continue with</span>
                    </div>
                  </div>
                </div>
                <SocialButtons />
              </div>
            </div>
          )}

          {/* Login / Signup Form */}
          {(mode === "login" || mode === "signup") && (
            <div className="animate-fade-in">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="mb-8">
                <h2 className="font-display text-3xl font-bold mb-2">
                  {mode === "signup" ? "Create your account" : "Welcome back"}
                </h2>
                <p className="text-muted-foreground">
                  {mode === "signup" 
                    ? `Sign up as a ${userType === "brand" ? "Brand" : "Creator"}`
                    : "Log in to your Nexly account"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 btn-gradient text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : mode === "signup" ? "Create Account" : "Log In"}
                </Button>
              </form>

              <div className="my-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or continue with</span>
                  </div>
                </div>
              </div>

              <SocialButtons />

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {mode === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setMode("login")}
                        className="text-primary font-semibold hover:underline"
                      >
                        Log in
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => setMode("select")}
                        className="text-primary font-semibold hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
