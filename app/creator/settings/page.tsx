"use client";

import CreatorSettings from "@/pages/creator/CreatorSettings";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="creator">
      <CreatorSettings />
    </ProtectedRoute>
  );
}
