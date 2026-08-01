# Installing the TFCG App

The Faith Centre Global website is a **Progressive Web App (PWA)** — you
can install it to your phone or computer's home screen/app list like a
regular app, with no app store required. Once installed, it opens in its
own window (no browser address bar), gets an icon on your home screen,
and loads faster since core pages are cached for offline use.

The site itself shows an install banner automatically (see
`config/app.json` → `installBanner` to customize or disable it), with a
"How do I install?" option that opens the walkthrough below in-app. This
document is the same walkthrough in written form.

## Android (Chrome)

1. Open **tfcglobal.org** in Chrome.
2. Tap the **⋮** menu icon in the top-right corner.
3. Tap **Install app** (sometimes labeled "Add to Home screen").
4. Confirm by tapping **Install**.
5. Find the TFCG icon on your home screen or app drawer.

*Tip: if you don't see "Install app" in the menu, the site may need a
few seconds to finish loading first — try again after the page fully
loads.*

## iPhone / iPad (Safari)

Apple requires this to be done manually through Safari's Share menu —
there is no "Install" button on iOS.

1. Open **tfcglobal.org** in **Safari** (this must be Safari, not Chrome
   — Chrome on iOS cannot install web apps).
2. Tap the **Share** icon (a square with an arrow pointing up) in the
   toolbar.
3. Scroll down the share sheet and tap **Add to Home Screen**.
4. Edit the name if you like, then tap **Add** in the top-right corner.
5. Find the TFCG icon on your home screen.

## Desktop (Chrome or Edge)

1. Open **tfcglobal.org** in Chrome or Edge.
2. Look for the **install icon** in the address bar (a small monitor
   with a down-arrow), or open the **⋮** menu.
3. Click **Install The Faith Centre Global** (or **Apps → Install this
   site as an app**).
4. Confirm by clicking **Install**.
5. The app opens in its own window and is added to your Start
   Menu/Applications/Dock.

## Frequently asked questions

**Does it cost anything?** No — this is just the website running in an
app-like window. There's no app store, no download size to speak of, and
nothing to buy.

**Will I still see new content?** Yes. Pages themselves are cached for
speed, but all content (events, sermons, books, etc.) is always fetched
fresh from the JSON files, so you'll always see the latest updates.

**How do I uninstall it?** Same as any app — long-press the icon
(mobile) or right-click it (desktop) and choose Uninstall/Remove.

**I dismissed the install banner — can I install later?** Yes, anytime,
using the steps above. Dismissing the banner just hides it for about two
weeks (configurable in `config/app.json` →
`installBanner.dismissRemembersDays`).
