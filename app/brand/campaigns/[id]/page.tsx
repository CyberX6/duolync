"use client";

import { use } from "react";
import CampaignDetail from "@/_pages/brand/CampaignDetail";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  return (
    <ProtectedRoute requiredType="brand">
      <CampaignDetail />
    </ProtectedRoute>
  );
}
