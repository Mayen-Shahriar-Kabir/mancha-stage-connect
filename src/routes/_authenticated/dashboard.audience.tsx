import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/_authenticated/dashboard/audience")({
  head: () => ({ meta: [{ title: "Audience Dashboard — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: AudienceDashboard,
});

function AudienceDashboard() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.primary_role !== "audience") {
    return <Navigate to={dashboardPathForRole(profile.primary_role)} replace />;
  }
  return (
    <DashboardShell
      role="audience"
      eyebrow="Audience"
      title="Where would you like the curtain to rise?"
      tagline="Discover shows, follow your favorite groups and artists, and never miss an opening night."
      accent="Coming soon: personalized recommendations, ticket bookings, watchlist, and reviews."
    />
  );
}
