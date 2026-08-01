# AI Handoff — JSON-CMS Refactor

Summary of the refactor performed on the TFCG website: turning a static
HTML site (with some content already split into JS data files) into a
fully JSON-driven mini-CMS, while keeping it 100% static, framework-free,
and GitHub Pages-compatible.

## Summary of Changes

**New content layer** — 14 files in `content/` (church, services, events,
books, sermons, testimonies, ministries, leadership, gallery, giving,
livestream, faqs, announcements, settings), replacing the old
`content/*.js` hardcoded data files and all inline HTML content for
these sections.

**New config layer** — 8 files in `config/` (payments, forms, emailjs,
analytics, social, seo, livestream, app) for settings that change rarely.
All integration configs (`payments.json`, `forms.json`, `emailjs.json`,
`analytics.json`) ship with `enabled: false` and empty strings — no fake
placeholder URLs anywhere.

**New JS engine:**
- `js/content-loader.js` — fetches every JSON file, exposes
  `window.TFCG_CONTENT` / `window.TFCG_CONFIG`, fires `tfcg:content-ready`.
- `js/render.js` — one reusable rendering module covering every page.
  Every render function starts with a container existence check, so this
  single file is safe to include everywhere.
- `js/pwa.js` + `sw.js` — install banner (with localStorage dismissal),
  platform-specific tutorial modal, and a minimal offline-caching service
  worker.
- `js/script.js` — refactored so navbar/counter/filter/search logic
  tolerates content that loads asynchronously (it previously assumed
  everything was already in the DOM at `DOMContentLoaded`). Exposes
  `window.TFCG_setupFilters()` and `window.TFCG_setupCounters()` so
  `render.js` can re-run them after injecting new markup.

**HTML changes across all 9 pages:**
- Hardcoded content removed and replaced with empty containers (books,
  events, sermons, ministries, testimonies, gallery, FAQs, leadership,
  giving, church info, service times, the homepage hero/"featured
  message") — all now rendered from JSON by `render.js`.
- Added: announcement bar container, FAQ accordion section (new, on
  Contact), photo gallery section (new, on About).
- Script tags updated: removed `content/church-info.js` /
  `content/books.js` / `content/events.js` / `content/ministries.js` /
  `content/sermons.js` / `content/render.js`; added
  `js/content-loader.js`, `js/render.js`, `js/pwa.js`.
- Forms (`prayerForm`, `modalPrayerForm`, `contactForm`) rewired to a
  shared `wireForm()` in `render.js` that reads `config/forms.json` and
  shows a friendly "not configured yet" message when no endpoint is set,
  instead of a fake success animation.
- Footer, WhatsApp float link, and social icons converted to shared
  render functions reading `content/church.json` + `config/social.json`
  so they only need to be defined once.

**PWA improvements** — install banner with dismissal memory
(`config/app.json`), in-app install tutorial modal (Android/iOS/Desktop
tabs), and a new minimal service worker (`sw.js`) caching the app shell
while always fetching `content/`/`config/` JSON fresh from the network.

**Cleanup performed:**
- Deleted old `content/*.js` hardcoded data files (superseded by JSON).
- Deleted duplicate `manifest.webmanifest` (unused — `site.webmanifest`
  is the one actually linked from every page).
- Deleted duplicate root `favicon.svg` (unused — `public/favicon.svg` is
  the one referenced).
- Deleted duplicate `images/tfcg_logo.jpg` (unused — `.png` version is
  referenced everywhere).
- Deleted duplicate `public/robots.txt` (unused — root `robots.txt`,
  which also declares the sitemap, is the one crawlers actually read).

**Documentation rewritten/added:**
- `README.md` — updated for the new architecture.
- `CONTENT_MANAGEMENT_GUIDE.md` — fully rewritten, beginner-friendly,
  file-by-file walkthroughs.
- `CONTENT_SCHEMA.md` — new, full field reference for every JSON file.
- `FUTURE_SUPABASE.md` — new, migration roadmap and table sketches.
- `INSTALL_APP_GUIDE.md` — new, PWA install walkthrough per platform.
- `ROADMAP.md` — new, future features by effort tier.
- `AI_HANDOFF.md` — this file.
- `DESIGN_SYSTEM.md` and `LIVESTREAM_GUIDE.md` reviewed — no stale
  references found, left as-is.

## Testing performed

- All 22 JSON files (`content/`, `config/`) validated with `json.load()`.
- All new/edited JS files validated with `node --check`.
- `<div>` open/close tag counts verified balanced across all 9 HTML
  pages.
- **End-to-end headless smoke test**: served the site with a local HTTP
  server and loaded every page in `jsdom` with real script execution
  (`content-loader.js` → `render.js` → the actual JSON files over
  `fetch`). Confirmed every dynamic container on every page
  (hero, stats, service times, ministries preview, testimonials, about
  story, vision/mandate, statement of faith, leadership, gallery,
  ministries grid, sermons grid, events list, books grid, giving methods,
  bank details, giving button, contact info, FAQs, livestream iframe +
  schedule, footer social) filled with real rendered content — not just
  syntax-checked in isolation.
- CDN-hosted CSS/JS (Bootstrap, AOS, Google Fonts) couldn't load inside
  the sandboxed test environment (network restrictions) — this affects
  only the *test*, not the site; those assets load normally over the
  public internet for real visitors.

## Assumptions made

- Church contact details (address, phone, email, WhatsApp, bank name
  "pending") were carried over verbatim from the original hardcoded HTML
  — no new information was invented.
- The photo gallery (new section) reuses three images already present in
  `images/` (`congregation.jpg`, `pastor-godspower.jpg`, `hero-bg.jpg`),
  since no dedicated gallery photos existed yet — replace these with real
  event/service photos via `content/gallery.json` whenever convenient.
- FAQs (new section) were authored based on information already present
  elsewhere on the site (service times, location, livestream, prayer
  requests, ministries, giving) — review and edit their wording via
  `content/faqs.json`.
- `js/church-data.json` (the separate knowledge base for the floating
  Ministry Assistant widget) was left untouched and NOT merged into the
  new `content/` folder, since it already worked well as a self-contained
  JSON file and merging it would risk breaking the assistant if any
  `content/*.json` file were ever temporarily malformed. It currently
  duplicates some of the same facts (address, service times, etc.) now
  also in `content/church.json` / `content/services.json` — see Roadmap
  note below.

## Remaining manual tasks for the church

1. **Real bank details** — `content/giving.json` → `bankDetails` still
   has `"bankName": "To be provided by church administration"` and
   `"accountNumber": "Pending"`. Fill these in via
   `CONTENT_MANAGEMENT_GUIDE.md`.
2. **Formspree** — connect `config/forms.json` to activate real form
   submissions (currently shows a friendly "not configured" message).
3. **Paystack** — connect `config/payments.json` to activate online
   giving buttons.
4. **Real gallery photos** — replace the three placeholder gallery
   entries in `content/gallery.json` with real event/service photography.
5. **Review the new FAQ copy** in `content/faqs.json` for tone/accuracy.
6. **Set `content/announcements.json` → `"enabled": true`** whenever
   there's something to announce (Communion Sunday, conference, etc.).

## Where future integrations should be configured

All covered in **CONTENT_SCHEMA.md** and **ROADMAP.md** — in short:
Paystack → `config/payments.json`; Formspree → `config/forms.json`;
EmailJS → `config/emailjs.json` (not wired into any form yet — see
Roadmap); Google Analytics / Microsoft Clarity → `config/analytics.json`
(IDs stored but tracking script not auto-injected yet — see Roadmap);
social links → `config/social.json`; livestream embed →
`config/livestream.json`; install banner copy → `config/app.json`.

## Suggestions for future enhancement

- Consolidate `js/church-data.json` (assistant widget) with
  `content/church.json` / `content/services.json` so facts are edited in
  exactly one place — currently they're duplicated by design for
  resilience, but a small `content-loader.js` addition could have the
  assistant read from `window.TFCG_CONTENT` once loaded, falling back to
  its own file if the CMS hasn't finished loading yet.
- See `ROADMAP.md` for the full list (Easy/Medium/Advanced), and
  `FUTURE_SUPABASE.md` for how prayer requests, member-submitted
  testimonies, and an admin dashboard could work without abandoning the
  static-site approach for everything else.

---

## Changelog — 2026-07-31 round (bug fixes + Media Centre)

A second pass, addressing specific bugs plus one new feature, all on top
of the JSON-CMS refactor above. No rebuild/redesign — same structure,
branding, and tech stack throughout.

**Fixes:**
1. **Pastor hero image** — removed a `mix-blend-mode: luminosity` +
   `opacity: 0.85` combo in `css/style.css` that was dimming/blueing the
   homepage and About-page pastor photos. Replaced with natural colors
   and a subtle hover zoom.
2. **Back-to-Top button** — root cause found: on mobile,
   `.assistant-toggle` was hardcoded to `bottom: 100px` while
   `.scroll-top-btn` stayed at the desktop value (`98px`), so the two
   buttons sat almost exactly on top of each other. Rebuilt the whole
   floating button stack (WhatsApp / Back-to-Top / Assistant) on shared
   CSS variables (`--float-base`, `--float-gap`, `--wa-size`,
   `--scroll-size`, `--assistant-size`) in `css/style.css` so spacing is
   guaranteed consistent at every screen size, plus `env(safe-area-inset-*)`
   support. `js/pwa.js` now also measures the install banner's real
   height and exposes it as `--install-banner-height`, so the whole
   button stack shifts up automatically while the banner is visible
   instead of being covered by it.
3. **Contact page map** — replaced the "Map view available upon
   request" placeholder with a real, responsive Google Maps
   `output=embed` iframe (no API key required). Driven by a new
   `contact.mapEmbedUrl` field in `content/church.json`, rendered by
   `renderContactInfo()` in `js/render.js`.
4. **Homepage contact/footer overlap** — diagnosed from screenshots as a
   layout-shift bug: the footer's JSON-rendered containers
   (`footer-tagline`, `footer-social`, `footer-service-times`,
   `footer-address`, `footer-ministry-statement`) started **empty** in
   the HTML and only filled in after the content JSON finished loading,
   causing a visible pop-in/reflow right under the homepage prayer form
   that looked like ghosted, overlapping content. Fixed by giving all 9
   (now 10) pages real static fallback text in those containers so
   `render.js` refreshes them seamlessly instead of filling a blank —
   this was a shared footer bug, so fixing it once fixed every page.
5. **Favicon** — found the actual bug: `public/favicon.svg` was a
   placeholder orange rounded square (`#FF3C00`), completely unrelated
   to the church logo, and browsers prefer SVG favicons over PNG when
   both are declared — so it was silently overriding the correct PNG/ICO
   icon set (which already matched the crest logo colors and were left
   untouched). Regenerated `favicon.svg` from the real logo
   (`images/tfcg_logo.png`) and added `?v=2` cache-busting query strings
   to every favicon/manifest link across all pages so browsers pick up
   the fix without requiring visitors to manually clear their cache.
6. **Footer credit** — now reads "Website designed and maintained by
   **Peter Lightspeed**" as a clickable link to
   `https://peterlightspeed.github.io/portfolio`, opening in a new tab
   with `target="_blank" rel="noopener noreferrer"`. Driven by
   `church.json` → `footer.credit` / `footer.creditUrl`.
7. **Image audit** — checked every image reference against files on
   disk: no broken paths, no unused files, no missing `loading="lazy"`
   on below-the-fold images. Found and fixed one real issue: the footer
   logo `<img>` on every page was missing `width`/`height` attributes
   (a CLS risk) — added `width="48" height="48" loading="lazy"`
   everywhere to match its CSS size.

**New feature — Media Centre (`media.html`):**

A new JSON-driven page with three tabs — **Photos**, **Videos**, and
**News & Updates** — added to the navbar (after Books) and footer
Quick Links on every existing page.

- `content/gallery.json` — enriched with `title`, `date`, `description`,
  `category` fields (previously just `image`/`caption`/`alt`; those are
  kept as fallbacks so the existing About-page gallery still works
  unchanged). Powers the **Photos** tab, with category filter tabs built
  automatically from whatever categories appear in the data, and a
  full lightbox (prev/next buttons + arrow-key navigation) built with a
  Bootstrap modal.
- `content/videos.json` — new file. Powers the **Videos** tab as
  sermon-card-style thumbnails; clicking one opens an inline YouTube
  player in a modal if a `youtubeId` is set, or opens `youtubeUrl` in a
  new tab otherwise (no real video IDs were available yet, so this
  degrades gracefully instead of embedding something broken).
- `content/updates.json` — new file. Powers the **News & Updates** tab
  as a card grid (title, date, category, cover image, summary); "Read
  More" opens the full write-up in a modal. Sample entries were written
  based on the examples given (pastor's birthday, conference
  announcement, prayer walk, new book release, thanksgiving recap) —
  review/replace the wording via `content/updates.json` before
  publishing.
- All three tabs reuse the same generic `[data-filter-group]` filter-tab
  mechanism already used on the Books/Sermons pages (`js/script.js` →
  `TFCG_setupFilters()`), so category filtering works identically to the
  rest of the site with no new JS pattern to maintain.
- Rendering logic lives in `js/render.js` (`renderMediaPhotos()`,
  `renderMediaVideos()`, `renderMediaUpdates()`), called from the
  existing `renderAll()` — no new script tags or loading pattern
  introduced.
- Full SEO: unique meta title/description, canonical URL, Open Graph +
  Twitter Card tags, and `BreadcrumbList` + `CollectionPage` structured
  data. Added to `sitemap.xml` and to the `sw.js` offline app-shell
  cache list.
- **Future-ready comments** are left directly in `media.html` (News &
  Updates tab) and in this file describing exactly how to evolve it into
  a full blog later — individual post URLs, pagination, tag/category
  filtering (the mechanism already exists), and search (reusing the
  `[data-search-target]` pattern from the Books/Sermons pages) — without
  changing the current visual design.

**Testing performed this round:** all JSON files re-validated; all
edited/new JS files re-checked with `node --check`; `<div>` tag balance
re-verified across all 10 pages; re-ran the full headless jsdom
smoke test (real `content-loader.js` → `render.js` execution against the
live JSON over `fetch`) across all 10 pages, confirming every dynamic
container — including the three new Media Centre grids and their filter
tab bars — renders real content end-to-end.

**Remaining manual tasks (in addition to the ones listed above):**
- Add real `youtubeId` values to `content/videos.json` once specific
  sermon/event videos are chosen (currently degrade to "open on
  YouTube").
- Replace the sample photos in `content/gallery.json` and the sample
  write-ups in `content/updates.json` with real church media — the
  current entries reuse the three existing stock photos and are meant as
  realistic starting examples, not final content.
- Confirm `https://peterlightspeed.github.io/portfolio` is the correct,
  live portfolio URL before publishing.

---

## Changelog — review pass (SEO/consistency audit)

A short audit pass across the whole project looking for drift and
inconsistencies introduced by the previous rounds, with no new features.

- **Twitter Card tags** — found that only `index.html` (and the new
  `media.html`) had complete `twitter:title` / `twitter:description` /
  `twitter:image` tags; the other 8 pages only had `twitter:card`.
  Fixed by mirroring each page's own `og:title`/`og:description`.
- **`og:site_name`** — same gap, only `index.html` had it. Added
  consistently to all 10 pages.
- **Stale address text** — the previous round updated the address
  wording in `content/church.json` but missed three other places it was
  hardcoded: the static `Church` JSON-LD structured data in
  `index.html`'s `<head>`, `content/faqs.json`, and
  `js/church-data.json` (the assistant widget's own knowledge base, in
  two places). All four now match.
- **Install banner z-index** — was set higher (1300) than Bootstrap's
  default modal stack (1055), meaning it could render on top of an open
  modal (the photo lightbox, video player, or even the pre-existing
  install-guide modal). Lowered it below the modal stack and added JS in
  `js/pwa.js` to actively hide the banner while any modal is open, as a
  second layer of defense.
- **Assistant widget didn't know about the Media Centre** —
  `js/church-data.json`'s keyword-matched FAQ list had no entry for
  "photos" / "videos" / "gallery" / "media" / "news", so asking the chat
  widget about any of those returned the generic fallback instead of
  pointing to `media.html`. Added a matching FAQ entry, a "Media"
  quick-reply button, and the missing `media` key in the (currently
  unused, kept for data completeness) internal pages map.
- **Media Centre filter buttons** — `buildCategoryFilterButtons()` in
  `js/render.js` was appending category buttons without ever clearing
  previous ones, which would have silently duplicated buttons if content
  is ever re-rendered without a full page reload in the future. Made
  idempotent.

Re-validated all JSON/JS syntax and re-ran the full headless smoke test
across all 10 pages after these fixes — all pass.


