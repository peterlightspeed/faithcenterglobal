# Live Stream Guide (For Church Administrators)

This guide explains — in plain language — how the Live Stream player on
the website works, and how to manage it. You do **not** need to know how
to code to follow these steps. All settings live in one file:
`config/livestream.json`.

---

## 1. How It Works

The Live Stream page (`livestream.html`) and the homepage both embed a
YouTube player pointed at TFCG's YouTube **channel**, not one fixed
video. Because it points at the channel rather than a specific video, it
automatically shows whatever the channel is currently streaming live —
**for a normal Sunday or Wednesday service, you do not have to touch
anything.** As soon as the church goes live on YouTube, it appears on
the website automatically.

⚠️ **Important technical detail:** to make this work, YouTube requires
your channel's **Channel ID** — a long code starting with `UC` — not
your `@handle` (the `@TfcglobalTV`-style name people use to find the
channel). The handle does not work for this specific embed, even though
it works almost everywhere else on YouTube.

### Getting your Channel ID

1. Sign in to the church's YouTube account and go to
   [youtube.com/account_advanced](https://www.youtube.com/account_advanced).
2. Copy the "Channel ID" shown there (starts with `UC`).
3. Open `config/livestream.json` and paste it into `"channelId"`.
4. Save.

Until `channelId` is filled in, visitors see a friendly "Watch on
YouTube" button instead of a broken player — it upgrades automatically
the moment you add the Channel ID, no other changes needed.

---

## 2. Featuring One Specific Video Instead

There may be times you want the website to show **one specific video**
instead of "whatever is live on the channel" — for example, to highlight
a special conference recording.

1. Go to the YouTube video you want to feature.
2. Copy its Video ID — the part after `v=` in the normal video URL.
   Example: in `https://www.youtube.com/watch?v=ABC12345XYZ`, the ID is
   `ABC12345XYZ`.
3. Open `config/livestream.json`.
4. Set `"embedMode": "video"` and paste the ID into `"videoId"`.
5. Save.

**To go back to automatic live detection**, set `"embedMode": "channel"`
again (you can leave `videoId` filled in — it's only used when
`embedMode` is `"video"`).

---

## 3. What Visitors See When Nothing Is Live

Regardless of whether the channel embed shows a blank state, a scheduled
stream preview, or the most recent past video when nothing is currently
live (YouTube's exact behavior here can vary), the website always also
shows a separate **"Currently Offline?"** card next to the player with
the weekly service schedule and links to sermon replays — so visitors
never land on an empty page outside service hours, no matter what the
embed itself is doing at that moment.

---

## 4. What the Embed Does *Not* Show

The embedded player is just the video — it does **not** include
YouTube's comments or "like" button (those only exist on YouTube's own
watch page). If someone wants to comment or like the stream, they can
tap the "Subscribe" / "Watch on YouTube" links already on the page to
open it directly on YouTube.

This behaves identically whether someone is viewing the site in a
regular browser or as the installed app (PWA) — same embedded player
either way, no extra setup required for the app.

---

## 5. Uploads vs. Premieres vs. YouTube Live

| Type | What it is | When to use it | Website behavior |
|---|---|---|---|
| **Normal Upload** | A pre-recorded video uploaded directly to YouTube. | Sharing a recorded sermon or highlight reel after the fact. | Not automatically featured — link to it manually (Section 2) if you want to spotlight it. |
| **Premiere** | A pre-recorded video YouTube "airs" at a scheduled time, with live chat, as if it were live. | Building anticipation for a special message. | Behaves like a live stream while airing — the channel embed shows it as live. |
| **YouTube Live** | A real, real-time broadcast (phone, camera, or software like OBS/StreamYard). | Sunday services, Bible studies, conferences. | Automatically appears on the website player the moment the stream starts (Section 1) — this must be public, not unlisted or private. |

**In short:** for regular weekly services, use **YouTube Live**.
Premieres and uploads are optional tools for special content.

---

## 6. Automatically Detecting Live Status (Future Idea — Not Built)

Right now, the website relies on YouTube's own channel-embed behavior to
show whatever's live (Section 1). The "We may be live right now" text
next to the player is a friendly, always-shown indicator — it does not
check live status automatically today.

If you later want a real "🔴 LIVE NOW" badge that only appears while
actually streaming, that requires the **YouTube Data API v3**, called
from a small backend (never directly from the browser, since it needs a
private API key). This site is intentionally backend-free today, so
this isn't implemented — see `ROADMAP.md` and `FUTURE_SUPABASE.md` for
how a small backend function could be added later without changing
anything else about the site.

---

## 7. Watch Previous Messages (Free, Automatic Replay)

The Live Stream page includes a **"Watch Previous Messages"** section
below the main player, so visitors are never just shown a dead
"offline" message with nothing to actually watch — whether or not the
church is live right now, this section always has real, playable video.

**How it works — and why it's free with zero setup:** every YouTube
channel automatically gets an "Uploads" playlist containing every video
ever posted to it, in order — no configuration needed on YouTube's end.
Its playlist ID is always just the Channel ID with the `UC` prefix
swapped for `UU`. For example:

```
Channel ID:          UCjxlXbR47Gg304KQH-uYFsQ
Uploads playlist ID: UUjxlXbR47Gg304KQH-uYFsQ
```

The website computes this automatically from `config/livestream.json` →
`channelId` (the same Channel ID already used for the live player in
Section 1) — **there is nothing to configure separately.** The moment a
new video is uploaded to the channel, it appears here automatically,
with no website update required. Visitors can also open the playlist
panel inside the embedded player to browse and pick any older message.

This is a genuinely free YouTube feature (no API key, no paid tier, no
third-party service) — it's simply a different kind of embed URL
pointed at a playlist instead of the live channel.

---

## Quick Reference

| I want to... | What to do |
|---|---|
| Just run a normal Sunday/Wednesday live service | Do nothing once `channelId` is set (Section 1) — go live on YouTube, it appears automatically. |
| Set up the live embed for the first time | Add your Channel ID to `config/livestream.json` → `channelId` (Section 1). |
| Feature one specific past video | Set `embedMode: "video"` and `videoId` in `config/livestream.json` (Section 2). |
| Go back to normal automatic behavior | Set `embedMode: "channel"` again (Section 2). |
| Let people comment or like the stream | They tap "Watch on YouTube" — comments/likes only exist on YouTube itself (Section 4). |
| Show past messages when nothing is live | Already on — powered automatically by `channelId`, nothing to set up (Section 7). |
| Make a real-time "LIVE NOW" badge | Requires a backend + YouTube Data API — not yet built (Section 6). |
