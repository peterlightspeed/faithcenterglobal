# The Faith Centre Global (TFCG) — Website

The official website for **The Faith Centre Global**, a Word of Faith,
Prophetic, and Apostolic-based church in Okota, Lagos, Nigeria, led by
Pastor Godspower Opara Martins.

## Overview

This is a static, multi-page website built with HTML, CSS, and vanilla
JavaScript (Bootstrap 5) — **no framework, no build step, no backend.**
Almost all content (books, events, sermons, ministries, testimonies,
gallery, FAQs, leadership, giving info, service times, the homepage
message, and more) is driven by JSON files, so day-to-day updates never
require touching HTML. See **CONTENT_MANAGEMENT_GUIDE.md** to get
started.

## Pages

| Page | Description |
|---|---|
| `index.html` | Homepage — hero, vision/mandate, service times, ministries preview, live stream embed, testimonials, prayer request form |
| `about.html` | Church story, vision, mandate, statement of faith, leadership, photo gallery |
| `ministries.html` | All ministry teams |
| `sermons.html` | Sermon library with filtering |
| `events.html` | Weekly services and special events |
| `books.html` | Bookstore with search/filter and WhatsApp checkout |
| `media.html` | Media Centre — Photos, Videos, and News & Updates tabs |
| `appointments.html` | Request an appointment with the pastoral team (counseling, prayer, deliverance, and more) |
| `giving.html` | Giving methods, bank transfer details, online giving (Paystack-ready) |
| `livestream.html` | Live service stream and schedule |
| `contact.html` | Contact form, prayer request modal, FAQs, social links |

## Content Management (the mini-CMS)

```
content/          Things you change often
├── church.json         Church identity, homepage hero, about text, contact info
├── services.json       Weekly service times
├── events.json         Events list
├── books.json           Bookstore titles
├── sermons.json        Sermon library
├── testimonies.json    Homepage testimonials
├── ministries.json     Ministry teams
├── leadership.json     Pastor & staff bios
├── gallery.json        About-page photo gallery + Media Centre Photos tab
├── giving.json         Giving methods + bank details
├── livestream.json     Live stream page copy
├── faqs.json           Contact-page FAQ accordion
├── announcements.json  Site-wide announcement bar
├── videos.json         Media Centre Videos tab
├── updates.json        Media Centre News & Updates tab
└── settings.json       Feature toggles

config/            Things you rarely change
├── payments.json       Paystack (disabled until configured)
├── forms.json          Formspree endpoints (disabled until configured)
├── emailjs.json         EmailJS placeholders (not yet wired in)
├── analytics.json      Google Analytics / Microsoft Clarity IDs
├── social.json         Social media links
├── seo.json             Site-wide SEO defaults
├── livestream.json     YouTube channel/video embed settings
└── app.json             PWA app name + install banner copy
```

Edit a `.json` file, save, refresh the page — that's it. Full field-by-field
docs: **CONTENT_SCHEMA.md**. Beginner-friendly walkthroughs (adding a
book, turning on an announcement, connecting Formspree, etc.):
**CONTENT_MANAGEMENT_GUIDE.md**.

## How it works

- `js/content-loader.js` fetches every file above and exposes them as
  `window.TFCG_CONTENT` / `window.TFCG_CONFIG`, then fires a
  `tfcg:content-ready` event.
- `js/render.js` listens for that event and renders every section of
  every page from that data — reusable card/list renderers, no
  duplicated markup logic. Each render function checks whether its
  container exists before doing anything, so this one file safely
  covers every page.
- `js/script.js` handles navbar behavior, counters, filter tabs, live
  search, and the scroll-to-top button — wrapped so it still works when
  content is injected asynchronously.
- `js/pwa.js` + `sw.js` power the install banner and offline app shell
  caching (see **INSTALL_APP_GUIDE.md**).
- `js/theme.js` powers the light/dark mode toggle (see **Dark Mode**
  below).
- `js/assistant.js` + `js/church-data.json` power the floating Ministry
  Assistant chat widget (a separate, self-contained knowledge base — see
  below).

## Dark Mode

The site supports both light and dark themes, with a toggle button (sun/
moon icon) in the navbar on every page. The visitor's choice is saved to
`localStorage` and respected on every future visit; first-time visitors
see whichever theme matches their operating system's preference. A tiny
inline script at the top of every page's `<head>` applies the correct
theme before anything paints, so there's no flash of the wrong theme.

The theming system is built on CSS custom properties defined in
`css/style.css` — semantic variables like `--bg-primary`, `--text-primary`,
and `--card-bg` are set once for dark mode (the default) and redefined
under `[data-theme="light"]`. Brand colors (gold, blue, red) stay
constant across both themes; only backgrounds, text, borders, and
shadows change. If you add new components to the site, use these
variables instead of hardcoded colors so they stay theme-aware — see the
"THEME SYSTEM" comment block near the top of `css/style.css` for the
full list.

## Progressive Web App (PWA)

The site is installable as an app on Android, desktop Chrome/Edge, and
(via Safari's Share menu) iOS — see **INSTALL_APP_GUIDE.md**. Installability
depends on `site.webmanifest` being valid and its `start_url`/`scope`
matching wherever the site is actually deployed; both are set to `"."`
(relative to the manifest itself) so this works correctly whether the
site ends up hosted at a domain root or a subpath, without needing to
edit the manifest for your specific hosting setup.

## Live Stream

The live player automatically shows whatever is currently live on the
church's YouTube channel — this requires the channel's **Channel ID**
(not its `@handle`) in `config/livestream.json`. See
**LIVESTREAM_GUIDE.md** for the full setup walkthrough.

## Project Structure

```
├── index.html, about.html, ...     Page templates (shared navbar/footer)
├── appointments.html                Appointment request form (Formspree)
├── content/, config/                The mini-CMS (see above)
├── css/style.css                    Design system + light/dark theme variables (see DESIGN_SYSTEM.md)
├── js/content-loader.js             Fetches all JSON content/config
├── js/render.js                     Renders every page section from JSON
├── js/script.js                     Navbar, counters, filters, search
├── js/pwa.js                        Install banner + tutorial modal
├── js/theme.js                      Light/dark mode toggle
├── js/assistant.js                  Floating Ministry Assistant widget logic
├── js/church-data.json              Knowledge base powering the Ministry Assistant
├── sw.js                            Service worker (offline app shell caching)
├── images/                          Site imagery
├── public/                          Favicon and Open Graph image
└── *.md                             Documentation (see below)
```

## Ministry Assistant

The floating chat widget in the bottom-right corner answers common
visitor questions by matching keywords against `js/church-data.json`. It
is intentionally self-contained and separate from the `content/`/`config/`
CMS above (so it keeps working even if a content file is temporarily
broken). To upgrade it to a real conversational AI, see the `// TODO:
Swap this function for a real AI API call` comment in `js/assistant.js`.

## Payments, Forms & Analytics — Integration Status

- **Formspree** is live for the Contact form and the Appointments form
  (`config/forms.json` → `contactForm.endpoint` / `appointmentForm.endpoint`).
  The Prayer Request forms don't have an endpoint configured yet.
- **Paystack**, **EmailJS**, and **Analytics** remain intentionally
  stubbed until the church confirms providers — see
  `config/payments.json`, `config/emailjs.json`, and
  `config/analytics.json`, each with `enabled: false` and empty
  placeholders (never fake values). Turning them on is a config edit,
  not a code change — see **CONTENT_MANAGEMENT_GUIDE.md** and
  **ROADMAP.md**.

## Development

This is a static site — no build step is required. Because content is
fetched with `fetch()`, opening `index.html` directly from disk (`file://`)
will not load JSON due to browser security restrictions — serve it over
a local web server instead:

```bash
npm install
npm run dev
```

This starts a local static file server on port 5000.

## Documentation Index

- **CONTENT_MANAGEMENT_GUIDE.md** — beginner-friendly, step-by-step
- **CONTENT_SCHEMA.md** — technical field reference for every JSON file
- **DESIGN_SYSTEM.md** — colors, typography, spacing, components
- **LIVESTREAM_GUIDE.md** — live stream embed setup
- **INSTALL_APP_GUIDE.md** — installing the site as an app (PWA)
- **FUTURE_SUPABASE.md** — how a database could later power dynamic features
- **ROADMAP.md** — future features, categorized by effort
- **AI_HANDOFF.md** — summary of the JSON-CMS refactor and what's left

## Credits

Designed by **peterlightspeed**.
