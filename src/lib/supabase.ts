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
      "Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
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
