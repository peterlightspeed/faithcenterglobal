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
- `js/assistant.js` + `js/church-data.json` power the floating Ministry
  Assistant chat widget (a separate, self-contained knowledge base — see
  below).

## Project Structure

```
├── index.html, about.html, ...     Page templates (shared navbar/footer)
├── content/, config/                The mini-CMS (see above)
├── css/style.css                    Design system styles (see DESIGN_SYSTEM.md)
├── js/content-loader.js             Fetches all JSON content/config
├── js/render.js                     Renders every page section from JSON
├── js/script.js                     Navbar, counters, filters, search
├── js/pwa.js                        Install banner + tutorial modal
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

## Payments, Forms & Analytics — Pending Integrations

Several features are intentionally stubbed until the church confirms
providers — see `config/payments.json`, `config/forms.json`,
`config/emailjs.json`, and `config/analytics.json`, each with `enabled:
false` and empty placeholders (never fake values). Turning them on is a
config edit, not a code change — see **CONTENT_MANAGEMENT_GUIDE.md** and
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
