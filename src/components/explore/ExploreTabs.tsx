import { Link, useRouterState } from "@tanstack/react-router";
import { Film, UsersRound, Users2 } from "lucide-react";

const TABS = [
  { to: "/explore/shows", label: "Shows", icon: Film },
  { to: "/explore/artists", label: "Artists", icon: Users2 },
  { to: "/explore/groups", label: "Theatre Groups", icon: UsersRound },
] as const;

export function ExploreTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-page">
        <nav className="flex gap-1 overflow-x-auto py-1" aria-label="Explore sections">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.to);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  active ? "text-brand" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand animate-fade-in"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
