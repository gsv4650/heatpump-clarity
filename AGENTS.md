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
