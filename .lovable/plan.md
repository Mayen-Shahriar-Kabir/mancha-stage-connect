## Connect your own Supabase project to Mancha

The codebase is already wired for a BYO (bring-your-own) Supabase setup — `src/lib/supabase.ts` reads credentials from Vite env vars. We just need to (1) plug in your project's keys, (2) make the client easy to import, and (3) verify the connection with a tiny health check.

### Steps

1. **Collect your Supabase credentials** (from Supabase Dashboard → Project Settings → API):
   - Project URL (e.g. `https://xxxx.supabase.co`)
   - `anon` / publishable key (safe to ship in the browser)
   - *(Do NOT paste the `service_role` key — it must never live in frontend code.)*

2. **Store them as environment variables** so the same code works locally and on Vercel:
   - Local dev: create `.env.local` at project root with
     ```
     VITE_SUPABASE_URL=https://xxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
     ```
   - Vercel: add the same two vars in Project → Settings → Environment Variables (Production + Preview).
   - `.env.local` is already gitignored by default — keys won't be committed.

3. **Small code polish in `src/lib/supabase.ts`**
   - Export a ready-to-use `supabase` proxy alongside `getSupabase()` so components can do `import { supabase } from "@/lib/supabase"` directly (matches the pattern the rest of the app will use for auth/data).
   - Keep the friendly error message when env vars are missing.

4. **Add a dev-only connection indicator**
   - A tiny `SupabaseStatus` badge (only visible when `import.meta.env.DEV`) that pings `supabase.auth.getSession()` on mount and shows green ("Connected to Supabase") or red ("Env vars missing") in the corner. Removed automatically in production builds.
   - Mount it once in `__root.tsx`.

5. **Docs update**
   - Add a short `SUPABASE_SETUP.md` at project root with the exact steps above (URL, key, env var names, Vercel note) so future you / collaborators can repeat it in 30 seconds.

### What this plan does NOT do (per your original brief)

- No authentication UI wiring (login/register stay as placeholders).
- No database tables, RLS policies, or migrations.
- No `service_role` usage or server-side admin client.

Once your `.env.local` has the two values and you restart the dev server, the badge should flip to green and you'll be ready to build real features against your Supabase project.

### Optional (say the word)

- I can instead use the built-in **Lovable Cloud** (managed Supabase) which skips the manual key setup entirely — but since you specifically want *your own* Supabase project on Vercel, the BYO flow above is the right fit.
