import type { NextRequest } from "next/server";
import type { auth } from "@/lib/auth";

export type MiddlewareSession = typeof auth.$Infer.Session;

/**
 * Resolves the Better Auth session inside Next.js middleware via the
 * `/api/auth/get-session` endpoint (Edge-safe — no direct Prisma access).
 */
export async function getMiddlewareSession(
  request: NextRequest,
  options?: { disableCookieCache?: boolean },
): Promise<MiddlewareSession | null> {
  const url = new URL("/api/auth/get-session", request.nextUrl.origin);

  if (options?.disableCookieCache) {
    url.searchParams.set("disableCookieCache", "true");
  }

  const response = await fetch(url, {
    headers: {
      cookie: request.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("user" in data)) {
    return null;
  }

  const session = data as MiddlewareSession;
  return session.user ? session : null;
}
