import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/_authenticated/dashboard/organization")({
  head: () => ({ meta: [{ title: "Organization Dashboard — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: OrganizationDashboard,
});

function OrganizationDashboard() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.primary_role !== "organization") {
    return <Navigate to={dashboardPathForRole(profile.primary_role)} replace />;
  }
  return (
    <DashboardShell
      role="organization"
      eyebrow="Organization"
      title="Partner with Bangladesh's theatre ecosystem"
      tagline="Sponsor productions, host events, discover talent, and connect your organization to the arts."
      accent="Coming soon: sponsorships, campus/venue programming, tourism experiences, and OTT partnerships."
    />
  );
}
