"use client";

import { use } from "react";
import CreatorCampaignDetail from "@/_pages/creator/CampaignDetail";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  return (
    <ProtectedRoute requiredType="creator">
      <CreatorCampaignDetail />
    </ProtectedRoute>
  );
}
