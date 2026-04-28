"use client";

import SavedProfiles from "@/pages/SavedProfiles";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="creator">
      <SavedProfiles />
    </ProtectedRoute>
  );
}
