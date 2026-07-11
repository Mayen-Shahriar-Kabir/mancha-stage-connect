import { useCallback, useEffect, useState } from "react";

const KEY = "mancha:bookmarks";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function useBookmarks(kind: "show" | "artist" | "group") {
  const [set, setSet] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setSet(read());
  }, []);

  const idFor = (slug: string) => `${kind}:${slug}`;

  const toggle = useCallback(
    (slug: string) => {
      setSet((prev) => {
        const next = new Set(prev);
        const id = idFor(slug);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        try {
          window.localStorage.setItem(KEY, JSON.stringify(Array.from(next)));
        } catch {
          /* noop */
        }
        return next;
      });
    },
    [kind],
  );

  const has = useCallback((slug: string) => set.has(idFor(slug)), [set, kind]);

  return { has, toggle };
}
