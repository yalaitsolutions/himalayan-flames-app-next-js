import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";

// Server-side guard (defence in depth — the middleware also protects this route).
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  if (session.user.role !== "admin") redirect("/");

  return <DashboardClient user={session.user.name || session.user.email} />;
}
