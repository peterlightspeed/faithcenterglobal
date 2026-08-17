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

---

## Changelog — livestream Channel ID fix

- **Livestream embed was using the wrong identifier.** YouTube's
  "always show whatever is live on this channel" embed
  (`youtube.com/embed/live_stream?channel=...`) requires the channel's
  **Channel ID** (a `UC...` string) — it does not accept the `@handle`
  that was previously configured in `config/livestream.json`
  (`channelHandle`) and hardcoded into both `index.html` and
  `livestream.html`'s static iframe `src`. As configured, the embed
  would not have worked.
- Added a `channelId` field to `config/livestream.json` (left empty —
  needs the church's real Channel ID, see `LIVESTREAM_GUIDE.md`).
  `channelHandle` is kept as a human-readable fallback link.
- `renderLivestream()` in `js/render.js` now uses `channelId` for the
  embed, and — while it's empty — shows a friendly "Watch on YouTube"
  card instead of a broken/blank player. It upgrades automatically the
  moment `channelId` is filled in.
- Removed the broken static `src` from both iframes in the HTML (JS now
  fully owns setting it, consistent with the rest of the CMS).
- Rewrote `LIVESTREAM_GUIDE.md` — it previously told admins to hand-edit
  `livestream.html` directly (pre-dating the JSON-CMS refactor) and
  repeated the same Channel ID/handle mistake throughout. Also clarified
  that the embed does not show YouTube comments or likes, and that
  behavior is identical whether viewed in a browser or as the installed
  PWA. Updated `CONTENT_SCHEMA.md`'s `config/livestream.json` reference
  to match.


---

## Changelog — PWA fix, new logo, Dark Mode, Appointments page, service schedule update

The largest round of changes since the initial CMS refactor. No rebuild, no removed features — same structure, JSON content system, and GitHub Pages compatibility throughout.

### 1. PWA / installability bug (root cause found and fixed)

`site.webmanifest` had `start_url` and `scope` hardcoded to
`/faithcenterglobal/` — a leftover from early scaffolding. Every other
absolute reference in the project (canonical URLs, `sitemap.xml`,
`robots.txt`) assumes root-level hosting at `https://tfcglobal.org/`.
That mismatch pointed the manifest's start_url at a path that doesn't
exist on the real site, which silently fails Chrome's install
eligibility check. Fixed by changing both to `"."` (relative to the
manifest's own location), so it self-adapts correctly no matter where
the site ends up hosted.

Also found and fixed a secondary issue: the manifest icons used a
combined `"purpose": "any maskable"` string with no safe-zone padding —
Android's circular/squircle icon mask would have cropped straight
through the crest. Split into separate `any` and dedicated,
properly-padded `maskable` icon entries.

### 2. New official logo

The uploaded logo was a photorealistic 3D wall-mounted render (glossy
bevels, shadows, a textured background) — not usable directly as a
navbar/favicon asset. Processed it into:
- A clean, background-removed **crest-only mark** (`images/tfcg_logo.png`)
  used for the navbar, footer, and every favicon/app icon — matches the
  existing icon-only convention and stays legible at small sizes.
- A **full crest + wordmark lockup** (`images/tfcg_logo_full.png`) used
  for the new Open Graph share image.

Every icon file was regenerated from this new source under the *same
filenames* the whole site already referenced (favicon 16/32, `.ico`
with 4 embedded resolutions, Apple touch icon, Android 192/512,
dedicated safe-zone-padded maskable 192/512, SVG favicon, OG image), so
navbar, footer, structured data, and the manifest all updated
automatically with zero broken references. Cache-busting query strings
on every favicon/manifest link were bumped (`?v=3`) and the service
worker cache version bumped, so browsers and existing installs actually
pick up the new logo instead of serving a stale cached one.

### 3. Dark Mode

Built a full light/dark theming system — a genuinely distinct light
palette (warm off-white surfaces, deep navy text, the same gold/blue/red
brand accents, softer shadows), not a simple color inversion.

**Architecture:** semantic CSS variables (`--bg-primary`,
`--bg-secondary`, `--text-primary`, `--text-secondary`,
`--border-subtle`, `--card-bg`, `--modal-bg`, `--nav-link-color`,
`--tfcg-gold-text`, etc.) defined once in `:root` (current dark values)
and redefined under `[data-theme="light"]`. Brand colors (gold, blue,
red) stay constant — only backgrounds, text, borders, and shadows
change. Converted every major surface: body, navbar (including the
mobile dropdown), sections, glass cards, footer, forms, modals, the FAQ
accordion (including its chevron icon, which was invisible against the
dark theme using Bootstrap's default dark-icon SVG), and the chat
assistant panel.

**Toggle & persistence:** a sun/moon button in the navbar on all 11
pages (`js/theme.js`) that persists the visitor's choice to
`localStorage`, follows the OS-level `prefers-color-scheme` live until
they make an explicit choice, and updates its icon/label/`aria-pressed`
state. A tiny synchronous inline script at the very top of every page's
`<head>` applies the saved/system theme before anything paints, so
there's no flash of the wrong theme on load.

**Real bugs found and fixed during implementation** (verified with a
real headless Chromium instance + computed-style contrast checks, not
just visual inspection):
- Five components — `.btn-primary` (the site's main button, used
  everywhere), `.badge-blue`, `.badge-red`, the sermon category tag, and
  a chat message bubble — had text color bound to the theme-swapping
  `--text-primary` variable while sitting on a *constant* brand-color
  background. In light mode this produced dark-navy-on-blue and
  dark-navy-on-red text. Fixed all five to literal white, since their
  backgrounds never change between themes.
- The navbar's link color and the mobile dropdown's background were
  both hardcoded to near-white/dark-navy values regardless of theme —
  in light mode, nav links became nearly invisible (light text on a
  light background). Fixed with new theme-aware variables.
- The homepage hero and every interior page's banner (`.hero-section`,
  `.page-hero`, `.livestream-hero`) have a permanently-dark photo/gradient
  background by design (for text legibility over the photo), but their
  text had no explicit color and was inheriting the theme-swapping body
  color — in light mode, hero titles rendered as dark text on a dark
  background, nearly unreadable. Pinned these three to explicit white
  text, matching their permanently-dark backgrounds.
- Gold text (`color: var(--tfcg-gold)`) on the new light background
  measured **2.18:1 / 2.38:1 contrast** — well under WCAG AA's 4.5:1
  minimum for text. Computed an accessible deepened gold
  (`--tfcg-gold-text: #8a6108`, ~5:1 against the light background) and
  converted ~50 text-color usages to it, while deliberately keeping
  `.hero-label`, `.hero-badge`, and `.pastor-name-tag` on the original
  bright gold since those sit on permanently-dark backgrounds regardless
  of theme.
- The chat assistant's input area and two informational banners
  (announcement bar, "form not configured" notice) had hardcoded
  dark-background/cream-text colors left over from before the panel
  itself became theme-aware — in light mode these produced light text on
  a near-white background. Fixed all three.

**Deliberately kept theme-independent:** the install banner, its "How
do I install" tutorial modal tabs, and the floating WhatsApp/scroll-top/
assistant-toggle buttons stay a consistent dark treatment in both
themes, similar to how many apps keep system-style toasts/notifications
visually consistent regardless of the page's theme — a reasonable,
common pattern rather than an oversight.

### 4. New Appointments page (`appointments.html`)

New JSON-consistent page (added to nav + footer on all pages, sitemap,
service worker cache, and the chat assistant) with a form covering all
8 requested categories (Counseling, Pastoral Meeting, Prayer Session,
Deliverance, Marriage Counseling, Family Counseling, Baby Dedication
Consultation, General Enquiry) plus name, email, phone, preferred
date/time, and an optional message. The date field can't be set to a
past date. Wired to the provided Formspree endpoint.

### 5. Formspree integration — and a real pre-existing bug found

Wired the contact form and new appointment form to
`https://formspree.io/f/xaewwdqy` via `config/forms.json`. **While doing
this, found that every form on the site (contact, both prayer forms)
had `id` attributes but no `name` attributes** — since `FormData` only
captures fields with a `name` attribute, every submission would have
gone out completely empty regardless of which endpoint was configured.
Fixed all three existing forms plus the new appointment form, and added
a `_gotcha` honeypot field to each for basic spam protection (Formspree
auto-discards submissions where it's filled in, without emailing).

### 6. Service schedule update

Rebuilt `content/services.json` with the full new schedule (First/
Second Service, Moment of Grace, Prayer Foyer, Midweek Service,
Breakthrough Service, Spiritual Week of Empowerment), added a
`frequency` field for the "every 3rd Sunday" / "monthly" recurring
programs and a `showInFooter` flag so the footer only shows the core
weekly services rather than every program. Updated `content/events.json`
to match, and also caught and fixed the **old** schedule still
hardcoded in three other places that don't come from `services.json`:
the static footer fallback text on every page (added for a previous
layout-shift fix, before this schedule existed), an FAQ answer, and the
chat assistant's own knowledge base (`js/church-data.json`).

### 7. YouTube Channel ID

Added the real Channel ID (`UCjxlXbR47Gg304KQH-uYFsQ`) to
`config/livestream.json`, replacing the placeholder empty value from the
previous round's fix.

### Testing performed this round

All JSON/JS files re-validated after every change; HTML `<div>` balance
and CSS brace balance re-checked across all 11 pages; a full end-to-end
headless-Chromium test suite (using the actual Chromium binary bundled
with a local tool, not just jsdom) that: screenshotted both themes on
multiple pages, verified `localStorage` theme persistence across page
navigation, and programmatically computed WCAG contrast ratios for
body text, buttons, nav links, and labels in light mode using the real
browser's computed styles — catching all the contrast bugs listed above
before they shipped.

### Remaining manual tasks (in addition to earlier rounds' list)

- Confirm the church's actual bank details are filled into
  `content/giving.json` (still shows placeholder — unrelated to this
  round, carried over from earlier).
- Review the new logo crop/processing and swap in a professionally
  vectorized version later if the church commissions one — the current
  version is a high-quality raster extraction from the supplied photo,
  not a true vector file.
- Consider having the church provide a square, transparent-background
  master logo file in the future to avoid needing this kind of
  background-removal processing again.

---

## Changelog — bug hunt round (navbar, filters, contrast, new content, animation)

This round used a real headless Chromium instance (not just static
analysis) loaded with the actual Bootstrap/AOS libraries, so JS-driven
behavior (menu toggling, filter clicks, tab switching) could be tested
directly rather than inferred from code review alone.

**Navbar — two real, separate bugs found and fixed:**
1. Nav link text and the mobile dropdown background were bound to the
   theme-swapping `--nav-link-color` variable everywhere, but the
   navbar is transparent and sits directly over this page's
   permanently-dark hero photo until the visitor scrolls. In light
   mode, at the top of any page, nav links rendered as dark navy text
   over a dark photo — barely visible. Fixed by keeping nav links a
   constant light color while the navbar is transparent, and only
   switching to the theme-aware color once the navbar has its own
   solid background (`.scrolled`) — where a second bug was hiding: the
   scoping selector had `.navbar-dark` and `.navbar.scrolled` in the
   wrong order (`.navbar.scrolled .navbar-dark ...`), but `.navbar-dark`
   is a class on `<body>`, the *ancestor* of `<nav>`, not a descendant
   of it — so the rule could never match. Corrected to
   `.navbar-dark .navbar.scrolled ...`.
2. Mobile-menu bullet points: `<li class="nav-item">` items were
   rendering visible list-marker dots despite Bootstrap's own
   `.navbar-nav { list-style: none }` computing correctly per
   `getComputedStyle` — bullets were still painting. Root cause wasn't
   fully isolated (reproducible only in the full page, not in a minimal
   reproduction), so fixed defensively by re-asserting
   `list-style: none` on `.navbar-nav`/`.nav-item` directly in our own
   stylesheet, which loads last and is guaranteed to win.

**Media Centre filters were completely broken — real root cause found:**
`js/script.js` called `TFCG_setupFilters()` unconditionally at
`DOMContentLoaded`, which runs *before* `content-loader.js`'s fetch
resolves. On Books/Sermons (whose filter-tab buttons are static HTML)
this was harmless. On the Media page, the category buttons are
*generated from JSON* — so this first, premature call only found the
static "All" button, wired it, and marked the whole filter group as
"already wired" (a dataset flag meant to prevent double-binding). When
`render.js` later built the real category buttons and called
`TFCG_setupFilters()` again (the correct, intended call), the group was
skipped because it was already marked wired — leaving every
dynamically-created filter button with no click handler at all. Fixed
by removing the premature `DOMContentLoaded` call entirely;
`render.js` already calls this function once, at the correct time,
after all content (and any dynamic filter buttons) exists.

**Widespread invisible-text bug (`.text-white`):** Bootstrap's
`.text-white` utility (`color: white !important`) was used ~40 times
across `appointments.html`, `contact.html`, `giving.html`,
`livestream.html`, `sermons.html`, and several card templates in
`js/render.js` — form headings, labels, card titles — all inside
theme-aware content areas. In light mode every one of these became
invisible white-on-near-white text. Fixed by overriding `.text-white`
itself (after Bootstrap loads) to use `--text-primary`, which already
equals near-white in dark mode (zero regression there) and the correct
dark navy in light mode. One resulting edge case was fixed by hand: the
Live Stream page's H1 sits inside `.livestream-hero`, a section
deliberately pinned to permanent white text (dark background in both
themes) — removed its now-redundant-and-conflicting `.text-white` class
so it doesn't fight the parent's forced white.

**Contact page and Live Stream page** — investigated directly per report.
Both pages' underlying configuration and rendering were verified
correct: the contact form has all required `name` attributes and posts
to the configured Formspree endpoint; the live player embeds the real
YouTube Channel ID (`UCjxlXbR47Gg304KQH-uYFsQ`). The `.text-white`
bug above was actually the visible symptom on both pages (illegible
headings) — now fixed. Actual network calls to `formspree.io` and
`youtube.com` couldn't be exercised end-to-end in this sandbox (both
domains are outside its network allowlist), so final confirmation of
live form delivery and video playback needs a check on the real
deployed site — but every piece of code and configuration feeding them
has been verified correct.

**Books — reduced visible titles.** Added a `"published"` field to
`content/books.json` (`true`/`false`) and updated `renderBooks()` to
skip unpublished ones. Set 3 of 8 books to `published: false` — kept in
the file, not deleted, so they can be turned back on any time. This is
the same pattern as `showInFooter` on services — hide-without-delete
rather than a true HTML comment, since JSON has no comment syntax.

**New: interactive homepage animation.** Added `js/hero-particles.js` —
a small Canvas 2D animation of soft golden light motes drifting upward
through the homepage hero, gently drawn toward the visitor's cursor
within a limited radius. No dependencies, respects
`prefers-reduced-motion`, pauses when the tab isn't visible, and only
activates if its canvas element exists (safe to include broadly).

**Testing method this round:** installed real Bootstrap/AOS/Bootstrap
Icons via npm and used Puppeteer's request interception to serve them
locally (this sandbox blocks the actual jsdelivr CDN), so JS-driven
interactions could be tested against the genuine libraries rather than
guessed at. Verified: every filter tab on Books/Sermons/Media actually
filters (not just that buttons exist); nav link computed color at all
four theme×scroll-state combinations; the text-white fix in both
themes with no dark-mode regression; the published-books count;
zero console/page errors from the new animation. One caveat: Bootstrap
Icons' font glyphs didn't render inside this specific interception
setup (a CORS/opaque-response quirk of intercepting cross-origin font
requests, not a real site issue — icons load normally from the actual
CDN in production, which is how this exact setup already runs
reliably on countless sites), so icon *rendering* specifically wasn't
visually confirmed this round, only the surrounding layout/color logic.

---

## Changelog — AOS robustness, free replay videos, screenshot investigation

**Robustness fix: content no longer depends on a third-party CDN
loading successfully.** AOS's own CSS hides every `[data-aos]` element
(which includes the entire homepage hero and large parts of every other
page) until its JS explicitly reveals it. If `aos.js` ever fails to
load — CDN hiccup, ad blocker, restrictive network — those elements
would stay invisible forever, since nothing else adds the reveal class.
Added a safety net in `js/script.js`: shortly after page load, anything
still hidden gets force-revealed regardless of whether AOS actually
initialized. Belt-and-braces — doesn't change normal behavior at all,
only prevents a total content blackout if the animation library alone
fails.

**Investigated a visual artifact from a user screenshot** showing
blurred, ghosted content overlapping the footer on the Appointments
page. Measured the actual gap between page content and the footer in a
real browser: **0px** — no structural bug. The artifact is consistent
with a known interaction between `position: fixed` elements (the
install banner, which uses `backdrop-filter: blur()`) and full-page
"stitched" screenshot tools, which can bake a fixed element into the
image at an intermediate scroll position. Not reproducible during
normal interactive scrolling; no code change was needed.

**New: free video replay ("Watch Previous Messages") on the Live
Stream page.** Previously, whenever the church wasn't live, visitors
just saw a static "Currently Offline" message with no video at all.
Added a second embed below the schedule — YouTube gives every channel
an automatic "Uploads" playlist (its ID is simply the Channel ID with
`UC` swapped for `UU`), which `js/render.js` now derives automatically
from `config/livestream.json` → `channelId` (already set) and embeds.
This is entirely free (no API key, no paid tier), requires zero manual
setup, and updates itself automatically every time a new video is
uploaded to the channel. Documented in `LIVESTREAM_GUIDE.md`, new
section 7.

**Form error handling improved.** `wireForm()` in `js/render.js` now
surfaces the actual reason a Formspree submission was rejected (to the
console, and where possible to the person filling out the form)
instead of one generic failure message for every possible cause —
makes real issues (e.g. an unconfirmed Formspree form, which requires
clicking a one-time confirmation link sent to the form owner's email
before it starts accepting submissions) actually diagnosable instead of
just looking broken with no clue why.
