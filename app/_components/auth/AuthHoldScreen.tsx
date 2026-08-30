"use client";

/**
 * Stable first-paint shell used during SSR and the first client render.
 * Must stay hook-free so it can replace the auth/provider tree without
 * changing hook order between server HTML and hydration.
 */
export function AuthHoldScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#07080f" }}
    >
      <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
    </div>
  );
}
