# Live Stream Guide (For Church Administrators)

This guide explains — in plain language — how the "Live Stream" page on the website works, and how to manage it. You do **not** need to know how to code to follow these steps.

---

## 1. How the Livestream Currently Works

The Live Stream page (`livestream.html`) embeds a YouTube video player that is pointed at TFCG's YouTube **channel**, not a single video. This is done with a special link:

```
https://www.youtube.com/embed/live_stream?channel=TfcglobalTV
```

Because it points to the *channel* rather than one specific video, this player automatically behaves correctly on its own:

- If TFCG is currently streaming live on YouTube, the player shows the live stream automatically.
- If TFCG is not live, the player shows the channel's most recently uploaded/streamed video instead.

**This means that for a normal Sunday or Wednesday service, you do not have to touch any code.** As soon as the church starts streaming on YouTube under the `TfcglobalTV` channel, it will appear on the website automatically.

---

## 2. How to Replace the YouTube Video (For a Specific Broadcast)

There may be times you want the website to show **one specific video** instead of "whatever is live on the channel" — for example, to highlight a special conference recording.

Steps:

1. Go to the YouTube video you want to feature.
2. Click **Share** → **Embed**, and copy the `VIDEO_ID` from the link (it's the part after `/embed/` in the code YouTube gives you, or the part after `v=` in the normal video URL).
   - Example: in `https://www.youtube.com/watch?v=ABC12345XYZ`, the Video ID is `ABC12345XYZ`.
3. Open `livestream.html` in the code editor.
4. Find this line (inside the `<div class="ratio ratio-16x9">` block):
   ```html
   <iframe src="https://www.youtube.com/embed/live_stream?channel=TfcglobalTV" ...>
   ```
5. Replace the `src` value with:
   ```html
   <iframe src="https://www.youtube.com/embed/ABC12345XYZ" ...>
   ```
6. Save the file.

**To go back to automatic live detection**, simply restore the original `live_stream?channel=TfcglobalTV` link.

---

## 3. How to Update the Livestream When the Church Starts a New Live Broadcast

If you are using the default channel-embed setup (Section 1), **you don't need to do anything** — just start streaming on YouTube under the `TfcglobalTV` channel and the website will show it automatically within a few minutes.

If a staff member manually swapped in a specific video link (Section 2) for a past event, remember to **switch it back** to the channel embed link afterward, so future live streams show up automatically again.

---

## 4. Uploading vs. Premieres vs. YouTube Live — What's the Difference?

| Type | What it is | When to use it | Website behavior |
|---|---|---|---|
| **Normal Upload** | A pre-recorded video uploaded directly to YouTube. It's available immediately once processing finishes. | Sharing a recorded sermon, testimony, or highlight reel after the fact. | Will appear as the "most recent video" on the channel embed once live stream ends, or can be manually linked (Section 2). |
| **Premiere** | A pre-recorded video that YouTube "airs" at a scheduled time, with a live chat running alongside it, as if it were live. | Building anticipation for a special message or building a countdown before an event. | Behaves like a live stream while the premiere is airing — the channel embed will show it as live. Afterward, it becomes a normal video. |
| **YouTube Live** | A real, real-time broadcast (e.g. streamed directly from the church service via a phone, camera, or streaming software like OBS/StreamYard). | Sunday services, Bible studies, live conferences. | Automatically appears on the website player the moment the stream starts (see Section 1). |

**In short:** for regular weekly services, use **YouTube Live**. Premieres and uploads are optional tools for special content.

---

## 5. How the Embedded Player Behaves in Different States

Because the website uses the **channel live embed** (not a single fixed video), here is what visitors see in each scenario:

- **Church is Offline (not streaming):**
  The player shows the most recent past broadcast/video from the channel, so visitors always see *something* relevant, even outside service hours. Below the player, the page also displays a "Currently Offline?" card with the weekly service schedule and links to sermon replays — this text is static and always visible regardless of live status.

- **Church is Live:**
  The player automatically switches to showing the live broadcast in real time, with YouTube's normal live chat and viewer count available inside the embedded player (if enabled on the YouTube video itself).

- **A Livestream Has Ended:**
  Once you stop streaming on YouTube, the embedded player will show that video as a regular "recently uploaded" video (with the recording available for replay) until a newer stream/video is published, after which it shows the newest one.

**Note:** The "We may be live right now" text next to the player is always shown as a friendly indicator — it does not currently check live status automatically. See Section 6 for how to make it fully automatic.

---

## 6. Automatically Detecting Live Status in the Future (YouTube Data API) — Documentation Only

Right now, the website relies on YouTube's own channel-embed behavior to "auto-detect" live status (see Section 1). This works well for the video player itself, but the surrounding text ("We may be live right now") does not currently change dynamically.

If you want the website to **automatically know** whether the church is live (for example, to show a real "LIVE NOW" badge or hide the "Currently Offline" card only when actually live), this would require the **YouTube Data API v3**. This is **not implemented yet** — this section is documentation only, for a future developer.

### How it would work (high level):

1. **Get a YouTube Data API key** from the [Google Cloud Console](https://console.cloud.google.com/), under "APIs & Services" → enable "YouTube Data API v3".
2. **Call the Search endpoint** to check if the channel is currently live:
   ```
   GET https://www.googleapis.com/youtube/v3/search
       ?part=snippet
       &channelId=<TFCG_CHANNEL_ID>
       &eventType=live
       &type=video
       &key=<YOUR_API_KEY>
   ```
3. **Check the response:**
   - If the API returns a video result, the channel is live — you can extract that video's ID and use it to build a direct embed link, and show a "LIVE NOW" indicator.
   - If the API returns no results, the channel is offline — show the normal "Currently Offline" messaging.
4. **Important:** This API call must be made from a **server/backend**, not directly from the browser, because it requires a private API key that should never be exposed in public website code. This site currently has no backend/server component, so implementing this would first require adding one (e.g. a small serverless function) purely to keep the API key secret.
5. **Refresh timing:** You would typically re-check this every 1–5 minutes (e.g. with a scheduled job or a page script that polls a small backend endpoint), not on every single page view, to avoid exceeding YouTube's free API quota.

### TODO markers in the code

Inside `livestream.html`, you'll find HTML comments marking exactly where this logic would be added:

```html
<!-- TODO: To automatically detect and switch to a live video without
     manual edits, integrate the YouTube Data API v3 "search.list"
     (eventType=live) endpoint — see LIVESTREAM_GUIDE.md, section 6.
     Do NOT implement this without a backend, since it requires a
     server-side API key. -->
```

This is intentionally left as documentation only — no automation has been implemented, since it requires backend infrastructure this static site does not currently have.

---

## Quick Reference

| I want to... | What to do |
|---|---|
| Just run a normal Sunday/Wednesday live service | Do nothing — go live on YouTube, it appears automatically. |
| Feature one specific past video | Replace the iframe `src` with `https://www.youtube.com/embed/VIDEO_ID` (Section 2). |
| Go back to normal automatic behavior | Restore the `live_stream?channel=TfcglobalTV` link (Section 2). |
| Make a real-time "LIVE NOW" badge | Requires backend + YouTube Data API — not yet built (Section 6). |
