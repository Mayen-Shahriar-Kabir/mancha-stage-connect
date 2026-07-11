/**
 * Supabase client (BYO project).
 *
 * Credentials are read from Vite env vars so this project can be deployed
 * to Vercel with your own Supabase project — no Lovable-specific bindings.
 *
 * Add to your `.env.local` (and Vercel project settings):
 *   VITE_SUPABASE_URL=https://<project>.supabase.co
 *   VITE_SUPABASE_ANON_KEY=<publishable-anon-key>
 *
 * Import as:  `import { supabase } from "@/lib/supabase"`
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local (see SUPABASE_SETUP.md)."
    );
  }
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return client;
}

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Lazy proxy so `import { supabase } from "@/lib/supabase"` works everywhere
 * without throwing at module-load time when env vars are missing.
 * The error surfaces only on the first real call.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const real = getSupabase() as unknown as Record<string | symbol, unknown>;
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? (value as Function).bind(real) : value;
  },
});
