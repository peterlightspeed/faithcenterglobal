# Future: Powering TFCG with Supabase

This site is intentionally 100% static today — no backend, no database,
no build step — so it stays free to host (GitHub Pages) and simple to
maintain via JSON files. This document sketches how **Supabase** could
later replace the JSON files for content that benefits from being
user-submitted, moderated, or queried (prayer requests, testimonies) —
**without doing any of this integration now.**

## Why Supabase (eventually)

- Free tier is generous for a church-sized site.
- Gives you a real Postgres database, authentication, storage (for
  images), and auto-generated REST/JS APIs — without running your own
  server.
- Row Level Security (RLS) lets you keep submissions private until a
  staff member approves them.

## What could move to Supabase, and why

| Feature | Why Supabase helps |
|---|---|
| **Prayer requests** | Currently emailed via Formspree. A `prayer_requests` table would let staff mark requests as "prayed for," keep a private history, and avoid relying on email. |
| **Testimonies** | Let members submit their own testimony through a form; an admin approves it before it appears on the homepage — instead of you hand-editing `testimonies.json`. |
| **Books** | If the bookstore grows beyond a handful of titles, a `books` table with an admin UI beats hand-editing JSON, and can track inventory. |
| **Events** | Recurring event patterns, RSVP counts, and past-event archiving are much easier in a real table than a flat JSON array. |
| **Gallery** | Supabase Storage can host and resize images directly, instead of committing image files to the repo. |
| **Admin dashboard** | A small authenticated page where staff edit all of the above without touching GitHub or JSON at all. |
| **Authentication** | Needed to gate the admin dashboard, and optionally to let members log in for RSVPs or a members' area. |

## Recommended table sketch (for later)

```sql
-- Prayer requests submitted through the site
create table prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  request text not null,
  is_confidential boolean default false,
  status text default 'new', -- new | praying | answered | archived
  created_at timestamptz default now()
);

-- Member-submitted testimonies, pending approval
create table testimonies (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  role text,
  text text not null,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Bookstore
create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  price numeric,
  cover_url text,
  categories text[],
  badge text,
  in_stock boolean default true
);

-- Events
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  location text,
  description text,
  is_special boolean default false
);

-- Gallery
create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  caption text,
  alt_text text,
  sort_order int default 0
);

-- Admin users (church staff)
create table admin_users (
  id uuid primary key references auth.users(id),
  full_name text,
  role text default 'editor' -- editor | admin
);
```

## Migration roadmap (when you're ready)

1. **Stand up a Supabase project.** Create the tables above (start with
   just `prayer_requests` — the highest-value, lowest-risk table).
2. **Add the Supabase JS client** to the site (`@supabase/supabase-js`
   via a CDN `<script>` tag — no build step needed, matching the current
   "no framework" constraint).
3. **Point one form at Supabase instead of Formspree** — e.g. change the
   prayer form's submit handler in `js/render.js` to `insert()` into
   `prayer_requests` instead of (or in addition to) posting to Formspree.
4. **Build a minimal admin page** (`admin.html`, gated by Supabase Auth)
   that lists and updates rows — starting read-only, then adding
   edit/approve actions.
5. **Migrate one content type at a time** from JSON to Supabase, keeping
   the JSON file as a fallback until the table is proven out. For
   example: keep shipping `content/testimonies.json` as-is, but also
   read approved rows from the `testimonies` table and merge them at
   render time.
6. **Only after the above is solid**, consider member authentication,
   RSVP counts, or inventory tracking.

## What NOT to do yet

- Don't put Paystack **secret** keys or Supabase **service role** keys in
  any client-side file — those must live server-side (a Supabase Edge
  Function, not a static HTML page).
- Don't migrate everything at once. JSON files are working today; treat
  Supabase as an additive upgrade for the specific features above where
  it genuinely helps, not a rewrite.
