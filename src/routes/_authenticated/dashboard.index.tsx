import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: DashboardIndex,
});

function DashboardIndex() {
  const { profile } = useAuth();
  if (!profile) return null;
  return <Navigate to={dashboardPathForRole(profile.primary_role)} replace />;
}
