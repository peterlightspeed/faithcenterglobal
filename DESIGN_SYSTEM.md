# TFCG Design System

This document defines the visual language for The Faith Centre Global (TFCG) website. Follow it when adding or editing pages so the site stays consistent.

## 1. Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `--tfcg-dark` | `#0A0D1A` | Primary background (hero, base) |
| `--tfcg-dark-2` | `#10142B` | Section background (alternating) |
| `--tfcg-dark-3` | `#161B38` | Section background (alternating) |
| `--tfcg-gold` | `#D4A017` | Primary accent, CTAs, headings, dividers |
| `--tfcg-blue` | `#1B2A6B` | Secondary accent, gradients |
| `--tfcg-red` | `#8B1E2D` | Alerts, "Special" badges |
| `--tfcg-white` | `#FFFFFF` | Headings, high-emphasis text |
| Secondary text | `rgba(255,255,255,0.65)` | Body copy on dark backgrounds |

Backgrounds alternate between `--tfcg-dark`, `--tfcg-dark-2`, and `--tfcg-dark-3` between sections to create depth without needing borders.

## 2. Typography

- **Display / Headings:** `Cinzel` and `Playfair Display` (serif, ceremonial) — used for `h1`–`h3`, hero titles, section titles.
- **Body / UI:** `Inter` (sans-serif) — used for paragraphs, buttons, navigation, forms.
- Section labels (small gold uppercase text above headings) use `Inter` at 600 weight, letter-spacing `1–2px`.
- Font sizes scale with `clamp()` for responsive hero/section titles (e.g. `clamp(2rem, 5vw, 3.5rem)`).

## 3. Spacing & Layout

- Base spacing unit: `1rem` (16px), scaled in multiples of 0.5rem.
- Sections use vertical padding of `5–7rem` on desktop, `3–4rem` on mobile.
- Content max-width follows Bootstrap's `.container` (1320px on xl).
- Grid: Bootstrap 5 grid system (`row`/`col-*`) with `g-4`/`g-5` gutter classes for card grids.

## 4. Radii & Shadows

- Cards, buttons, inputs: `--radius-md` (12px) or `--radius-lg` (18px) for larger panels (modals, glass cards).
- Circular elements (icons, avatars, scroll-top button): `border-radius: 50%`.
- Shadows are soft and gold-tinted on hover: `box-shadow: 0 10px 30px rgba(212,160,23,0.15)` — never harsh black drop shadows.

## 5. Buttons

- `.btn-primary` — solid gold-to-blue gradient or solid gold background, dark text, used for primary CTAs ("Join Us", "Submit", "Buy Now").
- `.btn-outline-gold` — transparent background, gold border/text, used for secondary actions ("Learn More", "Explore").
- `.btn-watch-live` — pill-shaped with a pulsing `.live-dot` red indicator, reserved for the livestream CTA in the navbar.
- All buttons have visible `:focus-visible` outlines for accessibility and a subtle lift/scale on hover.

## 6. Card System

A single card language is reused across the site with contextual variants:

- `.glass-card` — base translucent card (frosted glass effect) used for generic content blocks, vision/mission, testimonials, forms.
- `.ministry-card` — icon-topped card with hover accent bar, used on the Ministries page.
- `.sermon-card` — thumbnail + category tag + meta, used on the Sermons page.
- `.event-card` / `.event-card-horizontal` — date block + body layout, used on the Events page.
- `.giving-method-card` — icon + description, used on the Giving page (`.featured` variant highlights one option).
- `.book-card` — cover image + badge + price + Buy Now button, used on the Books page.
- `.testimonial-card` — quote icon + avatar + author, used for testimonials.

All cards share: consistent internal padding (`1.5–2.5rem`), a `1px` translucent border, rounded corners, and a hover state that lifts the card slightly and brightens the border to gold.

## 7. Navbar

- Fixed to top, transitions from transparent to solid dark background with a shadow once the user scrolls (`.navbar-scrolled` state, handled in `script.js`).
- Logo uses the `.navbar-logo` class — fixed height (52px), never stretched, always paired with the wordmark logo image (not text).
- Active page link is underlined in gold (`.nav-link.active`).
- "Watch Live" is always the last nav item, styled as a distinct pill button with a pulsing dot — it must never be a plain text link.
- Mobile: collapses into Bootstrap's offcanvas-style toggle; nav items stack vertically with generous tap targets (min 44px height).

## 8. Logo Usage Rules

- Always use `images/tfcg_logo.png` (transparent background) for the navbar and footer.
- Never place the logo directly on a light/white background — it is designed for dark backgrounds only.
- Minimum clear space around the logo: half the logo's own height on all sides.
- Do not recolor, rotate, or add effects (drop shadows, outlines) to the logo.

## 9. Animations

- Scroll-reveal entrance animations via AOS (`data-aos="fade-up"`, `fade-left`, `fade-right`) on section content — subtle, ~600ms duration, no bounce/elastic easing.
- Counters (stats strip) animate numerically from 0 to their target when scrolled into view.
- `.live-dot` uses a soft pulsing opacity/scale animation (`~1.5s` loop) to indicate "live" status.
- Hover transitions on cards/buttons use `transition: all 0.3s ease` — avoid abrupt state changes.
- Respect `prefers-reduced-motion`: animations should degrade gracefully (no motion-sickness-inducing effects).

## 10. Responsive Guidelines

- Design mobile-first; test at 320px, 375px, 768px, 1024px, 1440px, and ultrawide (1920px+).
- Hero sections stack image below text on screens narrower than `lg` (992px).
- Card grids collapse from 3–4 columns → 2 columns (`md`) → 1 column (`sm`/`xs`).
- Font sizes use `clamp()` so headings scale fluidly instead of jumping at breakpoints.
- Touch targets (buttons, nav links, form controls) are never smaller than 44×44px on mobile.
- The WhatsApp float button and scroll-to-top button reposition to avoid overlapping on small screens.

## 11. Accessibility Standards

- All interactive elements have visible focus states and descriptive `aria-label`s where text is not self-explanatory (icon-only buttons/links).
- Color contrast between text and backgrounds meets WCAG AA (gold-on-dark and white-on-dark combinations were chosen to pass this).
- Every page includes a skip-to-content link and a logical heading hierarchy (single `h1` per page).
- Forms use associated `<label>` elements and `required`/`aria-*` attributes; validation errors are announced, not just shown visually.

## 12. Content & Copy Rules

- No emoji, no placeholder Latin text ("Lorem ipsum"), no references to the development platform used to build the site.
- Any feature that is not yet wired to a real backend/service is marked with an explicit `TODO` HTML comment describing what needs to be connected (e.g., payment processors, forms, maps).
- Author attribution defaults to "Pastor Godspower Opara Martins" unless a book explicitly credits another author.
