import { auth } from "@/lib/auth";
import { fromPrismaRole } from "@/lib/roles";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  let session;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (err) {
    console.error("[DashboardPage] getSession failed:", err);
    redirect("/sign-in");
  }

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (!session.user.hasCompletedOnboarding) {
    redirect("/onboarding");
  }

  const role = fromPrismaRole(session.user.role);
  redirect(role === "brand" ? "/brand/dashboard" : "/creator/dashboard");
}
