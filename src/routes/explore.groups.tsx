import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { GROUPS, GROUP_CITIES, type SortValue } from "@/data/explore";
import { GroupCard } from "@/components/explore/GroupCard";
import { ExploreToolbar } from "@/components/explore/ExploreToolbar";
import { FiltersPanel, FiltersSheet, FilterGroup, ChipToggle } from "@/components/explore/FiltersPanel";
import { EmptyState } from "@/components/explore/EmptyState";
import { SkeletonGrid } from "@/components/explore/SkeletonGrid";
import { Pagination } from "@/components/explore/Pagination";
import { Slider } from "@/components/ui/slider";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  sort: fallback(z.string(), "popular").default("popular"),
  city: fallback(z.string(), "").default(""),
  minYears: fallback(z.number(), 0).default(0),
  maxYears: fallback(z.number(), 60).default(60),
  page: fallback(z.number().int(), 1).default(1),
});

const PAGE_SIZE = 6;

export const Route = createFileRoute("/explore/groups")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Theatre Groups — Explore Mancha" },
      { name: "description", content: "Meet the theatre groups shaping the stage across Bangladesh." },
    ],
  }),
  component: GroupsTab,
});

function GroupsTab() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/explore/groups" });
  const [sheet, setSheet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [search.city, search.minYears, search.maxYears, search.sort, search.q]);

  const set = (patch: Partial<typeof search>) =>
    navigate({ search: (prev: typeof search) => ({ ...prev, ...patch, page: 1 }) });

  const clear = () =>
    navigate({ search: () => ({ q: "", sort: "popular", city: "", minYears: 0, maxYears: 60, page: 1 }) });

  const filtered = useMemo(() => {
    const q = search.q.trim().toLowerCase();
    let list = GROUPS.filter((g) => {
      if (q && !(g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q))) return false;
      if (search.city && g.city !== search.city) return false;
      if (g.yearsActive < search.minYears || g.yearsActive > search.maxYears) return false;
      return true;
    });
    const sort = search.sort as SortValue;
    if (sort === "newest") list = list.sort((a, b) => b.foundedYear - a.foundedYear);
    if (sort === "popular") list = list.sort((a, b) => b.popularity - a.popularity);
    if (sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
    if (sort === "alpha") list = list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(search.page, totalPages);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeCount =
    (search.city ? 1 : 0) + (search.minYears > 0 || search.maxYears < 60 ? 1 : 0);

  const filters = (
    <>
      <FilterGroup label="City">
        <div className="flex flex-wrap gap-2">
          {GROUP_CITIES.map((c) => (
            <ChipToggle key={c} active={search.city === c} onClick={() => set({ city: search.city === c ? "" : c })}>
              {c}
            </ChipToggle>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label={`Years active · ${search.minYears} – ${search.maxYears}`}>
        <Slider
          value={[search.minYears, search.maxYears]}
          min={0}
          max={60}
          step={1}
          onValueChange={(v) => set({ minYears: v[0], maxYears: v[1] })}
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
            <SkeletonGrid count={4} variant="group" />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No groups match those filters"
              message="Try clearing the city filter or the years-active range."
              onAction={clear}
            />
          ) : (
            <>
              <p className="mb-5 text-xs uppercase tracking-widest text-muted-foreground">
                {filtered.length} troupe{filtered.length === 1 ? "" : "s"}
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                {pageItems.map((g, i) => (
                  <GroupCard key={g.slug} group={g} index={i} />
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
