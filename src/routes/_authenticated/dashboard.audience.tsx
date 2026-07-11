import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/audience")({
  head: () => ({
    meta: [
      { title: "Audience Dashboard — Mancha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AudienceRoot,
});

function AudienceRoot() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.primary_role !== "audience") {
    return <Navigate to={dashboardPathForRole(profile.primary_role)} replace />;
  }
  return <Outlet />;
}
