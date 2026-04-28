"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// Load providers client-only so Supabase's localStorage usage doesn't run on the server
const Providers = dynamic(
  () => import("./_providers").then((m) => m.Providers),
  { ssr: false }
);

export function ClientProviders({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
