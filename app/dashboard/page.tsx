import { auth } from "@/lib/auth";
import { fromPrismaRole } from "@/lib/roles";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  type Session = Awaited<ReturnType<typeof auth.api.getSession>>;
  let session: Session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (err) {
    console.error("[DashboardPage] getSession failed:", err);
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
