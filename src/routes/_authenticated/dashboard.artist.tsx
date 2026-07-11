import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/artist")({
  head: () => ({
    meta: [
      { title: "Artist Studio — Mancha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ArtistRoot,
});

function ArtistRoot() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.primary_role !== "theatre_artist") {
    return <Navigate to={dashboardPathForRole(profile.primary_role)} replace />;
  }
  return <Outlet />;
}
