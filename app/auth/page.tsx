"use client";

import { Suspense } from "react";
import Auth from "@/pages/Auth";

export default function Page() {
  return (
    <Suspense>
      <Auth />
    </Suspense>
  );
}
