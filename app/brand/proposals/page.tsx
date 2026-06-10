"use client";

import Proposals from "@/pages/brand/Proposals";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="brand">
      <Proposals />
    </ProtectedRoute>
  );
}
