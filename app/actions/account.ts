"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export type DeleteAccountResult =
  | { success: true; error: null }
  | { success: false; error: string };

/**
 * Permanently deletes the authenticated user and all cascaded relations
 * (profiles, sessions, accounts, tokens, messages, etc.).
 */
export async function deleteAccount(): Promise<DeleteAccountResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    await db.user.delete({ where: { id: userId } });

    // Session row is cascade-deleted; clear the auth cookie on the client response.
    try {
      await auth.api.signOut({ headers: await headers() });
    } catch {
      // Cookie cleanup is best-effort after the user record is gone.
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("[deleteAccount]", err);
    return { success: false, error: "Failed to delete account" };
  }
}
