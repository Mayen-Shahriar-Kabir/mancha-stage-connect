import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — Mancha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminRoot,
});

function AdminRoot() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.primary_role !== "admin") {
    return <Navigate to={dashboardPathForRole(profile.primary_role)} replace />;
  }
  return <Outlet />;
}
