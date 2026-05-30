"use client";

import CreatorDiscover from "@/pages/creator/Discover";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="creator">
      <CreatorDiscover />
    </ProtectedRoute>
  );
}
