# Connecting your Supabase project

Mancha is set up as **BYO Supabase** — it reads credentials from Vite env
vars so the same code works locally and on Vercel.

## 1. Get your keys

Supabase Dashboard → **Project Settings → API**:

- **Project URL** — `https://<project-ref>.supabase.co`
- **anon / publishable key** — safe to expose in browser code

> ⚠️ Never paste the `service_role` key into this frontend project.

## 2. Local development

Create `.env.local` at the project root:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key...
```

Then restart the dev server. A small badge in the bottom-left corner will
turn green (**"Supabase connected"**) when the keys are working. The badge
only appears in development.

## 3. Vercel deployment

Vercel Dashboard → your project → **Settings → Environment Variables**.
Add the same two variables for **Production** and **Preview**:

| Name                    | Value                              |
| ----------------------- | ---------------------------------- |
| `VITE_SUPABASE_URL`     | `https://<project-ref>.supabase.co`|
| `VITE_SUPABASE_ANON_KEY`| your anon key                      |

Redeploy for the new vars to take effect.

## 4. Using the client in code

```ts
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase.from("shows").select("*");
```

That's it — auth, database, storage, and realtime are all available through
the same `supabase` import.
