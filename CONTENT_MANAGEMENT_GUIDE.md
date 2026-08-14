# Content Management Guide

**Welcome!** This guide is written for someone who knows almost nothing
about code. Almost everything on the TFCG website — books, events,
sermons, ministries, testimonies, gallery photos, FAQs, leadership bios,
giving info, service times, the homepage message, and more — now lives in
small text files called **JSON files**, inside two folders:

- **`content/`** — things you'll change often (new book, new event, new
  sermon...)
- **`config/`** — things you'll rarely touch (payment links, social media
  URLs, analytics IDs)

You should almost never need to open an `.html` file again. Just open the
right `.json` file, make your change, and save.

> ⚠️ **The one rule that matters:** JSON is picky about punctuation. Every
> piece of text must be wrapped in double quotes `"like this"`, and every
> item in a list needs a comma after it **except the last one**. If the
> website stops updating after you save, you probably have an extra or
> missing comma or quote somewhere. Paste the file into
> [jsonlint.com](https://jsonlint.com) — it will point out exactly what's
> wrong.

## How to edit a file

1. On GitHub, click into the `content` (or `config`) folder and open the
   file you want (e.g. `books.json`).
2. Click the pencil icon (✏️) in the top-right to edit.
3. Make your change (see examples below).
4. Scroll down and click **"Commit changes"**.
5. If the site is hosted on GitHub Pages, your change goes live within a
   minute or two — just refresh the page.

---

## Adding a Book

Open `content/books.json`. You'll see a list of books that looks like
this:

```json
{ "title": "Faith That Moves Mountains", "author": "Pastor Godspower Opara Martins", "price": "₦4,000", "cover": "images/pastor-godspower.jpg", "categories": "faith", "badge": "", "whatsappNumber": "2348123456901" }
```

**To add a new book:**

1. Copy one of the existing `{ ... }` book entries.
2. Paste it right before the closing `]` at the bottom of the file, and
   add a comma after the entry right above it.
3. Change:
   - `title` — the book's name
   - `author` — usually "Pastor Godspower Opara Martins"
   - `price` — e.g. `"₦5,000"`
   - `cover` — path to the cover image (upload the image to the `images`
     folder first, then use `"images/your-file-name.jpg"`)
   - `categories` — words separated by spaces, e.g. `"new faith"` (used by
     the filter buttons on the Books page)
   - `badge` — `"New"`, `"Bestseller"`, `"Featured"`, or `""` for none
4. Save. Done — the new book appears on the Books page automatically.

**To temporarily hide a book** (out of stock, no longer available, etc.)
without deleting its entry, set `"published": false` on that book. Set
it back to `true` whenever you want it to reappear.

## Adding an Event

Open `content/events.json`, copy an existing entry, and change `title`,
`month`, `day`, `time`, `location`, and `description`. Set `"special":
true` to give it a gold-highlighted card (good for a big annual event).

## Adding/Editing a Ministry

Open `content/ministries.json`. Copy an entry, change `name`,
`description`, and `icon` (browse icon names at
[icones.js.org/collection/bi](https://icones.js.org/collection/bi)). Set
`"featuredOnHome": true` if you want it to also show in the 3-card
preview on the homepage.

## Adding a Sermon

Open `content/sermons.json`. Copy an entry, change `title`, `scripture`,
`category` (used for the filter tabs — pick from `faith`, `prophetic`,
`family`, `prayer`, or add your own), and paste the YouTube link into
both `watchUrl` and `listenUrl`.

## Adding a Testimony

Open `content/testimonies.json`. Copy an entry, change `text` (the
quote), `author`, and `role` (e.g. `"Member since 2024"`).

## Adding/Editing Leadership (Pastors & Staff)

Open `content/leadership.json`. Copy the existing pastor entry, change
`name`, `title`, `image`, and `bio` (this is a **list** of paragraphs —
add or remove `"..."` lines inside the `bio: [ ]` brackets, one per
paragraph).

## Adding Gallery Photos

Open `content/gallery.json`. Upload your photo to the `images` folder
first, then add an entry:

```json
{ "image": "images/your-photo.jpg", "title": "Sunday Worship", "date": "2026-08-02", "description": "A description shown in the photo lightbox.", "category": "Services", "alt": "Description for screen readers" }
```

This same file powers both the small photo strip on the About page and
the **Photos tab** on the Media Centre page — you only ever need to edit
it in one place. The `category` you choose (e.g. `"Services"`,
`"Youth"`, `"Outreach"`) automatically becomes a filter button on the
Media Centre page — no extra setup needed.

To hide the About-page gallery without deleting your photos, open
`content/settings.json` and set `"showGallery": false` (this doesn't
affect the Media Centre page).

## Adding a Video to the Media Centre

Open `content/videos.json`, copy an entry, and change `title`, `date`,
`description`, and `category`. For `youtubeUrl`, paste the video's
YouTube link.

If you want the video to **play directly on the site** (in a popup),
also fill in `youtubeId` — this is the part of the YouTube URL after
`v=` (or after `youtu.be/` for short links). For example, in
`https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`.
Leaving `youtubeId` blank is fine too — visitors will just be taken to
YouTube directly when they click the video instead.

## Adding a News & Updates Post

Open `content/updates.json`, copy an entry, and change:

- `title`, `date`, `category`
- `coverImage` — optional photo shown at the top of the card
- `summary` — a short 1–2 sentence teaser shown on the card itself
- `content` — the full write-up shown when someone clicks "Read More."
  To start a new paragraph, press Enter twice in the JSON (a blank
  line) — each blank-line-separated chunk becomes its own paragraph.

Good use cases: pastor's birthday, an upcoming conference, a prayer
walk, a new book release, a thanksgiving service recap — anything
you'd post as a church announcement.

## Adding the Map to the Contact Page

The Contact page map is controlled by `content/church.json` →
`contact.mapEmbedUrl`. The default value already points at the church
address. If the church ever moves, get a new embed link by:

1. Go to [Google Maps](https://maps.google.com) and search the new
   address.
2. Copy the page URL, or use
   `https://www.google.com/maps?q=YOUR+ADDRESS+HERE&output=embed`
   (replace spaces with `+`).
3. Paste it into `mapEmbedUrl` in `content/church.json`. Save — done.

## Adding/Editing FAQs

Open `content/faqs.json`. Copy an entry, change `question` and `answer`.
New questions appear at the bottom of the list on the Contact page (in
the order they appear in the file).

## Turning an Announcement On/Off

Open `content/announcements.json`:

```json
{
  "enabled": false,
  "message": "Join us this Sunday for a special Communion Service.",
  "linkLabel": "Learn More",
  "linkUrl": "events.html"
}
```

Set `"enabled": true` to show a gold banner at the top of every page.
Change `message` to whatever you want to say. Set it back to `false` (or
just leave it) when the announcement is no longer relevant.

## Updating Service Times

Open `content/services.json`. Change the `time` and `timeWithZone`
fields for the service that changed. This one file updates the
homepage, the footer on every page, and the Live Stream page schedule
all at once.

Each entry also has:
- `frequency` — a short label shown as a badge (e.g. `"Weekly"`,
  `"Monthly Program"`, `"Recurring Special Service · Every 3rd Sunday"`)
- `showInFooter` — set to `false` to keep a program off the (space-
  limited) footer while still showing it everywhere else on the site;
  the core weekly services default to `true`

To add a brand-new recurring service or program (not just change a
time), copy an existing entry and edit `id`, `name`, `subtitle`, `day`,
`time`, `timeWithZone`, `icon`, `frequency`, `featured`, and
`showInFooter`.

## Replacing the Church Logo

The logo appears in the navbar, footer, every favicon size, PWA/app
icons, and the site's structured data — but all of these point at the
same two files, so replacing the logo is just swapping those files:

1. **`images/tfcg_logo.png`** — the square crest mark used in the
   navbar and footer. Should be a clean, square image (ideally with a
   transparent background) — this is what shows at small sizes, so avoid
   fine detail or text that won't read clearly at ~50px.
2. **`images/tfcg_logo_full.png`** — the wider crest + wordmark version
   used for the Open Graph share image (what shows when the site is
   shared on social media).

After replacing those two files, regenerate the favicon/app icon set
from the new `tfcg_logo.png` (favicon 16×16, 32×32, `.ico`, Apple touch
icon, Android 192×192/512×512, and the maskable variants in
`images/icons/`, plus `public/favicon.svg`) — these can't simply be
resized copies pasted in by hand without checking they still look right
cropped to a circle/square at each size. If you're not comfortable
generating these yourself, ask whoever maintains the site's code to
run it through an image processing step, or use a favicon generator
tool and place the output files at the same paths.

Finally, bump the `?v=` cache-busting number at the end of every
favicon/manifest link (search all `.html` files for `favicon.svg?v=`)
so browsers don't keep showing the old cached icon — increase it by 1
from whatever it currently is.

## Updating Church Information (address, phone, email, about text)

Open `content/church.json`. The fields you'll touch most:

- `contact.addressLines`, `contact.email`, `contact.phoneDisplay`,
  `contact.phoneE164` — used in the footer and Contact page
- `about`, `aboutExtended`, `belonging` — the About page story
- `hero` — the homepage's big welcome message

## Updating the Featured (Homepage) Message

The homepage welcome text and photo are the `hero` section inside
`content/church.json`. Change `hero.title`, `hero.subtitle`,
`hero.image`, and `hero.imageCaption`.

## Updating Giving / Bank Details

Open `content/giving.json` and edit `bankDetails.accountName`,
`bankName`, and `accountNumber`. To turn on online giving buttons, see
"Connecting Payments (Paystack)" below instead — that lives in
`config/payments.json`, not here, since it's a setting you'll set once
and rarely touch again.

---

## Connecting Your Forms (Formspree)

The Contact form and the Appointments form are already connected to a
Formspree endpoint and will email submissions to whoever manages that
Formspree account. The Prayer Request forms (on the homepage and the
Contact page) currently show a friendly "this form isn't set up yet"
message instead, since no endpoint has been configured for them yet.

1. Create a free account at [formspree.io](https://formspree.io) and set
   up a form — Formspree gives you an endpoint URL like
   `https://formspree.io/f/xxxxabcd`.
2. Open `config/forms.json`.
3. Paste that URL into `"endpoint"` under `contactForm` (Contact page),
   `appointmentForm` (Appointments page), and/or `prayerRequest` (both
   prayer forms).
4. Save. Forms now email you their submissions — no code changes needed.

You can point every form at the same Formspree endpoint (they'll all
land in one inbox, each labeled by its `_subject` field so you can tell
them apart) or give each its own endpoint for separate inboxes —
whichever you prefer.

## Setting Up the Live Stream

The Live Stream page and homepage player are meant to automatically show
whatever is currently live on the church's YouTube channel — no weekly
updates needed. This requires the channel's **Channel ID** (a long
`UC...` string), not the `@handle` you normally use to find the channel.
YouTube's "always show what's live on this channel" embed only works
with the Channel ID.

**To find your Channel ID:**

1. Go to [youtube.com/account_advanced](https://www.youtube.com/account_advanced)
   while signed in to the church's YouTube account.
2. Copy the "Channel ID" shown there (starts with `UC`).
3. Open `config/livestream.json` and paste it into `"channelId"`.
4. Save. The live player now automatically shows whatever the channel is
   streaming, live, without any further updates.

Until `channelId` is filled in, the player shows a friendly "Watch on
YouTube" button instead of a broken embed — it upgrades automatically
once the Channel ID is added.

**A few things to know:**

- The stream must be set to **Public** (not Unlisted or Private) for the
  embed to work.
- The embed is just the video player — it does **not** show YouTube's
  comments or likes (those only exist on the YouTube watch page itself).
  If people want to comment or like the stream, they can tap through to
  YouTube directly using the "Subscribe"/"Watch on YouTube" links already
  on the page.
- This works exactly the same whether someone is viewing the website in
  a browser or as the installed app (PWA) — it's the same embedded
  player either way, no extra setup needed for the app.
- To feature one specific past broadcast instead of "whatever is live
  right now," set `"embedMode": "video"` and paste that video's ID into
  `"videoId"` in `config/livestream.json`.

## Connecting Online Giving (Paystack)

1. Create a Paystack account and generate **Payment Page** links for
   Tithe, Offering, and Seed (or whichever you want to accept online).
2. Open `config/payments.json`.
3. Set `"enabled": true` and paste each link into `titheLink`,
   `offeringLink`, `seedLink`, etc.
4. Save. The "Give Online" buttons on the Giving page switch on
   automatically.

## Turning On Analytics

Open `config/analytics.json`. Set `"enabled": true` and paste your
Google Analytics Measurement ID or Microsoft Clarity Project ID. See
**ROADMAP.md** for the one-time code snippet a developer will need to add
to activate tracking (this file just stores the IDs; the tracking script
itself isn't wired in yet, to avoid loading tracking scripts nobody has
approved).

## Updating Social Media Links

Open `config/social.json` and paste your profile URLs. Leave any field
blank (`""`) to hide that icon everywhere on the site.

---

## Dark Mode

There's nothing to configure here — the site automatically supports
both light and dark themes, and visitors switch between them using the
sun/moon button in the navbar. Their choice is remembered automatically.
This isn't something you manage through content files; it's built into
the site's design system. If you ever want to change how a color looks
in one theme vs. the other, that's a code-level change in
`css/style.css` — ask whoever maintains the site's code rather than
looking for it here.

## Getting Help

If something looks broken after an edit and you can't tell why:

1. Undo your last change (GitHub keeps every previous version — open the
   file's "History").
2. Check your edit against [jsonlint.com](https://jsonlint.com).
3. See **CONTENT_SCHEMA.md** for the exact fields every file expects.
