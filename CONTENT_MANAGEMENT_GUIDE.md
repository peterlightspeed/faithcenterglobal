# Content Management Guide (For Church Administrators)

This guide explains how to update the website's content — events, books, sermons, ministries, church info, and images — without needing to understand how the whole website works. All editable content lives in the `content/` folder as simple, clearly labeled files.

You do **not** need to touch any HTML, CSS, or design files to do the tasks below.

---

## Before You Start

- All content files are located in the `content/` folder.
- Each file starts with a comment block explaining what it's for.
- Always keep commas, quotation marks (`"`), and curly braces (`{ }`) exactly as they appear in the existing entries — copy an existing entry and edit its text rather than typing a new one from scratch.
- After saving any changes, refresh the website preview to confirm your update appears correctly.

---

## 1. Add a New Event

**File:** `content/events.js`

1. Open `content/events.js`.
2. Find the `window.EVENTS_DATA = [ ... ]` list.
3. Copy one existing event block (from `{` to `},`) and paste it just before the closing `];`.
4. Edit the fields in your new block:
   - `month` — short month label (e.g. `"Dec"`) or `"Every"` for recurring events.
   - `day` — day number (e.g. `"25"`) or short day label (e.g. `"Sun"`) for recurring events.
   - `title` — event name.
   - `badge` — small label shown on the card (e.g. `"Special"`, `"Weekly"`, `"Youth"`).
   - `time` — event time (e.g. `"10:00 AM"`).
   - `location` — where it's held.
   - `description` — one or two sentences about the event.
   - `special` — set to `true` for a highlighted/featured event styling, or `false` for a normal one.
5. Save the file. The event will automatically appear on the Events page.

---

## 2. Add a New Book

**File:** `content/books.js`

1. Open `content/books.js`.
2. Copy one existing book block and paste it before the closing `];`.
3. Edit the fields:
   - `title` — book title.
   - `author` — usually `"Pastor Godspower Opara Martins"`.
   - `price` — include the currency symbol (e.g. `"\u20A65,000"` is ₦5,000 — you can also just type `"₦5,000"` directly).
   - `cover` — path to the book cover image (see Section 3 below for how to add new images).
   - `categories` — space-separated tags controlling which filter tabs show the book: `featured`, `new`, `bestseller`, `prophetic`, `faith`.
   - `badge` — small label on the cover (e.g. `"New"`, `"Bestseller"`, `"Featured"`, or leave as `""` for none).
   - `whatsappNumber` — the WhatsApp number for purchase enquiries, digits only, no `+` or spaces (e.g. `"2348123456901"`).
4. Save the file.

---

## 3. Add New Images (Book Covers, Photos, Gallery)

**Folder:** `images/`

> Note: This website does not currently have a dedicated "Gallery" page or gallery section — if you'd like one added in the future, that would need to be built as a new feature. For now, images are used individually (pastor photos, book covers, background photos, logo).

To add a new image:

1. Save your image file (JPG or PNG works best) into the `images/` folder. Use a clear, lowercase, hyphenated filename, e.g. `new-book-cover.jpg` or `youth-summit-2026.jpg`.
2. Reference that filename in the relevant content file. For example, to use it as a book cover, set `cover: "images/new-book-cover.jpg"` in `content/books.js`.
3. Keep image file sizes reasonably small (ideally under 500KB) so pages load quickly. You can compress images using any free online image compressor before uploading.

---

## 4. Add a New Sermon

**File:** `content/sermons.js`

1. Open `content/sermons.js`.
2. Copy one existing sermon block and paste it before the closing `];`.
3. Edit the fields:
   - `title` — sermon title.
   - `category` — one of: `faith`, `prophetic`, `family`, `prayer` (controls which filter tab it appears under).
   - `scripture` — the Bible reference (e.g. `"John 3:16"`).
   - `watchUrl` — link to the YouTube video of the sermon (once available). Until you have a specific video link, you can leave it pointing to the channel: `"https://www.youtube.com/@TfcglobalTV"`.
   - `listenUrl` — same idea, for an audio-only link if you have one (otherwise reuse the same YouTube link).
4. Save the file.

---

## 5. Add New Ministry Information

**File:** `content/ministries.js`

1. Open `content/ministries.js`.
2. Copy one existing ministry block and paste it before the closing `];`.
3. Edit the fields:
   - `name` — ministry name (e.g. `"Media Ministry"`).
   - `icon` — an icon name from [Bootstrap Icons](https://icons.getbootstrap.com/) (e.g. `"bi-camera-video"`). Browse the site, click an icon, and copy its class name (the part starting with `bi-`).
   - `description` — one or two sentences describing the ministry.
4. Save the file.

---

## 6. Update Church Information (About, Vision, Mission, Pastor Name)

**File:** `content/church-info.js`

This file is the single source of truth for church-wide text used across multiple pages (homepage, About page, footer, etc.).

Editable fields:

- `name` / `shortName` — the church's full and short names.
- `tagline` — the short tagline shown near the church name.
- `pastor.name` / `pastor.title` — the lead pastor's name and title.
- `about` — the short "about" paragraph used on the homepage.
- `aboutExtended` — the longer "about" paragraph used on the About page.
- `belonging` — the "you belong here" paragraph.
- `welcomeStatement` — the short welcome banner text.
- `mandateStatement` — the paragraph describing the church's mandate.
- `mandate` — the list of mandate keywords (e.g. `["Reach", "Win", "Teach", "Train"]`).
- `vision.title` / `vision.statement` — the Vision heading and paragraph.
- `mission.title` / `mission.statement` — the Mission heading and paragraph.

Edit the text between the quotation marks for any field, keeping the quotation marks and commas in place. Since this file is shared across pages, updating it here updates the text everywhere it's used.

---

## 7. Replace Pastor Images

**Files affected:** `images/pastor-godspower.jpg` (used on the homepage hero and About page), and any book covers using the same image in `content/books.js`.

Steps:

1. Prepare the new photo. For best results, use a square-ish image at least 620×620 pixels.
2. Save it into the `images/` folder. You can either:
   - **Replace the existing file** — save your new photo with the exact same filename, `pastor-godspower.jpg`, overwriting the old one (simplest option — no other files need to change), or
   - **Add it as a new file** with its own name (e.g. `pastor-new-photo.jpg`), then update every place that currently references `images/pastor-godspower.jpg` (the homepage, About page, and any book cover entries in `content/books.js`) to point to the new filename.
3. Save and refresh the site to confirm the new photo appears correctly.

---

## Quick Reference Table

| I want to... | Edit this file |
|---|---|
| Add/update an event | `content/events.js` |
| Add/update a book | `content/books.js` |
| Add/update a sermon | `content/sermons.js` |
| Add/update a ministry | `content/ministries.js` |
| Update church name, pastor name, vision, mission, about text | `content/church-info.js` |
| Add a new image | Save into `images/`, then reference it in the relevant content file above |
| Replace the pastor's photo | `images/pastor-godspower.jpg` |

---

## A Note on Safety

These content files are plain data — think of them like a simple spreadsheet written in a slightly different format. As long as you:

- Keep every `{` matched with a `}`,
- Keep every `"` matched with a closing `"`,
- Keep commas between entries (but not after the very last one in a list),

...you can safely add, remove, or edit entries without breaking the website. If something looks visually broken after an edit, double-check that you haven't accidentally deleted a comma, quote mark, or bracket.
