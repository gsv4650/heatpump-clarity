# Supabase Dev Environment Setup

HeatPumpClarity uses two Supabase projects: one for production, one for development.
They are completely separate Supabase projects with separate URLs, API keys, and data.

---

## Projects

| Environment | Used by | Data |
|-------------|---------|------|
| **Production** | Vercel Production deployments | Real user data. Never run untested SQL here. |
| **Dev** | Vercel Preview deployments + local `.env.local` | Test/demo data. Safe to wipe and reseed. |

Credentials for each project are stored in Vercel:
- Production keys → Vercel **Production** environment
- Dev keys → Vercel **Preview** and **Development** environments

For local development, copy dev project credentials into `.env.local` (gitignored).

---

## Bootstrapping the dev project (or any new project from scratch)

### Step 1: Run the schema

1. Open the target project in the [Supabase dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor**
3. Paste the contents of [`supabase/schema.sql`](../supabase/schema.sql)
4. Click **Run**

This creates all tables, indexes, RLS policies, triggers, and functions, and seeds
the `utility_rules` table with current Program Manual incentive data.

Expected result: 87 rows in `utility_rules`. Verify with:
```sql
SELECT COUNT(*) FROM utility_rules;
-- expect: 87

SELECT utility, COUNT(*) FROM utility_rules GROUP BY utility ORDER BY utility;
-- expect: central_hudson 16, con_edison 9, national_grid 16,
--         nyseg 16, orange_rockland 14, rge 16
```

### Step 2: Seed sample data (optional)

To populate the dev database with demo projects, homeowners, and leads:

1. In the same SQL Editor, paste the contents of [`supabase/seed.sql`](../supabase/seed.sql)
2. Click **Run**

This inserts 4 sample homeowners, 4 sample projects across various statuses,
their associated documents, 3 manual update entries, and 4 sample leads.

**Do not run `seed.sql` against production.**

### Step 3: Create an admin user

After running the schema, create a user via the Supabase dashboard
(Authentication → Users → Add user), then promote them to admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### Step 4: Configure Storage

Create a storage bucket named `project-documents` in the dev project
(Storage → New bucket) and add the same policies as production.
See [`SUPABASE_SETUP.md`](../SUPABASE_SETUP.md) for the storage policy SQL.

---

## Keeping projects in sync

`supabase/schema.sql` is the **source of truth** for the database schema.

### When you make a schema change

1. Test the change in the **dev** project's SQL Editor first
2. Confirm it works (no errors, expected behavior)
3. Apply the same SQL to the **production** project
4. Update `supabase/schema.sql` to reflect the new state and commit it

For new migrations, also add a numbered file to `supabase/migrations/`
(e.g., `004_your_change.sql`) so the change history is preserved.

### Rule: never run untested SQL against production

Production holds real user data. Always test in dev first.
If a migration has side effects or is irreversible, run it manually
after review — do not automate production migrations without explicit approval.

---

## Environment variable structure

See `.env.example` for the full list. The relevant Supabase variables:

```
NEXT_PUBLIC_SUPABASE_URL       — project URL (public, used client-side)
NEXT_PUBLIC_SUPABASE_ANON_KEY  — anon/public key (public, used client-side)
SUPABASE_SERVICE_ROLE_KEY      — service role key (secret, server-side only)
```

Production and dev projects have different values for all three.
Set them in Vercel per environment. Locally, put dev values in `.env.local`.

**Never commit real keys to git.** `.env.local` is gitignored.
`supabase/schema.sql` and `supabase/seed.sql` contain no credentials.
