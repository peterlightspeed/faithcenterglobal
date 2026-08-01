# Content Schema Reference

This document describes every JSON file in `/content` and `/config`, what
each field means, and a working example. If you only need step-by-step
instructions (no schema detail), see **CONTENT_MANAGEMENT_GUIDE.md**
instead — this file is the technical reference.

General rules for every file:

- Files must stay valid JSON — every string in double quotes, no trailing
  commas. If a page looks broken after an edit, you likely broke the JSON.
  Paste the file into [jsonlint.com](https://jsonlint.com) to check it.
- Currency values (e.g. book prices) are plain strings so you can format
  them however you like (`"₦5,000"`).
- Icons use [Bootstrap Icons](https://icones.js.org/collection/bi) class
  names, e.g. `"bi-heart"`. Browse the full set and copy the class name.
- Every file is loaded by `js/content-loader.js` and turned into markup by
  `js/render.js`. If a page doesn't show your change, hard-refresh the
  browser (JSON is fetched with `cache: no-cache`, but browser/CDN caches
  can still linger).

---

## content/church.json

Core identity, homepage hero, about-page text, and contact details used
across the whole site (footer, contact page, etc.)

| Field | Type | Description |
|---|---|---|
| `name`, `shortName`, `tagline`, `foundingYear` | string/number | Basic identity |
| `hero` | object | Homepage hero: `label`, `title`, `subtitle`, `primaryButtonLabel`, `primaryButtonLink`, `secondaryButtonLabel`, `secondaryButtonLink`, `image`, `imageAlt`, `imageCaption` |
| `stats` | array | Homepage stat counters: `{ target, suffix, label }` |
| `about`, `aboutExtended`, `belonging` | string | About paragraphs (short home summary + full about-page story) |
| `welcomeStatement`, `mandateStatement` | string | Supporting copy used in various sections |
| `mandate` | array of strings | Short mandate words (Reach, Win, Teach, Train) |
| `vision` | object | `{ title, icon, statement }` |
| `mission` | object | `{ title, icon, statement }` |
| `statementOfFaith` | array of strings | Each belief statement, rendered as a numbered list |
| `contact` | object | `addressLines` (array), `addressSingleLine`, `email`, `phoneDisplay`, `phoneE164`, `whatsappNumber`, `mapEmbedUrl` (Google Maps embed URL shown on the Contact page) |
| `footer` | object | `tagline`, `ministryStatement`, `copyrightYear`, `copyrightName`, `credit` (designer name), `creditUrl` (link the designer credit points to) |

```json
{
  "name": "The Faith Centre Global",
  "hero": {
    "title": "Welcome to The Faith Centre Global",
    "subtitle": "A Word of Faith, Prophetic, and Apostolic Church...",
    "primaryButtonLabel": "Join Us This Sunday",
    "primaryButtonLink": "about.html",
    "image": "images/pastor-godspower.jpg",
    "imageAlt": "Pastor Godspower ministering",
    "imageCaption": "Pastor Godspower Opara Martins"
  },
  "stats": [{ "target": 300, "suffix": "+", "label": "Members" }],
  "contact": { "email": "tfcglobal48@gmail.com", "phoneE164": "+2348123456901" }
}
```

## content/services.json

Array of weekly service times. Used on the homepage, footer, and
livestream page.

| Field | Description |
|---|---|
| `id` | Unique short id |
| `name`, `subtitle` | Display name and short description |
| `day`, `time`, `timeWithZone` | Scheduling info |
| `icon` | Bootstrap icon class |
| `featured` | `true` to highlight this service with a gold border on the homepage |

```json
{ "id": "sunday-second", "name": "Sunday Second", "subtitle": "Second Celebration Service", "day": "Sunday", "time": "10:30 AM", "timeWithZone": "10:30 AM (WAT)", "icon": "bi-brightness-high", "featured": true }
```

## content/events.json

Array of events shown on `events.html`.

| Field | Description |
|---|---|
| `month`, `day` | Shown in the date badge (use `"Every"` / `"Sun"` for recurring events) |
| `title` | Event name |
| `badge` | Small label, e.g. `"Weekly"`, `"Special"`, `"Youth"` |
| `time`, `location` | Details line |
| `description` | Body text |
| `special` | `true` gives the card a gold-highlighted border |

## content/books.json

Array of books for `books.html`. Buy buttons open WhatsApp with a
pre-filled message.

| Field | Description |
|---|---|
| `title`, `author`, `price`, `cover` | Book details (`cover` is an image path) |
| `categories` | Space-separated tags used by the filter tabs, e.g. `"bestseller faith"` |
| `badge` | `"Featured"`, `"New"`, `"Bestseller"`, or `""` for none |
| `whatsappNumber` | Number (no `+` or spaces) the buy button messages |

## content/sermons.json

Array of sermons for `sermons.html`.

| Field | Description |
|---|---|
| `title`, `scripture` | Sermon title and reference text |
| `category` | Used by filter tabs: `faith`, `prophetic`, `family`, `prayer`, etc. |
| `watchUrl`, `listenUrl` | External links (usually YouTube) |
| `featured` | Reserved for future use (e.g. highlighting a message of the week) |

## content/ministries.json

Array of ministries for `ministries.html`, and the homepage preview.

| Field | Description |
|---|---|
| `name`, `icon`, `description` | Ministry card content |
| `featuredOnHome` | `true` to include in the homepage's 3-card preview |

## content/testimonies.json

Array of testimonials shown on the homepage.

| Field | Description |
|---|---|
| `text` | The testimonial quote |
| `author`, `role` | Attribution, e.g. `"Adaeze O."`, `"Member since 2021"` |

## content/leadership.json

Array of leadership/staff profiles (currently just the lead pastor —
add more objects to list additional staff).

| Field | Description |
|---|---|
| `name`, `title` | Person's name and role |
| `image`, `imageAlt` | Photo |
| `isLead` | `true` for the senior/lead pastor (reserved for future styling) |
| `bio` | Array of paragraph strings |

## content/gallery.json

Array of photos. Powers both the small photo gallery on the About page
and the **Photos tab** on the Media Centre page (`media.html`).

| Field | Description |
|---|---|
| `image`, `alt` | Image path and alt text |
| `title` | Short photo title, shown on hover and in the lightbox |
| `date` | `YYYY-MM-DD` — shown in the lightbox and used to sort/label |
| `caption` | Short caption (legacy field, still used as a fallback if `title`/`description` are missing) |
| `description` | Longer text shown in the lightbox below the photo |
| `category` | Powers the category filter tabs on the Media Centre page, e.g. `"Services"`, `"Conferences"`, `"Outreach"`, `"Youth"`, `"Children"`, `"Worship"`, `"Baptism"`, `"Thanksgiving"`, `"Community"` — use any label you like, filter tabs are generated automatically from whatever categories appear in this file |

Set `content/settings.json` → `features.showGallery` to `false` to hide
the About-page gallery section without deleting the data (this does not
affect the Media Centre page).

## content/videos.json

Array of videos for the **Videos tab** on the Media Centre page.

| Field | Description |
|---|---|
| `title`, `date`, `description` | Video details |
| `category` | Powers the category filter tabs, same idea as `gallery.json` |
| `youtubeUrl` | Link to the video (or channel, if you don't have a direct video link yet) |
| `youtubeId` | The YouTube video ID (the part after `v=` in a YouTube URL, or after `youtu.be/`). **Leave this blank until you have a specific video** — without it, clicking the card just opens `youtubeUrl` in a new tab instead of playing inline. Once you add a real `youtubeId`, the card automatically plays the video in a popup player. |
| `thumbnail` | Optional — leave blank to auto-use the video's YouTube thumbnail (once `youtubeId` is set) or a default church photo. |

## content/updates.json

Array of news/announcement posts for the **News & Updates tab** on the
Media Centre page — birthdays, conferences, outreach recaps, new book
releases, thanksgiving services, etc.

| Field | Description |
|---|---|
| `title`, `date`, `category` | Post details. `category` powers the filter tabs. |
| `coverImage` | Optional image shown at the top of the card |
| `summary` | Short 1–2 sentence teaser shown on the card |
| `content` | The full text shown when someone clicks "Read More". Separate paragraphs with a blank line (`\n\n` in the JSON) and each becomes its own paragraph. |

This is intentionally structured like a simple blog — see
**FUTURE_SUPABASE.md** and the `FUTURE (blog-ready)` comment in
`media.html` for how this could grow into a full blog (individual post
URLs, pagination, tags, search) without changing the current design.

## content/faqs.json

Array of question/answer pairs rendered as an accordion on the Contact
page.

| Field | Description |
|---|---|
| `question` | Shown as the clickable accordion header |
| `answer` | Shown when expanded |

Controlled by `content/settings.json` → `features.showFAQs`.

## content/announcements.json

A single object (not an array) controlling the gold announcement bar
at the very top of every page.

| Field | Description |
|---|---|
| `enabled` | `true`/`false` — the bar is hidden whenever this is `false` |
| `message` | The announcement text |
| `linkLabel`, `linkUrl` | Optional call-to-action link |
| `style` | Reserved for future color variants |

## content/giving.json

Single object powering `giving.html`.

| Field | Description |
|---|---|
| `heroTitle`, `heroVerse`, `intro` | Page header copy |
| `methods` | Array of `{ title, icon, description, featured }` cards |
| `bankDetails` | `{ accountName, bankName, accountNumber }` |
| `note` | Small print shown under the (currently disabled) online-giving button |

The **online giving button itself** is controlled separately by
`config/payments.json` (see below) — it stays disabled until Paystack is
switched on there.

## content/livestream.json

Single object with the on-page copy for `livestream.html` (the
*technical* embed settings — channel handle, video id — live in
`config/livestream.json` instead, since those change far less often).

| Field | Description |
|---|---|
| `liveNowLabel`, `subscribeLabel` | Player header text |
| `offlineTitle`, `offlineMessage` | "Currently Offline" card copy |
| `offlineButtonPrimaryLabel` / `Link`, `offlineButtonSecondaryLabel` / `Link` | The two buttons on that card |

## content/settings.json

Site-wide feature toggles and formatting defaults.

| Field | Description |
|---|---|
| `features.showAnnouncementBar` | Master switch for the announcement bar (still requires `announcements.json.enabled: true`) |
| `features.showGallery` | Show/hide the About page gallery |
| `features.showFAQs` | Show/hide the Contact page FAQ accordion |
| `features.showInstallBanner` | Show/hide the "Install the App" banner |
| `features.showAssistant` | Reserved — the assistant widget currently always loads via `js/assistant.js` |
| `dateFormat`, `currency`, `currencySymbol` | Reserved for future use |

---

# /config — settings you rarely change

## config/payments.json — Paystack (not yet integrated)

```json
{
  "paystack": {
    "enabled": false,
    "publicKey": "",
    "titheLink": "",
    "offeringLink": "",
    "seedLink": "",
    "buildingLink": "",
    "missionLink": ""
  }
}
```

Set `enabled: true` and paste real Paystack payment page links to
automatically activate the "Give Online" buttons on `giving.html` — no
HTML edits required. See the `TODO (Paystack)` comment in `giving.html`
and in `js/render.js` (`renderGiving`) for exactly where this is read.

## config/forms.json — Formspree (not yet integrated)

```json
{
  "contactForm": { "provider": "formspree", "endpoint": "" },
  "prayerRequest": { "provider": "formspree", "endpoint": "" }
}
```

Paste your Formspree form endpoint URL (e.g.
`https://formspree.io/f/xxxxabcd`) into `endpoint` to activate real
submissions for the Contact form or either prayer-request form. Until
then, submitting shows a friendly "not yet configured" message instead of
pretending to succeed.

## config/emailjs.json — EmailJS (not yet integrated)

```json
{ "enabled": false, "serviceID": "", "templateID": "", "publicKey": "" }
```

Reserved for a future EmailJS integration as an alternative/backup to
Formspree. Not wired into any page yet.

## config/analytics.json — Google Analytics & Microsoft Clarity

```json
{
  "googleAnalytics": { "enabled": false, "measurementId": "" },
  "microsoftClarity": { "enabled": false, "projectId": "" }
}
```

Not yet wired into the page `<head>`. See **ROADMAP.md** for the
activation steps once you have real IDs.

## config/social.json

```json
{
  "youtube": "https://www.youtube.com/@TfcglobalTV",
  "facebook": "https://web.facebook.com/profile.php?id=61572908337081",
  "whatsapp": "https://wa.me/2348123456901",
  "instagram": "",
  "tiktok": "",
  "x": ""
}
```

Leave a platform blank (`""`) to hide its icon everywhere automatically
(footer + contact page).

## config/seo.json

```json
{
  "siteUrl": "https://tfcglobal.org",
  "defaultTitleSuffix": "The Faith Centre Global",
  "defaultDescription": "...",
  "ogImage": "public/opengraph.jpg",
  "twitterHandle": "",
  "themeColor": "#0d0d0d"
}
```

Reference values for future SEO automation. Per-page `<title>`,
`<meta description>`, and Open Graph tags are still set directly in each
HTML file's `<head>` (this keeps search engines seeing final, static
values with zero JavaScript dependency — see **ROADMAP.md** for a note on
why this wasn't made fully dynamic).

## config/livestream.json

```json
{
  "provider": "youtube",
  "channelHandle": "TfcglobalTV",
  "embedMode": "channel",
  "videoId": "",
  "autoplay": false
}
```

`embedMode: "channel"` shows whatever is currently live (or the latest
upload) on the given `channelHandle`. Switch to `embedMode: "video"` and
fill in `videoId` to pin one specific broadcast.

## config/app.json — PWA / install banner

```json
{
  "appName": "The Faith Centre Global",
  "shortName": "TFCG",
  "installBanner": {
    "enabled": true,
    "title": "Install the TFCG App",
    "message": "Add The Faith Centre Global to your home screen...",
    "installButtonLabel": "Install",
    "dismissButtonLabel": "Not now",
    "dismissRemembersDays": 14
  }
}
```

See **INSTALL_APP_GUIDE.md** for how the banner behaves on each platform.
