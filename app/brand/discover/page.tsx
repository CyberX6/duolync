"use client";

import Discover from "@/pages/brand/Discover";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="brand">
      <Discover />
    </ProtectedRoute>
  );
}
