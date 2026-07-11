import { Link } from "@tanstack/react-router";
import { Bookmark, Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import type { Show } from "@/data/explore";
import { Button } from "@/components/ui/button";
import { ShowStatusBadge } from "./Badges";
import { formatBDT, formatDate, formatDuration } from "@/lib/format";
import { useBookmarks } from "@/hooks/use-bookmarks";

export function ShowCard({ show, index = 0 }: { show: Show; index?: number }) {
  const { has, toggle } = useBookmarks("show");
  const bookmarked = has(show.slug);
  return (
    <article
      className="hover-lift group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
      style={{ animation: `fade-in 0.5s ease-out ${Math.min(index, 8) * 50}ms both` }}
    >
      <Link to="/explore/shows/$slug" params={{ slug: show.slug }} className="relative block aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={show.poster}
          alt={`${show.title} poster`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute left-3 top-3">
          <ShowStatusBadge status={show.status} />
        </div>
        <button
          type="button"
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          aria-pressed={bookmarked}
          onClick={(e) => {
            e.preventDefault();
            toggle(show.slug);
          }}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${
            bookmarked
              ? "bg-gold text-gold-foreground shadow-gold"
              : "bg-black/40 text-ivory hover:bg-black/60"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
        </button>
        <div className="absolute inset-x-4 bottom-3 text-ivory">
          <p className="text-[10px] uppercase tracking-widest text-ivory/70">{show.groupName}</p>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-brand">{show.genre}</span>
          <span className="font-medium text-foreground">{formatBDT(show.price)}</span>
        </div>
        <h3 className="font-display text-xl leading-tight text-foreground">{show.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{show.description}</p>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-brand/70" />
            <span className="truncate">{formatDate(show.date)}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand/70" />
            <span className="truncate">
              {show.venue} · {show.city}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0 text-brand/70" />
            <span>{formatDuration(show.durationMinutes)}</span>
          </li>
        </ul>
        <Button
          asChild
          size="sm"
          className="mt-2 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
        >
          <Link to="/explore/shows/$slug" params={{ slug: show.slug }}>
            View Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
