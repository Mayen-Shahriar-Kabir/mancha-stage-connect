import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { GroupSidebar } from "./GroupSidebar";
import { QuickActionsFAB } from "./QuickActionsFAB";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function GroupLayout({ eyebrow, title, description, actions, children }: Props) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login", replace: true });
  };

  const groupName = profile?.organization_name ?? "Nagorik Natya Sampradaya";
  const initials = groupName.split(/\s+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <GroupSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/85 px-4 backdrop-blur md:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="hidden md:flex md:flex-1 md:items-center md:gap-2">
              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search members, productions, campaigns…"
                  className="h-9 rounded-full border-border/70 bg-muted/40 pl-9 focus-visible:bg-background"
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium leading-tight text-foreground">{groupName}</div>
                <div className="text-[11px] leading-tight text-muted-foreground">{profile?.email}</div>
              </div>
              <Avatar className="h-9 w-9 border border-border/60">
                <AvatarFallback className="bg-brand text-brand-foreground text-xs">{initials}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-full">
                <LogOut className="mr-1.5 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-10">
            <div className="mx-auto w-full max-w-[1400px] animate-fade-in">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
                    {eyebrow}
                  </p>
                  <h1 className="font-display mt-1.5 text-3xl leading-tight text-foreground md:text-4xl">
                    {title}
                  </h1>
                  {description ? (
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
                  ) : null}
                </div>
                {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
              </div>
              <div className="mt-8 space-y-6">{children}</div>

              <footer className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
                <span>© {new Date().getFullYear()} Mancha · Bangladesh's Digital Theatre Ecosystem</span>
                <Link to="/" className="hover:text-foreground">Back to public site →</Link>
              </footer>
            </div>
          </main>
        </SidebarInset>
        <QuickActionsFAB />
      </div>
    </SidebarProvider>
  );
}
