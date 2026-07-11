import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shows", label: "Shows" },
  { to: "/artists", label: "Artists" },
  { to: "/groups", label: "Groups" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
            const active = pathname === item.to;
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
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full bg-brand text-brand-foreground shadow-soft hover:bg-brand/90">
            <Link to="/register">Join Mancha</Link>
          </Button>
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
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>
              </Button>
              <Button asChild className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                <Link to="/register" onClick={() => setOpen(false)}>Join Mancha</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
