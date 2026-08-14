/*
  TFCG Service Worker
  ------------------------------------------------------------
  A deliberately small, static-friendly service worker: it
  caches the app shell (core pages, styles, and scripts) on
  install so the site opens instantly on repeat visits and stays
  usable with a poor connection. It does NOT try to cache every
  JSON content file, so visitors always see the latest content
  when they're online.

  Bump CACHE_VERSION whenever you change core files (css/js/html)
  so old caches are cleared automatically.
*/
const CACHE_VERSION = "tfcg-v3";
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
     immediately; fall back to cache for everything else (app shell). */
  if (url.pathname.includes("/content/") || url.pathname.includes("/config/")) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
