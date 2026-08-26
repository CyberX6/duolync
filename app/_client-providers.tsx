"use client";

import { Providers } from "./_providers";
import type { ReactNode } from "react";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
