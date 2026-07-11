import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, dashboardPathForRole, ROLE_LABELS } from "@/hooks/use-auth";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/explore/shows", label: "Explore", match: "/explore" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const dashboardTarget = profile ? dashboardPathForRole(profile.primary_role) : "/dashboard";

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate({ to: "/login", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground shadow-gold"
          >
            <span className="font-display text-lg leading-none">M</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl text-foreground">Mancha</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Digital Theatre
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const matchPath = "match" in item ? item.match : item.to;
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(matchPath);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`story-link text-sm font-medium transition-colors ${
                  active ? "text-brand" : "text-foreground/80 hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {session && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/10 text-brand">
                    <User className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium">
                    {profile.full_name?.split(" ")[0] ?? "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="truncate text-sm">{profile.full_name ?? profile.email}</div>
                  <div className="truncate text-xs font-normal text-muted-foreground">
                    {ROLE_LABELS[profile.primary_role]}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={dashboardTarget}>Go to dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-brand text-brand-foreground shadow-soft hover:bg-brand/90"
              >
                <Link to="/register">Join Mancha</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden animate-fade-in">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-3">
              {session && profile ? (
                <>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to={dashboardTarget} onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    <Link to="/register" onClick={() => setOpen(false)}>
                      Join Mancha
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
