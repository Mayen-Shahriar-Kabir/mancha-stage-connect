/**
 * Session-persistent demo store backed by localStorage.
 * Used for org workflows where a real backend is not yet wired.
 */
import { useCallback, useEffect, useState } from "react";

const KEY = (feature: string, scope = "shared") =>
  `mancha.demo.${feature}.${scope}`;

function read<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return seed;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : seed;
  } catch {
    return seed;
  }
}

function write<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("mancha:demo-store", { detail: key }));
  } catch {
    // storage full or unavailable — silently ignore in demo mode
  }
}

export function useDemoList<T extends { id: string }>(
  feature: string,
  seed: T[],
  scope = "shared",
) {
  const key = KEY(feature, scope);
  const [items, setItems] = useState<T[]>(() => read(key, seed));

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<string>;
      if (ce.detail === key) setItems(read(key, seed));
    };
    window.addEventListener("mancha:demo-store", handler);
    window.addEventListener("storage", () => setItems(read(key, seed)));
    return () => window.removeEventListener("mancha:demo-store", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const persist = useCallback(
    (next: T[]) => {
      setItems(next);
      write(key, next);
    },
    [key],
  );

  const add = useCallback(
    (item: Omit<T, "id"> & { id?: string }) => {
      const withId = { ...(item as T), id: item.id ?? `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}` };
      persist([withId, ...items]);
      return withId;
    },
    [items, persist],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      persist(items.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    },
    [items, persist],
  );

  const remove = useCallback(
    (id: string) => persist(items.filter((x) => x.id !== id)),
    [items, persist],
  );

  const reset = useCallback(() => persist(seed), [persist, seed]);

  return { items, add, update, remove, reset, setAll: persist };
}
