"use client";

import Community from "@/pages/Community";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Community />
    </ProtectedRoute>
  );
}
