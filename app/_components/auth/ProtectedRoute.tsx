import { useAuth } from "@/hooks/useAuth";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredType?: "brand" | "creator";
}

const RedirectTo = ({ path }: { path: string }) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(path);
  }, [path, router]);

  return null;
};

const ProtectedRoute = ({ children, requiredType }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <RedirectTo path="/auth" />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Check if onboarding is complete
  const isBrand = profile.user_type === "brand";
  const onboardingComplete = isBrand ? !!profile.industry : !!profile.niche;

  if (!onboardingComplete) {
    return <RedirectTo path="/onboarding" />;
  }

  // Check user type if required
  if (requiredType && profile.user_type !== requiredType) {
    return <RedirectTo path={profile.user_type === "brand" ? "/brand/dashboard" : "/creator/dashboard"} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
