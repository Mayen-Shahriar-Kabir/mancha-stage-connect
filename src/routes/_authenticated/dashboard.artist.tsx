import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/_authenticated/dashboard/artist")({
  head: () => ({ meta: [{ title: "Artist Dashboard — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ArtistDashboard,
});

function ArtistDashboard() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.primary_role !== "theatre_artist") {
    return <Navigate to={dashboardPathForRole(profile.primary_role)} replace />;
  }
  return (
    <DashboardShell
      role="theatre_artist"
      eyebrow="Theatre Artist"
      title="Your craft, on Bangladesh's biggest stage"
      tagline="Build your portfolio, discover auditions, and connect with groups seeking your talent."
      accent="Coming soon: portfolio, audition feed, availability calendar, and messages from groups."
    />
  );
}
