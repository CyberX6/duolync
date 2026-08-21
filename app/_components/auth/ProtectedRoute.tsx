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

  // Not authenticated → send to sign-in with callbackUrl preserved
  if (!user) return <RedirectTo path="/sign-in" />;

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

  // Onboarding gate: redirect new users to /onboarding until they complete their profile
  if (!profile.hasCompletedOnboarding) return <RedirectTo path="/onboarding" />;

  return <>{children}</>;
};

export default ProtectedRoute;
