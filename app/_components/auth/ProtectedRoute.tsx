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

  const userType = profile?.user_type;

  // Role-based route guard: wrong type → send to own dashboard
  if (requiredType && userType && userType !== requiredType) {
    return (
      <RedirectTo
        path={
          userType === "brand"
            ? "/brand/dashboard"
            : "/creator/dashboard"
        }
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
