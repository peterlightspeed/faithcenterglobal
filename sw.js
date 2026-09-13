/*
  TFCG Service Worker
  ------------------------------------------------------------
  A deliberately small, static-friendly service worker: it
  caches the app shell (core pages, styles, and scripts) on
  install so the site opens instantly on repeat visits and stays
  usable with a poor connection. It does NOT try to cache every
  JSON content file, so visitors always see the latest content
  when they're online.

  Caching strategy for the app shell is "stale-while-revalidate":
  a cached copy is served instantly (fast, works offline), while a
  fresh copy is fetched in the background and saved for *next*
  time. This matters because a pure cache-first strategy (the
  previous approach) could leave returning visitors — and anyone
  who installed the site as an app — stuck on an old cached
  index.html/livestream.html/render.js indefinitely, silently
  masking real fixes (like the livestream embed fix) until they
  happened to hard-refresh. Bumping CACHE_VERSION still forces an
  immediate full reset when needed, but day-to-day updates now
  reach people within one extra visit instead of never.
*/
const CACHE_VERSION = "tfcg-v4";
const APP_SHELL = [
  "index.html",
  "about.html",
  "ministries.html",
  "sermons.html",
  "events.html",
  "books.html",
  "media.html",
  "appointments.html",
  "giving.html",
  "contact.html",
  "livestream.html",
  "css/style.css",
  "js/script.js",
  "js/content-loader.js",
  "js/render.js",
  "js/pwa.js",
  "js/theme.js",
  "js/hero-particles.js",
  "js/assistant.js",
  "images/tfcg_logo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  /* Always go to the network for content/config JSON so edits show up
     immediately; fall back to cache only if offline. */
  if (url.pathname.includes("/content/") || url.pathname.includes("/config/")) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  /* Everything else (app shell HTML/CSS/JS/logo): stale-while-revalidate.
     Serve the cached version immediately if present, but always kick off
     a network fetch in parallel to refresh the cache for the next visit —
     so code fixes propagate without requiring a manual CACHE_VERSION bump
     and without the visitor's first paint waiting on the network. */
  event.respondWith(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.match(event.request).then((cached) => {
        const network = fetch(event.request)
          .then((response) => {
            if (response && response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => null);
        return cached || network;
      })
    )
  );
});
