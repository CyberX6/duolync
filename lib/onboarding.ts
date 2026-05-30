const ONBOARDING_KEY = (userId: string) => `duolync_onboarded_${userId}`;

export function markOnboardingComplete(userId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ONBOARDING_KEY(userId), 'true');
  }
}

export function hasCompletedOnboarding(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ONBOARDING_KEY(userId)) === 'true';
}
