"use client";

import PresencePage from "@/pages/creator/PresencePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="creator">
      <PresencePage />
    </ProtectedRoute>
  );
}
