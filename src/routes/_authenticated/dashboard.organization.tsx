import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/organization")({
  head: () => ({
    meta: [
      { title: "Organization Dashboard — Mancha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrgRoot,
});

function OrgRoot() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.primary_role !== "organization") {
    return <Navigate to={dashboardPathForRole(profile.primary_role)} replace />;
  }
  return <Outlet />;
}
