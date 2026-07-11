import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, ROLE_LABELS, ORG_TYPE_LABELS, dashboardPathForRole, type AppRole } from "@/hooks/use-auth";

interface DashboardShellProps {
  role: AppRole;
  eyebrow: string;
  title: string;
  tagline: string;
  accent?: string;
  children?: ReactNode;
}

export function DashboardShell({ role, eyebrow, title, tagline, accent, children }: DashboardShellProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card">
        <div className="container-page flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-brand-foreground shadow-gold">
              <span className="font-display text-lg leading-none">M</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl">Mancha</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {ROLE_LABELS[role]}
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium text-foreground">
                {profile?.full_name ?? profile?.email}
              </div>
              <div className="text-xs text-muted-foreground">{profile?.email}</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-full">
              <LogOut className="mr-1.5 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container-page py-12 md:py-16">
        <div className="animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
            {eyebrow}
          </p>
          <h1 className="font-display mt-3 text-4xl text-foreground md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">{tagline}</p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Role</div>
              <div className="mt-1 font-display text-lg text-foreground">{ROLE_LABELS[role]}</div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Status</div>
              <div className="mt-1 font-display text-lg capitalize text-foreground">
                {profile?.status ?? "—"}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {profile?.organization_type ? "Organization" : "Contact"}
              </div>
              <div className="mt-1 font-display text-lg text-foreground">
                {profile?.organization_name ??
                  (profile?.organization_type
                    ? ORG_TYPE_LABELS[profile.organization_type]
                    : profile?.email)}
              </div>
            </div>
          </div>

          {accent ? (
            <div className="mt-10 rounded-3xl border border-accent/30 bg-accent/5 p-6 text-sm text-muted-foreground">
              {accent}
            </div>
          ) : null}

          {children ? <div className="mt-10">{children}</div> : null}

          <div className="mt-14 rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              This dashboard is a placeholder. Business functionality will be added in the next phase.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/">Back to home</Link>
              </Button>
              <Button asChild className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                <Link to={dashboardPathForRole(role)}>Refresh dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
