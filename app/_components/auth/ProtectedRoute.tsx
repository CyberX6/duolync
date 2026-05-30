"use client";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Restrict to a specific user type — redirects away if role mismatch */
  requiredType?: "brand" | "creator";
}

const RedirectTo = ({ path }: { path: string }) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(path);
  }, [path, router]);

  return null;
};

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

const ProtectedRoute = ({ children, requiredType }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <Spinner />;

  // Not authenticated → send to auth page
  if (!user) return <RedirectTo path="/auth" />;

  // Session exists but profile hasn't resolved yet
  if (!profile) return <Spinner />;

  // Role-based route guard: wrong type → send to own dashboard
  if (requiredType && profile.user_type !== requiredType) {
    return (
      <RedirectTo
        path={
          profile.user_type === "brand"
            ? "/brand/dashboard"
            : "/creator/dashboard"
        }
      />
    );
  }

  // TODO (Phase 2): Once DB profile columns (niche / industry) are returned
  // by the session, re-enable the onboarding redirect:
  //
  // const onboardingComplete =
  //   profile.user_type === "brand" ? !!profile.industry : !!profile.niche;
  // if (!onboardingComplete) return <RedirectTo path="/onboarding" />;

  return <>{children}</>;
};

export default ProtectedRoute;
