"use client";

import MyApplications from "@/pages/creator/MyApplications";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="creator">
      <MyApplications />
    </ProtectedRoute>
  );
}
