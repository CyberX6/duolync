"use client";

import SmartMatch from "@/pages/brand/SmartMatch";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="brand">
      <SmartMatch />
    </ProtectedRoute>
  );
}
