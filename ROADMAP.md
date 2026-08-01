# Roadmap

Future improvements, grouped by effort. Nothing here is started — this is
a menu to pick from when the church is ready.

## Easy (config-only or a few hours of dev time)

- **Paystack online giving** — set `config/payments.json` → `paystack.enabled: true`
  and paste real payment links. The Giving page picks it up automatically
  (see `CONTENT_SCHEMA.md`).
- **Formspree contact/prayer forms** — paste an endpoint into
  `config/forms.json`. Activates automatically (see
  `CONTENT_MANAGEMENT_GUIDE.md`).
- **EmailJS** — `config/emailjs.json` is stubbed but not wired into any
  form yet. A developer would add an EmailJS `send()` call as a fallback
  or alternative to Formspree in `js/render.js` (`wireForm`).
- **Google Analytics** — add the standard `gtag.js` snippet to every
  page's `<head>`, reading `measurementId` from
  `config/analytics.json` instead of hardcoding it. Simple to template
  across all 9 pages once.
- **Microsoft Clarity** — same idea as Google Analytics, using
  `config/analytics.json` → `microsoftClarity.projectId`.

## Medium

- **Church newsletter** — a signup form (Formspree or Mailchimp embed)
  plus a `content/newsletter.json` toggle to show/hide it site-wide.
- **Push notifications** — requires a proper backend (or a service like
  OneSignal) to send pushes; `sw.js` already has a service worker in
  place as a starting point, but push subscriptions aren't implemented.
- **Search** — a simple client-side search across sermons/events/books
  is easy (all content is already loaded as JSON in the browser); a
  full-text search across sermon transcripts would need a backend or a
  hosted search service (Algolia, Meilisearch).

## Advanced (needs a backend)

- **Supabase integration** — see `FUTURE_SUPABASE.md` for the full plan:
  prayer requests, member-submitted testimonies, a real bookstore table,
  event RSVPs, and gallery storage.
- **Admin dashboard** — a small authenticated page (Supabase Auth) for
  staff to edit content without touching GitHub/JSON directly. Natural
  follow-on once Supabase tables exist.
- **User authentication** — needed for the admin dashboard above, and
  optionally for a members' area (giving history, event RSVPs).
- **Event registration** — RSVP counts and capacity limits, needs a
  database (Supabase `events` table + a `registrations` table).
- **Online bookstore** — real checkout (vs. the current WhatsApp-based
  buy flow) needs Paystack/Stripe checkout sessions plus inventory
  tracking — a natural extension of the Supabase `books` table.
- **Online giving dashboard** — reporting/analytics on tithes & offerings
  for church administration; requires Paystack's transaction API plus a
  database to aggregate against.

## Notes on why some things are intentionally NOT dynamic yet

- **Per-page SEO tags** (`<title>`, `<meta description>`, Open Graph)
  stay hardcoded in each HTML file's `<head>` rather than being rendered
  by JavaScript, so search engine crawlers that don't execute JS still
  see correct, final tag values immediately. `config/seo.json` holds
  site-wide defaults for future use (e.g. if a build step is ever added),
  but per-page overrides are deliberately left as static HTML.
- **Analytics scripts** are not auto-injected even though the config
  files exist, so no tracking runs until the church explicitly approves
  a provider and a developer adds the snippet — avoiding silently
  shipping tracking scripts nobody signed off on.
