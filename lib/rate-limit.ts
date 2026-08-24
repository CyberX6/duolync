/**
 * Simple sliding-window rate limiter backed by the database.
 * No external Redis dependency required.
 *
 * Usage:
 *   const allowed = await rateLimit(userId, "send-message", 10, 60_000);
 *   if (!allowed) return { error: "Too many requests. Please slow down." };
 */
import { db } from "@/lib/db";

/**
 * @param identifier  Unique key, e.g. `${userId}:send-message`
 * @param maxRequests Max allowed requests in the window
 * @param windowMs    Window size in milliseconds
 * @returns true if the request is allowed, false if rate-limited
 */
export async function rateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number,
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs);

  const count = await db.rateLimitEvent.count({
    where: {
      identifier,
      createdAt: { gte: windowStart },
    },
  });

  if (count >= maxRequests) return false;

  await db.rateLimitEvent.create({ data: { identifier } });

  // Best-effort cleanup of old records (non-blocking)
  db.rateLimitEvent
    .deleteMany({ where: { createdAt: { lt: windowStart } } })
    .catch(() => {});

  return true;
}
