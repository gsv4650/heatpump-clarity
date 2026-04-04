# HeatPumpClarity — NYS Clean Heat SaaS Portal

A simple, easy-to-use SaaS for homeowners and contractors navigating the NYS Clean Heat program. Homeowners check eligibility and get incentive estimates. Contractors manage projects and document checklists. Admins edit incentive tables.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **Supabase** for auth + database + storage (migration files included)

## Local Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Supabase Setup (Optional for MVP)

The MVP runs with local mock data. To connect Supabase:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration:
   ```bash
   # Using Supabase CLI
   supabase db push
   ```
   Or manually run `supabase/migrations/001_schema.sql` in the SQL editor.
3. Seed the database with `supabase/seed.sql`
4. Add your Supabase credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, benefits, utility coverage |
| `/eligibility` | Step-by-step eligibility wizard (5 steps) |
| `/estimate` | Incentive estimate results with next steps |
| `/contractor` | Contractor dashboard with project management |
| `/project/[id]` | Project detail with document checklist |
| `/admin` | Admin panel for rates, rules, updates, and leads |

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
