import { NextRequest, NextResponse } from "next/server";
import { getMiddlewareSession } from "@/lib/middleware-session";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/analytics",
  "/campaigns",
  "/messages",
  "/brand/dashboard",
  "/creator/dashboard",
] as const;

const SIGN_IN_PATH = "/sign-in";
const ONBOARDING_PATH = "/onboarding";
const DASHBOARD_PATH = "/dashboard";

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = isProtectedPath(pathname);
  const isOnboardingRoute = pathname === ONBOARDING_PATH;

  if (!isProtected && !isOnboardingRoute) {
    return NextResponse.next();
  }

  // Bypass cookie cache so onboarding completion is reflected immediately.
  const session = await getMiddlewareSession(request, {
    disableCookieCache: true,
  });

  // (a) Unauthenticated → sign-in
  if (!session?.user) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = SIGN_IN_PATH;
    signInUrl.searchParams.set(
      "callbackUrl",
      `${pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(signInUrl);
  }

  const onboardingComplete = Boolean(session.user.hasCompletedOnboarding);

  // (c) Onboarded user visiting /onboarding → dashboard
  if (isOnboardingRoute && onboardingComplete) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = DASHBOARD_PATH;
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  // (b) Authenticated but not onboarded → /onboarding (unless already there)
  if (isProtected && !onboardingComplete) {
    const onboardingUrl = request.nextUrl.clone();
    onboardingUrl.pathname = ONBOARDING_PATH;
    onboardingUrl.search = "";
    return NextResponse.redirect(onboardingUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/campaigns/:path*",
    "/messages/:path*",
    "/brand/dashboard/:path*",
    "/creator/dashboard/:path*",
    "/onboarding",
  ],
};
