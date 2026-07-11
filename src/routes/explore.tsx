import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ExploreTabs } from "@/components/explore/ExploreTabs";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Mancha" },
      {
        name: "description",
        content:
          "Discover shows, artists and theatre groups across Bangladesh on Mancha — one stage for the country's living theatre.",
      },
      { property: "og:title", content: "Explore — Mancha" },
      {
        property: "og:description",
        content: "Shows, artists and theatre groups across Bangladesh.",
      },
    ],
  }),
  component: ExploreLayout,
});

function ExploreLayout() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Discover"
        title="Explore Mancha"
        description="Every production, every performer, every troupe — the country's theatre in one place."
      />
      <ExploreTabs />
      <Outlet />
    </PublicLayout>
  );
}
