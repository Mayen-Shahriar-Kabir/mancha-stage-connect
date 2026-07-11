# Mancha — Bangladesh's Digital Theatre Ecosystem

Modern SaaS platform connecting theatre artists, groups, audiences, universities, corporations, tourism organizations, and the film/OTT industry.

## Stack

- TanStack Start (React 19, Vite 7)
- Tailwind CSS v4
- Lovable Cloud (Supabase) — auth, database, storage

## Development

```bash
bun install
bun run dev
```

---

## 🎭 Demo Mode

This project is an academic prototype. **Demo Mode is currently enabled** to simplify testing and presentations:

- ✅ Email verification is **disabled** — accounts sign in immediately.
- ✅ Password minimum is relaxed to **4 characters** (simple values like `1234` are allowed).
- ✅ Admin approval workflow still functions: audience accounts are active on signup, all other roles remain `pending` until an admin approves.
- ✅ Seeded demo accounts (below) are pre-approved and ready to sign in.

### Demo credentials

All passwords are `1234`.

| Role            | Email                     | Password | Status  |
| --------------- | ------------------------- | -------- | ------- |
| Admin           | `admin@mancha.demo`       | `1234`   | Active  |
| Theatre Group   | `group@mancha.demo`       | `1234`   | Active  |
| Theatre Artist  | `artist@mancha.demo`      | `1234`   | Active  |
| Audience        | `audience@mancha.demo`    | `1234`   | Active  |
| University      | `university@mancha.demo`  | `1234`   | Active  |
| Corporate       | `corporate@mancha.demo`   | `1234`   | Active  |
| Tourism Board   | `tourism@mancha.demo`     | `1234`   | Active  |
| Film & OTT      | `film@mancha.demo`        | `1234`   | Active  |

### Seeding the demo accounts

1. Sign in as an admin (or bootstrap the first admin using the SQL snippet at the bottom of this file).
2. Navigate to **Admin Console → Demo Accounts** (`/dashboard/admin/demo-accounts`).
3. Click **Seed demo accounts**. The page will create any missing users, reset passwords to `1234`, and mark them all as `active`.
4. Repeat the click any time to re-sync passwords / statuses.

The seeded credentials are also copy-clickable directly from that page for use during a live demo.

### Restoring production security

To harden the app for production, revert the following:

- `src/routes/register.tsx` and `src/routes/reset-password.tsx` — restore the 8-character password schema with letter+digit requirements.
- `src/routes/login.tsx` — restore the min-6 password check.
- Supabase Auth settings — turn **auto-confirm email** OFF and enable **HIBP leaked-password protection**.
- Remove or gate `/dashboard/admin/demo-accounts` and delete the demo users.

### Bootstrapping the first admin manually

If no admin exists yet, register any account, then run in the Cloud SQL editor:

```sql
UPDATE public.profiles
   SET primary_role='admin', status='active'
 WHERE email='you@example.com';

UPDATE public.user_roles
   SET role='admin'
 WHERE user_id=(SELECT id FROM public.profiles WHERE email='you@example.com');
```

Once you have one admin, use **Demo Accounts** to seed the rest with one click.
