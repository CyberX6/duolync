"use client";

import CampaignDetail from "@/_pages/brand/CampaignDetail";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="brand">
      <CampaignDetail />
    </ProtectedRoute>
  );
}
