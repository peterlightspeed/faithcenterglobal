# The Faith Centre Global (TFCG) — Website

The official website for **The Faith Centre Global**, a Word of Faith, Prophetic, and Apostolic-based church in Okota, Lagos, Nigeria, led by Pastor Godspower Opara Martins.

## Overview

This is a static, multi-page website built with HTML, CSS, and vanilla JavaScript, styled with Bootstrap 5. It includes a public-facing site for the church covering worship services, ministries, sermons, events, a bookstore, giving, live streaming, and contact/prayer requests, plus a floating Ministry Assistant widget for common visitor questions.

## Pages

| Page | Description |
|---|---|
| `index.html` | Homepage — hero, vision/mission, service times, ministries preview, live stream embed, testimonials, prayer request form |
| `about.html` | Church history, vision, mission, statement of faith, pastor profile |
| `ministries.html` | Overview of all ministry teams (Youth, Worship, Prayer, Outreach, Children, Women) |
| `sermons.html` | Sermon library with filtering by category and embedded video player |
| `events.html` | Upcoming weekly services and special events |
| `books.html` | Bookstore for titles by Pastor Godspower Opara Martins, with search/filter and WhatsApp-based checkout |
| `giving.html` | Tithes/offerings/seed information and bank transfer details |
| `livestream.html` | Live service stream and schedule |
| `contact.html` | Contact form, prayer request modal, church address and social links |

## Project Structure

```
├── index.html, about.html, ...     Page templates (shared navbar/footer)
├── css/style.css                   Design system styles (see DESIGN_SYSTEM.md)
├── js/script.js                    Navbar behavior, forms, counters, filters, search
├── js/assistant.js                 Floating Ministry Assistant widget logic
├── js/church-data.json             Knowledge base powering the Ministry Assistant
├── images/                         Optimized site imagery
├── public/                         Favicon and Open Graph image
└── DESIGN_SYSTEM.md                Design tokens and component guidelines
```

## Ministry Assistant

The floating chat widget in the bottom-right corner answers common visitor questions (service times, location, ministries, giving, etc.) by matching keywords against `js/church-data.json`. It is intentionally built without a paid AI API so it works out of the box. To upgrade it to a real conversational AI:

1. Open `js/assistant.js` and locate the `// TODO: Swap this function for a real AI API call` comment.
2. Replace the keyword-matching logic with a call to your AI provider of choice (e.g. OpenAI, Anthropic).
3. Keep `church-data.json` as a fallback knowledge base or feed it into the AI prompt as context.

## Payments & Forms — Pending Integrations

Several features are intentionally stubbed with `TODO` comments until the church confirms providers:

- **Giving (`giving.html`)** — Bank transfer details are placeholders pending real account information from church administration. Online giving is disabled until Paystack, Flutterwave, or Stripe is integrated.
- **Books (`books.html`)** — Purchases currently route through WhatsApp with a prefilled message. Online checkout (Paystack/Flutterwave/Stripe) can replace this once a provider is selected.
- **Contact & Prayer Forms** — Forms currently validate client-side only. Connect them to a backend or a service like Formspree/EmailJS to receive real submissions.
- **Live Stream (`livestream.html`)** — Embeds the channel's live stream URL. For a specific broadcast, swap in the exact YouTube video ID, or integrate the YouTube Data API to auto-detect live status.

## Development

This is a static site — no build step is required.

```bash
npm install
npm run dev
```

This starts a local static file server on port 5000.

## Design System

See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for the full breakdown of colors, typography, spacing, buttons, cards, navbar rules, logo usage, and responsive guidelines.

## Credits

Designed by **peterlightspeed**.
