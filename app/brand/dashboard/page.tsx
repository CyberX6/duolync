"use client";

import BrandDashboard from "@/pages/brand/BrandDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="brand">
      <BrandDashboard />
    </ProtectedRoute>
  );
}
