import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/_authenticated/dashboard/admin")({
  head: () => ({ meta: [{ title: "Admin — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.primary_role !== "admin") {
    return <Navigate to={dashboardPathForRole(profile.primary_role)} replace />;
  }
  return (
    <DashboardShell
      role="admin"
      eyebrow="Administrator"
      title="Welcome, Curator of the Ecosystem"
      tagline="Approve new registrations, oversee groups and artists, and steward Mancha's programming across Bangladesh."
      accent="Coming in the next phase: user approvals, role management, content moderation, and platform-wide analytics."
    />
  );
}
