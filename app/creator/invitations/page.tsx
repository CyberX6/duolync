"use client";

import MyInvitations from "@/pages/creator/MyInvitations";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="creator">
      <MyInvitations />
    </ProtectedRoute>
  );
}
