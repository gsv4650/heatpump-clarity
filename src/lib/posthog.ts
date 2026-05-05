import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    person_profiles: "identified_only",
    respect_dnt: true,
    disable_session_recording: true,
    capture_pageview: "history_change",
    autocapture: {
      dom_event_allowlist: ["click", "submit"],
    },
  });
}

export { posthog };
