"use client";

import MainLayout from "@/components/layout/MainLayout";
import { SmartCalendarWidget } from "@/components/calendar/SmartCalendarWidget";
import { CreatorCalendarHub } from "@/components/calendar/CreatorCalendarHub";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function CalendarPage() {
  const { profile } = useAuth();
  const isBrand = profile?.user_type === "brand";

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
            {isBrand ? "Campaign Calendar" : "Creator OS"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isBrand
              ? "Plan and track your campaign schedule across all platforms."
              : "Your content command center — plan, pipeline, and publish across every platform."}
          </p>
        </div>
        {isBrand ? (
          <SmartCalendarWidget isBrand canEdit />
        ) : (
          <CreatorCalendarHub />
        )}
      </div>
    </MainLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <CalendarPage />
    </ProtectedRoute>
  );
}
