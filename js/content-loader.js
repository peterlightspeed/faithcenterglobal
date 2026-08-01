/*
  TFCG Content Loader
  ------------------------------------------------------------
  Fetches every JSON file in /content (frequently-changing data:
  events, sermons, books, testimonies, etc.) and /config
  (rarely-changing settings: payments, forms, analytics, social,
  SEO, livestream, app/PWA) and exposes them as two global
  objects once loading is complete:

    window.TFCG_CONTENT.church        -> content/church.json
    window.TFCG_CONTENT.services      -> content/services.json
    window.TFCG_CONTENT.events        -> content/events.json
    window.TFCG_CONTENT.books         -> content/books.json
    window.TFCG_CONTENT.sermons       -> content/sermons.json
    window.TFCG_CONTENT.testimonies   -> content/testimonies.json
    window.TFCG_CONTENT.ministries    -> content/ministries.json
    window.TFCG_CONTENT.leadership    -> content/leadership.json
    window.TFCG_CONTENT.gallery       -> content/gallery.json
    window.TFCG_CONTENT.giving        -> content/giving.json
    window.TFCG_CONTENT.livestream    -> content/livestream.json
    window.TFCG_CONTENT.faqs          -> content/faqs.json
    window.TFCG_CONTENT.announcements -> content/announcements.json
    window.TFCG_CONTENT.settings      -> content/settings.json
    window.TFCG_CONTENT.videos        -> content/videos.json
    window.TFCG_CONTENT.updates       -> content/updates.json

    window.TFCG_CONFIG.payments   -> config/payments.json
    window.TFCG_CONFIG.forms      -> config/forms.json
    window.TFCG_CONFIG.emailjs    -> config/emailjs.json
    window.TFCG_CONFIG.analytics  -> config/analytics.json
    window.TFCG_CONFIG.social     -> config/social.json
    window.TFCG_CONFIG.seo        -> config/seo.json
    window.TFCG_CONFIG.livestream -> config/livestream.json
    window.TFCG_CONFIG.app        -> config/app.json

  Once every file has settled (loaded or safely defaulted to an
  empty value), a `tfcg:content-ready` event is dispatched on
  `document`. js/render.js listens for this event and renders
  every section of every page from this data.

  This file only fetches and stores data — it does not touch the
  DOM. See CONTENT_SCHEMA.md for the shape of every JSON file.
*/
(function () {
  const CONTENT_FILES = [
    "church", "services", "events", "books", "sermons", "testimonies",
    "ministries", "leadership", "gallery", "giving", "livestream",
    "faqs", "announcements", "settings", "videos", "updates"
  ];

  const CONFIG_FILES = [
    "payments", "forms", "emailjs", "analytics", "social", "seo",
    "livestream", "app"
  ];

  function fetchJSON(path) {
    return fetch(path, { cache: "no-cache" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load " + path);
        return res.json();
      })
      .catch((err) => {
        console.warn("[TFCG CMS] Could not load " + path + " — using empty default.", err);
        return null;
      });
  }

  function loadGroup(names, folder) {
    return Promise.all(
      names.map((name) => fetchJSON(folder + "/" + name + ".json").then((data) => [name, data]))
    ).then((pairs) => {
      const out = {};
      pairs.forEach(([name, data]) => {
        out[name] = data;
      });
      return out;
    });
  }

  window.TFCG_CONTENT = window.TFCG_CONTENT || {};
  window.TFCG_CONFIG = window.TFCG_CONFIG || {};

  Promise.all([
    loadGroup(CONTENT_FILES, "content"),
    loadGroup(CONFIG_FILES, "config")
  ]).then(([content, config]) => {
    Object.assign(window.TFCG_CONTENT, content);
    Object.assign(window.TFCG_CONFIG, config);
    document.dispatchEvent(new CustomEvent("tfcg:content-ready"));
  });
})();
