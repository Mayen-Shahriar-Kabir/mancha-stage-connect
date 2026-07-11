import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

type Status = "checking" | "connected" | "missing" | "error";

/**
 * Dev-only badge that pings Supabase on mount and shows connection state.
 * Renders nothing in production builds.
 */
export function SupabaseStatus() {
  const [status, setStatus] = useState<Status>("checking");
  const [detail, setDetail] = useState<string>("");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!isSupabaseConfigured) {
      setStatus("missing");
      setDetail("VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set");
      return;
    }
    (async () => {
      try {
        const supabase = getSupabase();
        const { error } = await supabase.auth.getSession();
        if (error) throw error;
        setStatus("connected");
        setDetail(import.meta.env.VITE_SUPABASE_URL as string);
      } catch (e) {
        setStatus("error");
        setDetail(e instanceof Error ? e.message : String(e));
      }
    })();
  }, []);

  if (!import.meta.env.DEV || !open) return null;

  const palette: Record<Status, { dot: string; label: string; text: string }> = {
    checking: { dot: "bg-amber-400", label: "Checking Supabase…", text: "text-amber-100" },
    connected: { dot: "bg-emerald-400", label: "Supabase connected", text: "text-emerald-100" },
    missing: { dot: "bg-rose-400", label: "Supabase env missing", text: "text-rose-100" },
    error: { dot: "bg-rose-400", label: "Supabase error", text: "text-rose-100" },
  };
  const p = palette[status];

  return (
    <div className="fixed bottom-4 left-4 z-[9999] max-w-xs rounded-full border border-white/10 bg-black/80 px-3 py-1.5 text-xs shadow-elevated backdrop-blur">
      <div className="flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${p.dot} animate-pulse`} />
        <span className={`font-medium ${p.text}`}>{p.label}</span>
        <button
          onClick={() => setOpen(false)}
          className="ml-2 text-white/50 hover:text-white"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      {detail && (
        <div className="mt-0.5 truncate pl-4 text-[10px] text-white/50" title={detail}>
          {detail}
        </div>
      )}
    </div>
  );
}
