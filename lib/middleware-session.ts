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
  // On Railway (and similar PaaS), the public origin is HTTPS but the container
  // serves plain HTTP. Fetching the public URL inside the same container hits the
  // raw HTTP server with an SSL handshake → ERR_SSL_WRONG_VERSION_NUMBER.
  // Using localhost:PORT bypasses the TLS proxy entirely and avoids the mismatch.
  const selfOrigin = process.env.PORT
    ? `http://localhost:${process.env.PORT}`
    : request.nextUrl.origin;
  const url = new URL("/api/auth/get-session", selfOrigin);

  if (options?.disableCookieCache) {
    url.searchParams.set("disableCookieCache", "true");
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });
  } catch {
    // Internal fetch failed (e.g. ECONNREFUSED during cold start or TLS mismatch).
    // Treat as unauthenticated so middleware can redirect to sign-in gracefully.
    return null;
  }

  if (!response.ok) return null;

  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("user" in data)) {
    return null;
  }

  const session = data as MiddlewareSession;
  return session.user ? session : null;
}
