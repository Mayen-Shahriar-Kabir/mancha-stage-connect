import { Link } from "@tanstack/react-router";

const COLS = [
  {
    title: "Explore",
    links: [
      { to: "/explore/shows", label: "Shows" },
      { to: "/explore/artists", label: "Artists" },
      { to: "/explore/groups", label: "Theatre Groups" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Sign in" },
      { to: "/register", label: "Join Mancha" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-[oklch(0.96_0.012_70)]">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-foreground">
                <span className="font-display text-lg leading-none">M</span>
              </span>
              <span className="font-display text-2xl">Mancha</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Bangladesh's digital theatre ecosystem. Connecting artists, groups, and audiences
              — one stage at a time.
            </p>
            <p className="mt-6 font-display text-sm italic text-brand">
              "Where Every Stage Finds Its Audience."
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Mancha. Crafted in Dhaka.</p>
          <p className="tracking-wide">Bangladesh's Digital Theatre Ecosystem</p>
        </div>
      </div>
    </footer>
  );
}
