"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  useSession,
  signIn as baSignIn,
  signOut as baSignOut,
  signUp as baSignUp,
} from "@/lib/auth-client";
import {
  getMyProfileAction,
  updateProfileAction,
  type FullProfile,
} from "@/app/actions/profile";

// ── Public profile type (snake_case to match existing callers) ─────────────
export interface Profile {
  id: string;
  user_id: string;
  user_type: "brand" | "creator";
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  brand_account_type: "company" | "personal" | null;
  company_name: string | null;
  industry: string | null;
  website: string | null;
  niche: string | null;
  primary_platform:
    | "youtube"
    | "tiktok"
    | "instagram"
    | "twitter"
    | "twitch"
    | "linkedin"
    | null;
  location: string | null;
  languages: string[];
  total_followers: number;
  avg_engagement_rate: number;
  /** Sourced from DB — reliable flag for onboarding gate checks. */
  hasCompletedOnboarding: boolean;
}

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userType: "brand" | "creator",
    fullName: string,
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithProvider: (
    provider: "google" | "facebook",
    callbackURL?: string,
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Map FullProfile (DB) → Profile (public API) ────────────────────────────
function toProfile(fp: FullProfile): Profile {
  return {
    id: fp.id,
    user_id: fp.user_id,
    user_type: fp.user_type,
    email: fp.email,
    full_name: fp.full_name,
    avatar_url: fp.avatar_url,
    bio: fp.bio,
    brand_account_type: fp.brand_account_type,
    company_name: fp.company_name,
    industry: fp.industry,
    website: fp.website,
    niche: fp.niche,
    primary_platform: fp.primary_platform,
    location: fp.location,
    languages: fp.languages,
    total_followers: fp.total_followers,
    avg_engagement_rate: fp.avg_engagement_rate,
    hasCompletedOnboarding: fp.hasCompletedOnboarding,
  };
}

// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const sessionUser = session?.user ?? null;

  const user: AuthUser | null = sessionUser
    ? {
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name ?? null,
        image: sessionUser.image ?? null,
      }
    : null;

  // ── DB-sourced extended profile ─────────────────────────────────────────
  const [dbProfile, setDbProfile] = useState<FullProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!sessionUser?.id) {
      setDbProfile(null);
      return;
    }
    setProfileLoading(true);
    getMyProfileAction()
      .then((p) => setDbProfile(p))
      .finally(() => setProfileLoading(false));
  }, [sessionUser?.id]);

  const profile: Profile | null = dbProfile ? toProfile(dbProfile) : null;

  // True while we're still waiting for either the session cookie OR the DB fetch.
  const loading = isPending || profileLoading;

  // ── Auth handlers ──────────────────────────────────────────────────────
  const handleSignUp = async (
    email: string,
    password: string,
    userType: "brand" | "creator",
    fullName: string,
  ): Promise<{ error: Error | null }> => {
    const result = await baSignUp.email({
      email,
      password,
      name: fullName,
      role: userType,
    } as Parameters<typeof baSignUp.email>[0]);
    return { error: result.error ? new Error(result.error.message) : null };
  };

  const handleSignIn = async (
    email: string,
    password: string,
  ): Promise<{ error: Error | null }> => {
    const result = await baSignIn.email({ email, password });
    return { error: result.error ? new Error(result.error.message) : null };
  };

  const handleSignInWithProvider = async (
    provider: "google" | "facebook",
    callbackURL?: string,
  ): Promise<{ error: Error | null }> => {
    const result = await baSignIn.social({
      provider,
      callbackURL:
        callbackURL ?? process.env.NEXT_PUBLIC_APP_URL + "/onboarding",
    });
    return { error: result.error ? new Error(result.error.message) : null };
  };

  const handleSignOut = async () => {
    await baSignOut();
    setDbProfile(null);
  };

  // ── Profile mutations ─────────────────────────────────────────────────
  const refreshProfile = async () => {
    if (!sessionUser?.id) return;
    const fresh = await getMyProfileAction();
    setDbProfile(fresh);
  };

  const updateProfile = async (
    updates: Partial<Profile>,
  ): Promise<{ error: Error | null }> => {
    const result = await updateProfileAction({
      bio: updates.bio,
      niche: updates.niche,
      primaryPlatform: updates.primary_platform,
      location: updates.location,
      companyName: updates.company_name,
      industry: updates.industry,
      website: updates.website,
      brandAccountType: updates.brand_account_type,
    });

    if (result.error) return { error: new Error(result.error) };
    await refreshProfile();
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signInWithProvider: handleSignInWithProvider,
        signOut: handleSignOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
