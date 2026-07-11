import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Shield, Users, Building2, BarChart3, FileText } from "lucide-react";

/** Placeholder Admin shell. Real controls arrive in a future phase. */
export function AdminLayout({ children }: { children: ReactNode }) {
  const items = [
    { label: "Overview", icon: BarChart3 },
    { label: "Users", icon: Users },
    { label: "Organizations", icon: Building2 },
    { label: "Reports", icon: FileText },
    { label: "Moderation", icon: Shield },
  ];
  return (
    <div className="flex min-h-screen bg-[oklch(0.16_0.01_30)] text-[oklch(0.96_0.01_70)]">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 p-5 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-gold-foreground">
            <span className="font-display leading-none">M</span>
          </span>
          <span className="font-display text-lg">Mancha Admin</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {items.map((it) => (
            <button
              key={it.label}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <h1 className="font-display text-lg">Admin Console</h1>
          <span className="rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">Restricted</span>
        </header>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
