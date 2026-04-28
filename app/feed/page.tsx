"use client";

import Feed from "@/pages/Feed";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Feed />
    </ProtectedRoute>
  );
}
