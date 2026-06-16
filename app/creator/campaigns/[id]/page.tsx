"use client";

import CreatorCampaignDetail from "@/_pages/creator/CampaignDetail";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="creator">
      <CreatorCampaignDetail />
    </ProtectedRoute>
  );
}
