# Connecting Mancha to your own Supabase project

The app talks to Supabase **only from the browser** (auth + Data API + RPCs).
There is no server-side Supabase code left, so two environment variables are
all that's needed to point it anywhere.

## 1. Create the schema

Open your project's **SQL Editor** and run `supabase/schema.sql` once, against a
**fresh** project. It is the full migration history concatenated in order and
creates everything the app needs:

- Enums: `app_role`, `account_status`, `organization_type`, `production_status`,
  `ticket_status`, `campaign_status`, `notification_type`, `review_target`
- Tables: `profiles`, `user_roles`, `productions`, `tickets`,
  `funding_campaigns`, `funding_contributions`, `reviews`, `review_replies`,
  `notifications`, `security_audit_log`, `public_directory`
- All RLS policies and Data-API `GRANT`s
- Security-definer functions: `has_role`, `is_active_user`, `book_ticket`,
  `cancel_ticket`, `contribute_to_campaign`, `admin_set_user_role`,
  `admin_set_account_status`, `log_security_event`
- Guard/sync triggers, including `handle_new_user` on `auth.users`

Run it top to bottom in one go — later statements depend on earlier ones.

## 2. Point the app at the project

`.env.local` (already created, git-ignored) holds:

```
VITE_SUPABASE_URL="https://<your-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
VITE_SUPABASE_PROJECT_ID="<your-ref>"
```

Delete that file to switch back to the Lovable-managed backend.

On **Vercel**, set the same three variables in Project Settings → Environment
Variables. Never add the service-role key — nothing in this app uses it.

## 3. Auth settings

In Authentication → Providers → Email:

- Enable **Email** sign-in.
- **Confirm email**: turn OFF for a prototype (signup logs in immediately), ON
  for production. The app already renders a "check your inbox" state.
- Set **Site URL** and add your deployed URL to **Redirect URLs**, otherwise
  password-reset links bounce.
- Minimum password length is 6 at the Supabase level; the app's own signup
  policy requires 10+ with mixed case and a digit.

## 4. Create the first administrator

`handle_new_user` deliberately refuses to grant `admin` from signup metadata —
otherwise anyone could self-promote. Register normally through the app, then run
once in the SQL editor:

```sql
update public.profiles set primary_role = 'admin', status = 'active'
 where email = 'you@example.com';

insert into public.user_roles (user_id, role)
select id, 'admin' from public.profiles where email = 'you@example.com'
on conflict do nothing;
```

Every later role change should go through the Admin Console, which calls
`admin_set_user_role` and writes to `security_audit_log`.

## 5. Data does not migrate

Accounts, productions, tickets and campaigns created against the managed
backend stay there. Your project starts empty; create content through the app.
