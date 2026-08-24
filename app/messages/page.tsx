"use client";

import { Suspense } from "react";
import Messages from "@/pages/Messages";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Suspense>
        <Messages />
      </Suspense>
    </ProtectedRoute>
  );
}
