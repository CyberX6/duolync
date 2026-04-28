import { createContext, useContext, ReactNode } from 'react';
import { useSession, signIn as baSignIn, signOut as baSignOut, signUp as baSignUp } from '@/lib/auth-client';

interface Profile {
  id: string;
  user_id: string;
  user_type: 'brand' | 'creator';
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  brand_account_type: 'company' | 'personal' | null;
  company_name: string | null;
  industry: string | null;
  website: string | null;
  niche: string | null;
  primary_platform: 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'twitch' | 'linkedin' | null;
  location: string | null;
  languages: string[];
  total_followers: number;
  avg_engagement_rate: number;
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
  signUp: (email: string, password: string, userType: 'brand' | 'creator', fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const profile: Profile | null = sessionUser
    ? {
        id: sessionUser.id,
        user_id: sessionUser.id,
        user_type: ((sessionUser as { role?: string }).role === 'brand' ? 'brand' : 'creator') as 'brand' | 'creator',
        email: sessionUser.email,
        full_name: sessionUser.name ?? null,
        avatar_url: sessionUser.image ?? null,
        bio: null,
        brand_account_type: null,
        company_name: null,
        industry: null,
        website: null,
        niche: null,
        primary_platform: null,
        location: null,
        languages: [],
        total_followers: 0,
        avg_engagement_rate: 0,
      }
    : null;

  const handleSignUp = async (
    email: string,
    password: string,
    userType: 'brand' | 'creator',
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

  const handleSignIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const result = await baSignIn.email({ email, password });
    return { error: result.error ? new Error(result.error.message) : null };
  };

  const handleSignOut = async () => {
    await baSignOut();
  };

  // Stubs — profile mutations will be implemented via server actions
  const updateProfile = async (_updates: Partial<Profile>): Promise<{ error: Error | null }> => {
    return { error: null };
  };

  const refreshProfile = async () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading: isPending,
        signUp: handleSignUp,
        signIn: handleSignIn,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
