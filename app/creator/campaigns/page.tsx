"use client";

import CreatorCampaigns from "@/pages/creator/CreatorCampaigns";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="creator">
      <CreatorCampaigns />
    </ProtectedRoute>
  );
}
