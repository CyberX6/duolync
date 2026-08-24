"use client";

import { use } from "react";
import ProfileView from "@/pages/ProfileView";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  return <ProfileView />;
}
