import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/group")({
  head: () => ({
    meta: [
      { title: "Group Studio — Mancha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GroupRoot,
});

function GroupRoot() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.primary_role !== "theatre_group" && profile.primary_role !== "admin") {
    return <Navigate to={dashboardPathForRole(profile.primary_role)} replace />;
  }
  return <Outlet />;
}
