<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the DevEvents Next.js App Router application. Here is a summary of all changes made:

- **`posthog-js`** was installed as a dependency.
- **`instrumentation-client.ts`** was created at the project root to initialize PostHog using the Next.js 15.3+ client instrumentation pattern. It uses environment variables for the API key, routes traffic through a local reverse proxy (`/ingest`), enables automatic exception capture, and turns on debug mode in development.
- **`next.config.ts`** was updated to add reverse proxy rewrites for `/ingest/static/*` and `/ingest/*` pointing to PostHog's US ingestion endpoints, along with `skipTrailingSlashRedirect: true`. This improves reliability by routing analytics through your own domain.
- **`.env.local`** was created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` — values are kept out of source code.
- **`components/ExploreBtn.tsx`** was converted to capture a PostHog event when the user clicks the "Explore Events" CTA.
- **`components/EventCard.tsx`** was made a client component to capture a PostHog event (with event metadata as properties) when a user clicks an event card.
- **`components/Navbar.tsx`** was made a client component to capture a PostHog event with the clicked nav label when a user clicks a navbar link.

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the 'Explore Events' CTA button to scroll to the events list | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked an event card to navigate to the event detail page — captures `event_title`, `event_slug`, `event_location`, `event_date` | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicked a navigation link in the top navbar — captures `label` | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard – Analytics basics**: https://us.posthog.com/project/336895/dashboard/1345085
- **Explore Events CTA – daily clicks**: https://us.posthog.com/project/336895/insights/VXp4TRjN
- **Most clicked events** (breakdown by event title): https://us.posthog.com/project/336895/insights/11OYIG2z
- **Event discovery funnel** (Explore Events → Event Card click): https://us.posthog.com/project/336895/insights/3mKNXmgI
- **Nav link clicks by section** (breakdown by label): https://us.posthog.com/project/336895/insights/shEH9J49
- **Weekly active users by action**: https://us.posthog.com/project/336895/insights/Ss2rLFjb

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
