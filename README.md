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

## Security model

Demo Mode has been **removed**. The application now runs a production security
posture; the browser is treated as untrusted at every boundary.

### Authentication

- Passwords require **10+ characters with upper case, lower case and a digit**
  (`src/lib/validation.ts`). The same rule is applied on signup and on reset.
- Sign-in errors are deliberately generic so accounts cannot be enumerated.
- Session persistence is owned entirely by Supabase Auth — the app never
  relocates or rewrites auth storage keys by hand.
- `?redirect=` values are sanitized to same-origin absolute paths
  (`src/lib/safe-redirect.ts`), closing the open-redirect vector on `/login`.

### Roles and accounts

- Roles live in a dedicated `user_roles` table and are read through the
  `has_role()` security-definer function — never from `profiles`.
- A `guard_profile_update` trigger blocks any non-admin attempt to change
  `primary_role` or `status`, so self-escalation is impossible even if the
  client is tampered with.
- Account status transitions follow a server-side state machine, and every
  role change, approval and suspension is written to `security_audit_log`.

### Business logic is server-authoritative

Money and capacity are never trusted from the client:

| Action              | Server function            | Guarantees |
| ------------------- | -------------------------- | ---------- |
| Ticket booking      | `book_ticket()`            | Row-locked capacity check, authoritative pricing, generated booking code, atomic `seats_sold` update |
| Ticket cancellation | `cancel_ticket()`          | Ownership check, atomic seat release |
| Funding             | `contribute_to_campaign()` | Campaign must be active, contributor taken from the session, atomic `raised_amount` update |

Direct client inserts into `tickets`, `funding_contributions` and
`notifications` are revoked. Notifications are emitted only by trusted database
triggers, so no client can forge a message for another user.

### Data exposure

- RLS is enabled on every table, with policies scoped to `auth.uid()`.
- Public discovery reads a narrow `public_directory` table (names and roles
  only), maintained by triggers — the `profiles` table itself is never exposed
  to anonymous clients.

## Bootstrapping the first admin

Register an account, then run in the Cloud SQL editor:

```sql
SELECT public.admin_set_user_role(
  (SELECT id FROM public.profiles WHERE email='you@example.com'),
  'admin'
);
```

Subsequent role and approval changes are performed from the Admin Console.

## Legacy demo accounts

The eight `@mancha.demo` accounts seeded during prototyping still own most of
the sample productions, tickets and campaigns, so their data was preserved.
Their passwords have been **rotated to 48-character random values** — the old
`1234` credential no longer authenticates. To use one of them again, trigger a
password reset from `/forgot-password`, or set a new password with
`admin_set_account_status` / the Admin Console.
