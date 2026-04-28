"use client";

import SocialAccounts from "@/pages/creator/SocialAccounts";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredType="creator">
      <SocialAccounts />
    </ProtectedRoute>
  );
}
