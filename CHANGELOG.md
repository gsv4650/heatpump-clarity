## v0.2.0 — Supabase Integration

### Foundation
- Installed @supabase/supabase-js and @supabase/ssr
- Added Supabase client helpers (browser, server, middleware)
- Added middleware.ts for session refresh and route protection
- Migration 002: RLS policies on all tables, user_id on homeowners, updated_at trigger

### Auth
- /auth/signin — email/password sign in
- /auth/signup — sign up with role selection (homeowner/contractor)
- /auth/reset — password reset request
- /auth/update-password — set new password
- /auth/callback — Supabase code exchange route

### Server Actions
- actions/auth.ts — createUserProfile, getUserRole
- actions/leads.ts — submitLead
- actions/projects.ts — createProject
- actions/admin.ts — updateIncentiveRate, toggleUpdate
- actions/documents.ts — uploadDocument

### Pages Updated
- / — reads published updates from Supabase (mock fallback)
- /estimate — lead capture form added
- /contractor — real auth, project list from DB, new project modal
- /project/[id] — document upload wired to storage
- /admin — real admin role check, mutations persist to DB

### Docs
- .env.example added
- SUPABASE_SETUP.md added
- README.md updated
- CHANGELOG.md added
