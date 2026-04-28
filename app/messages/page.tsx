"use client";

import Messages from "@/pages/Messages";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Messages />
    </ProtectedRoute>
  );
}
