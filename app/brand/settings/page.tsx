"use client";

import BrandSettings from "@/pages/brand/BrandSettings";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="brand">
      <BrandSettings />
    </ProtectedRoute>
  );
}
