# HeatPumpClarity — NYS Clean Heat SaaS Portal

A simple, easy-to-use SaaS for homeowners and contractors navigating the NYS Clean Heat program. Homeowners check eligibility and get incentive estimates. Contractors manage projects and document checklists. Admins edit incentive tables.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS**
- **shadcn/ui** components
- **Supabase** for auth + database + storage

## Local Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run (Mock Mode — no Supabase required)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app runs fully in **mock mode** with no environment variables needed. All pages work with sample data.

### Build for Production

```bash
npm run build
npm start
```

## Supabase Setup

To connect a real database, auth, and storage, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for the full guide.

**Quick start:**
1. Create a Supabase project
2. Run `supabase/migrations/001_schema.sql` then `002_rls_and_fixes.sql` in the SQL editor
3. Run `supabase/seed.sql`
4. Create a private storage bucket named `project-documents`
5. Copy `.env.example` to `.env.local` and fill in your credentials
6. Promote your account to admin: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com';`

## Auth Flow

| Step | Route | Description |
|------|-------|-------------|
| Sign up | `/auth/signup` | Choose homeowner or contractor role, create account |
| Confirm email | (email link) | Click the link in your email |
| Sign in | `/auth/signin` | Email + password |
| Forgot password | `/auth/reset` | Request a reset link |
| Set new password | `/auth/update-password` | After clicking email reset link |
| OAuth callback | `/auth/callback` | Internal — handles Supabase code exchange |
| Sign out | `POST /auth/signout` | Clears session, redirects to sign in |

When Supabase is **not configured**, auth pages show a mock-mode notice and the app falls back to sample data everywhere.

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, benefits, utility coverage, published updates |
| `/eligibility` | Step-by-step eligibility wizard (5 steps) |
| `/estimate` | Incentive estimate results, next steps, lead capture form |
| `/contractor` | Contractor dashboard — real auth when Supabase is configured |
| `/project/[id]` | Project detail with document upload |
| `/admin` | Admin panel — requires admin role |
| `/auth/signin` | Sign in page |
| `/auth/signup` | Sign up with role selection |
| `/auth/reset` | Password reset request |
| `/auth/update-password` | Set new password |
| `/auth/callback` | Supabase auth code exchange |

## Supported Utilities

- Central Hudson
- Con Edison
- National Grid
- NYSEG
- RG&E
- Orange & Rockland

## NYS Clean Heat Categories

- **Category 2**: Air Source Heat Pump (Ducted) — New Construction
- **Category 2a**: Air Source Heat Pump (Ducted) — Retrofit, Full Displacement
- **Category 2b**: Air Source Heat Pump (Ducted) — Retrofit, Partial Displacement
- **Category 3**: Air Source Heat Pump (Ductless/Mini-Split)
- **Category 4**: Ground Source Heat Pump
- **Category 5**: Heat Pump Water Heater — New Construction
- **Category 5a**: Heat Pump Water Heater — Replacing Electric
- **Category 5b**: Heat Pump Water Heater — Replacing Fossil Fuel

## Environment Variables

See `.env.example` for all required variables. The app runs with zero env vars in mock mode.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | For live mode | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For live mode | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | For server actions | Supabase service role key (server-only, never expose) |
