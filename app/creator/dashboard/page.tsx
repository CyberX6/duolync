"use client";

import CreatorDashboard from "@/pages/creator/CreatorDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="creator">
      <CreatorDashboard />
    </ProtectedRoute>
  );
}
