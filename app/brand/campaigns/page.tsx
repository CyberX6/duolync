"use client";

import Campaigns from "@/pages/brand/Campaigns";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="brand">
      <Campaigns />
    </ProtectedRoute>
  );
}
