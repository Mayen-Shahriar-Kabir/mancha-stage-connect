import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages: (number | "…")[] = [];
  const push = (n: number | "…") => pages.push(n);
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  if (totalPages <= 7) range(1, totalPages).forEach(push);
  else {
    push(1);
    if (page > 4) push("…");
    range(Math.max(2, page - 1), Math.min(totalPages - 1, page + 1)).forEach(push);
    if (page < totalPages - 3) push("…");
    push(totalPages);
  }

  const btn = "grid h-10 w-10 place-items-center rounded-full text-sm transition";
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${btn} border border-border bg-card text-foreground hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${btn} ${
              p === page
                ? "bg-brand font-semibold text-brand-foreground shadow-soft"
                : "border border-border bg-card text-foreground hover:border-brand hover:text-brand"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className={`${btn} border border-border bg-card text-foreground hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
