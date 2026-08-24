"use client";

import CreatorAnalytics from "@/pages/creator/CreatorAnalytics";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="creator">
      <CreatorAnalytics />
    </ProtectedRoute>
  );
}
