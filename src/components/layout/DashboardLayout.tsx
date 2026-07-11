import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Calendar, Users2, Ticket, Settings } from "lucide-react";

/**
 * Placeholder Dashboard shell. Wire real navigation & auth in a future phase.
 */
export function DashboardLayout({ children }: { children: ReactNode }) {
  const items = [
    { to: "/", label: "Overview", icon: LayoutDashboard },
    { to: "/", label: "Shows", icon: Calendar },
    { to: "/", label: "Team", icon: Users2 },
    { to: "/", label: "Tickets", icon: Ticket },
    { to: "/", label: "Settings", icon: Settings },
  ];
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar p-5 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-brand-foreground">
            <span className="font-display leading-none">M</span>
          </span>
          <span className="font-display text-lg">Mancha</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {items.map((it) => (
            <button
              key={it.label}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
          <h1 className="font-display text-lg">Dashboard</h1>
          <div className="h-9 w-9 rounded-full bg-muted" aria-label="Profile" />
        </header>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
