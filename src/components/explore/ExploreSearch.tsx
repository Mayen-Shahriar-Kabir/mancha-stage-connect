import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, Film, Users2, UsersRound } from "lucide-react";
import { SHOWS, ARTISTS, GROUPS } from "@/data/explore";

interface Hit {
  kind: "show" | "artist" | "group";
  slug: string;
  title: string;
  subtitle: string;
  href: string;
}

export function ExploreSearch({
  onSelect,
  placeholder = "Search shows, artists, groups…",
  compact = false,
}: {
  onSelect?: () => void;
  placeholder?: string;
  compact?: boolean;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);

  const hits: Hit[] = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const showHits: Hit[] = SHOWS.filter(
      (x) => x.title.toLowerCase().includes(s) || x.genre.toLowerCase().includes(s),
    )
      .slice(0, 4)
      .map((x) => ({
        kind: "show",
        slug: x.slug,
        title: x.title,
        subtitle: `${x.genre} · ${x.groupName}`,
        href: `/explore/shows/${x.slug}`,
      }));
    const artistHits: Hit[] = ARTISTS.filter(
      (x) =>
        x.name.toLowerCase().includes(s) ||
        x.stageName.toLowerCase().includes(s) ||
        x.specialization.toLowerCase().includes(s),
    )
      .slice(0, 4)
      .map((x) => ({
        kind: "artist",
        slug: x.slug,
        title: x.name,
        subtitle: x.specialization,
        href: `/explore/artists/${x.slug}`,
      }));
    const groupHits: Hit[] = GROUPS.filter(
      (x) => x.name.toLowerCase().includes(s) || x.city.toLowerCase().includes(s),
    )
      .slice(0, 3)
      .map((x) => ({
        kind: "group",
        slug: x.slug,
        title: x.name,
        subtitle: x.city,
        href: `/explore/groups/${x.slug}`,
      }));
    return [...showHits, ...artistHits, ...groupHits];
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (h: Hit) => {
    setOpen(false);
    setQ("");
    onSelect?.();
    navigate({ to: h.href });
  };

  const iconFor = (k: Hit["kind"]) =>
    k === "show" ? Film : k === "artist" ? Users2 : UsersRound;

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((v) => Math.min(v + 1, hits.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((v) => Math.max(v - 1, 0));
            } else if (e.key === "Enter" && hits[active]) {
              e.preventDefault();
              go(hits[active]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          aria-label="Search"
          className={`w-full rounded-full border border-border bg-card pl-10 pr-10 text-sm text-foreground shadow-soft outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 ${
            compact ? "h-10" : "h-12"
          }`}
        />
        {q && (
          <button
            onClick={() => {
              setQ("");
              setOpen(false);
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && q.trim() && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-border bg-popover shadow-elevated animate-fade-in">
          {hits.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No matches for “{q}”.
            </div>
          ) : (
            <ul className="max-h-[70vh] overflow-y-auto py-2">
              {hits.map((h, i) => {
                const Icon = iconFor(h.kind);
                const isActive = i === active;
                return (
                  <li key={`${h.kind}-${h.slug}`}>
                    <Link
                      to={h.href}
                      onClick={() => go(h)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        isActive ? "bg-brand/5 text-foreground" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{h.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {h.subtitle}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                        {h.kind}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
