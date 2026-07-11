import { SORT_OPTIONS, type SortValue } from "@/data/explore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { ExploreSearch } from "./ExploreSearch";

export function ExploreToolbar({
  sort,
  onSort,
  onOpenFilters,
  activeFilterCount = 0,
}: {
  sort: SortValue;
  onSort: (v: SortValue) => void;
  onOpenFilters: () => void;
  activeFilterCount?: number;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="flex-1">
        <ExploreSearch compact />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onOpenFilters}
          className="h-10 rounded-full lg:hidden"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-brand-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <Select value={sort} onValueChange={(v) => onSort(v as SortValue)}>
          <SelectTrigger className="h-10 w-full rounded-full lg:w-56">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                Sort · {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
