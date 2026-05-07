<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:posthog-rules -->
## PostHog Analytics — Conventions

PostHog is installed via `posthog-js` (stable). The provider component lives at
`src/components/PostHogProvider.tsx` and is mounted in the root layout.

### Session replay is explicitly disabled
`disable_session_recording: true` is set in `src/lib/posthog.ts`. Do not remove
this option and do not enable session recording in the PostHog project dashboard.
That decision is reserved for the project owner.

### Reverse proxy — do not change api_host without updating rewrites
PostHog requests are routed through `/ingest` on the app's own domain to avoid
ad blockers. The `api_host` is set to `'/ingest'` in `posthog.init()`. If you
ever need to change `api_host`, you must also update the matching `rewrites()`
rules in `next.config.ts` — otherwise analytics will silently stop working.
The three rewrite rules point to `us-assets.i.posthog.com` and `us.i.posthog.com`.

### PII inputs must include data-ph-no-capture
Every `<Input>` or `<input>` that may contain personally identifiable information
(name, email, phone, address, ZIP, password) must have the `data-ph-no-capture`
attribute. This is explicit — do not rely on PostHog's default input redaction.

**Rule:** Any new form added to the codebase that collects PII must include
`data-ph-no-capture` on each relevant field before merging.

Fields already covered: auth forms (sign-in, sign-up, reset, update-password),
eligibility wizard (sqft), estimate lead capture (name, email, phone), contractor
dashboard (login credentials, customer name/email/phone, address, city, ZIP),
admin password.

Fields intentionally excluded: numeric incentive rate inputs in AdminPanel (not PII),
file upload inputs (not text capture).
<!-- END:posthog-rules -->

<!-- BEGIN:supabase-dual-project-rules -->
## Supabase Dual-Project Structure

HeatPumpClarity uses two separate Supabase projects:

- **Production project** — holds real user data. Connected to Vercel Production
  environment via `NEXT_PUBLIC_SUPABASE_URL` and related keys.
- **Dev project** — holds test/demo data. Connected to Vercel Preview and
  Development environments, and to local `.env.local` for local development.

### Schema source of truth

`supabase/schema.sql` is the single source of truth for the database schema.
It contains all CREATE TABLE statements, indexes, RLS policies, triggers,
functions, and the full `utility_rules` data seed.

Keep `schema.sql` up-to-date whenever the schema changes. Also add a numbered
migration file to `supabase/migrations/` (e.g., `004_your_change.sql`) to
preserve change history.

### Rule: always test in dev first, never in production

When making any schema change:
1. Run the SQL in the **dev** project's SQL Editor
2. Confirm it works with no errors
3. Apply it to the **production** project
4. Update `supabase/schema.sql` and commit

**Never run untested SQL against production.** Production holds real user data.
If a migration is destructive or irreversible, escalate for manual review —
do not automate without explicit approval.

### Bootstrapping a new project

See `docs/SUPABASE_DEV_SETUP.md` for step-by-step instructions.
Short version: paste `supabase/schema.sql` into the SQL Editor and run.
Then optionally run `supabase/seed.sql` for demo data (dev only).
<!-- END:supabase-dual-project-rules -->

<!-- Build trigger: 2026-05-07 — force NEXT_PUBLIC env var rebuild -->
