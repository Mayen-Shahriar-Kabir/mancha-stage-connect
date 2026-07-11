import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { SHOWS, SHOW_GENRES, SHOW_CITIES, type ShowStatus, type SortValue } from "@/data/explore";
import { ShowCard } from "@/components/explore/ShowCard";
import { ExploreToolbar } from "@/components/explore/ExploreToolbar";
import { FiltersPanel, FiltersSheet, FilterGroup, ChipToggle } from "@/components/explore/FiltersPanel";
import { EmptyState } from "@/components/explore/EmptyState";
import { SkeletonGrid } from "@/components/explore/SkeletonGrid";
import { Pagination } from "@/components/explore/Pagination";
import { Slider } from "@/components/ui/slider";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  sort: fallback(z.string(), "newest").default("newest"),
  genre: fallback(z.string(), "").default(""),
  city: fallback(z.string(), "").default(""),
  status: fallback(z.string(), "").default(""),
  minPrice: fallback(z.number(), 0).default(0),
  maxPrice: fallback(z.number(), 1000).default(1000),
  page: fallback(z.number().int(), 1).default(1),
});

const PAGE_SIZE = 9;
const PRICE_MAX = 1000;

export const Route = createFileRoute("/explore/shows")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Shows — Explore Mancha" },
      { name: "description", content: "Browse upcoming, live and archived theatre productions across Bangladesh." },
    ],
  }),
  component: ShowsTab,
});

function ShowsTab() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/explore/shows" });
  const [sheet, setSheet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [search.genre, search.city, search.status, search.minPrice, search.maxPrice, search.sort, search.q]);

  const set = (patch: Partial<typeof search>) =>
    navigate({ search: (prev: typeof search) => ({ ...prev, ...patch, page: 1 }) });

  const clear = () =>
    navigate({
      search: () => ({ q: "", sort: "newest", genre: "", city: "", status: "", minPrice: 0, maxPrice: PRICE_MAX, page: 1 }),
    });

  const filtered = useMemo(() => {
    const q = search.q.trim().toLowerCase();
    let list = SHOWS.filter((s) => {
      if (q && !(s.title.toLowerCase().includes(q) || s.groupName.toLowerCase().includes(q))) return false;
      if (search.genre && s.genre !== search.genre) return false;
      if (search.city && s.city !== search.city) return false;
      if (search.status && s.status !== search.status) return false;
      if (s.price < search.minPrice || s.price > search.maxPrice) return false;
      return true;
    });
    const sort = search.sort as SortValue;
    if (sort === "newest") list = list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (sort === "popular") list = list.sort((a, b) => b.popularity - a.popularity);
    if (sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
    if (sort === "alpha") list = list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(search.page, totalPages);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeCount =
    (search.genre ? 1 : 0) +
    (search.city ? 1 : 0) +
    (search.status ? 1 : 0) +
    (search.minPrice > 0 || search.maxPrice < PRICE_MAX ? 1 : 0);

  const filters = (
    <>
      <FilterGroup label="Genre">
        <div className="flex flex-wrap gap-2">
          {SHOW_GENRES.map((g) => (
            <ChipToggle key={g} active={search.genre === g} onClick={() => set({ genre: search.genre === g ? "" : g })}>
              {g}
            </ChipToggle>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label="City">
        <div className="flex flex-wrap gap-2">
          {SHOW_CITIES.map((c) => (
            <ChipToggle key={c} active={search.city === c} onClick={() => set({ city: search.city === c ? "" : c })}>
              {c}
            </ChipToggle>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label="Status">
        <div className="flex flex-wrap gap-2">
          {(["upcoming", "live", "archived"] as ShowStatus[]).map((s) => (
            <ChipToggle key={s} active={search.status === s} onClick={() => set({ status: search.status === s ? "" : s })}>
              {s[0].toUpperCase() + s.slice(1)}
            </ChipToggle>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label={`Price · ৳${search.minPrice} – ৳${search.maxPrice}`}>
        <Slider
          value={[search.minPrice, search.maxPrice]}
          min={0}
          max={PRICE_MAX}
          step={50}
          onValueChange={(v) => set({ minPrice: v[0], maxPrice: v[1] })}
        />
      </FilterGroup>
    </>
  );

  return (
    <section className="container-page py-10 md:py-14">
      <ExploreToolbar
        sort={search.sort as SortValue}
        onSort={(v) => set({ sort: v })}
        onOpenFilters={() => setSheet(true)}
        activeFilterCount={activeCount}
      />

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <FiltersPanel onClear={clear}>{filters}</FiltersPanel>
        <FiltersSheet open={sheet} onOpenChange={setSheet} onClear={clear}>
          {filters}
        </FiltersSheet>

        <div>
          {loading ? (
            <SkeletonGrid count={6} variant="show" />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No shows match those filters"
              message="Try widening your search or clearing filters."
              onAction={clear}
            />
          ) : (
            <>
              <p className="mb-5 text-xs uppercase tracking-widest text-muted-foreground">
                {filtered.length} production{filtered.length === 1 ? "" : "s"}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((s, i) => (
                  <ShowCard key={s.slug} show={s} index={i} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => navigate({ search: (prev: typeof search) => ({ ...prev, page: p }) })}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
