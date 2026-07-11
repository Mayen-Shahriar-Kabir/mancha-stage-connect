import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/_authenticated/dashboard/group")({
  head: () => ({ meta: [{ title: "Group Dashboard — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: GroupDashboard,
});

function GroupDashboard() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.primary_role !== "theatre_group") {
    return <Navigate to={dashboardPathForRole(profile.primary_role)} replace />;
  }
  return (
    <DashboardShell
      role="theatre_group"
      eyebrow="Theatre Group"
      title="Your company's stage awaits"
      tagline="Manage productions, coordinate your ensemble, and reach new audiences across the Mancha network."
      accent="Coming soon: show management, casting, ticketing, tour coordination, and audience analytics."
    />
  );
}
