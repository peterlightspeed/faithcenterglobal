/*
  TFCG PWA Install Experience
  ------------------------------------------------------------
  Shows a friendly install banner (configurable via
  config/app.json → installBanner) when the site is not already
  installed, remembers dismissal in localStorage for N days, and
  opens an in-app tutorial modal with platform-specific steps for
  Android Chrome, iPhone Safari, and Desktop Chrome. See
  INSTALL_APP_GUIDE.md for the full written guide.

  Also registers sw.js (if the browser supports service workers)
  so the app shell is available offline and installability is
  improved on Chromium-based browsers.
*/
(function () {
  const DISMISS_KEY = "tfcg_install_banner_dismissed_until";
  let deferredPrompt = null;

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
  }

  function isDismissed() {
    const until = localStorage.getItem(DISMISS_KEY);
    return until && Number(until) > Date.now();
  }

  function dismissFor(days) {
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    try { localStorage.setItem(DISMISS_KEY, String(until)); } catch (e) { /* storage unavailable */ }
  }

  function detectPlatform() {
    const ua = navigator.userAgent || "";
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);
    if (isIOS) return "ios";
    if (isAndroid) return "android";
    return "desktop";
  }

  function setInstallBannerHeightVar(px) {
    document.documentElement.style.setProperty("--install-banner-height", px + "px");
  }

  function buildBanner(config) {
    const bar = document.createElement("div");
    bar.id = "tfcg-install-banner";
    bar.className = "install-banner";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Install app banner");
    bar.innerHTML = `
      <div class="install-banner-inner">
        <i class="bi bi-phone install-banner-icon" aria-hidden="true"></i>
        <div class="install-banner-text">
          <strong>${config.title}</strong>
          <span>${config.message}</span>
        </div>
        <div class="install-banner-actions">
          <button type="button" class="btn btn-primary btn-sm" id="tfcg-install-btn">${config.installButtonLabel}</button>
          <button type="button" class="btn btn-outline-gold btn-sm" id="tfcg-install-dismiss">${config.dismissButtonLabel}</button>
        </div>
      </div>
    `;
    document.body.appendChild(bar);
    /* Push the WhatsApp/Back-to-Top/Assistant stack up above the banner
       instead of letting it get covered. Measure after paint so the
       real rendered height (which varies by screen width) is used. */
    requestAnimationFrame(() => setInstallBannerHeightVar(bar.offsetHeight));
    window.addEventListener("resize", () => {
      if (document.body.contains(bar)) setInstallBannerHeightVar(bar.offsetHeight);
    });
    return bar;
  }

  function buildGuideModal() {
    if (document.getElementById("installGuideModal")) return;

    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "installGuideModal";
    modal.tabIndex = -1;
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-labelledby", "installGuideModalLabel");
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content tfcg-modal">
          <div class="modal-header" style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <h2 class="modal-title heading-font text-white h5" id="installGuideModalLabel"><i class="bi bi-phone text-gold me-2" aria-hidden="true"></i>Install the TFCG App</h2>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs install-guide-tabs" role="tablist">
              <li class="nav-item" role="presentation"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#install-android" type="button" role="tab">Android</button></li>
              <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#install-ios" type="button" role="tab">iPhone</button></li>
              <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#install-desktop" type="button" role="tab">Desktop</button></li>
            </ul>
            <div class="tab-content pt-3">
              <div class="tab-pane fade show active" id="install-android" role="tabpanel">
                <ol class="text-secondary ps-3">
                  <li class="mb-2">Open this site in <strong>Chrome</strong> on your Android phone.</li>
                  <li class="mb-2">Tap the <strong>&#8942;</strong> menu in the top-right corner.</li>
                  <li class="mb-2">Tap <strong>Install app</strong> (or "Add to Home screen").</li>
                  <li>Confirm by tapping <strong>Install</strong>.</li>
                </ol>
              </div>
              <div class="tab-pane fade" id="install-ios" role="tabpanel">
                <ol class="text-secondary ps-3">
                  <li class="mb-2">Open this site in <strong>Safari</strong> on your iPhone.</li>
                  <li class="mb-2">Tap the <strong>Share</strong> icon (square with an arrow) in the toolbar.</li>
                  <li class="mb-2">Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top-right corner.</li>
                </ol>
              </div>
              <div class="tab-pane fade" id="install-desktop" role="tabpanel">
                <ol class="text-secondary ps-3">
                  <li class="mb-2">Open this site in <strong>Chrome</strong> or <strong>Edge</strong> on your computer.</li>
                  <li class="mb-2">Click the <strong>install icon</strong> in the address bar (or the <strong>&#8942;</strong> menu).</li>
                  <li class="mb-2">Select <strong>Install The Faith Centre Global</strong>.</li>
                  <li>Confirm by clicking <strong>Install</strong>.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function initInstallExperience() {
    const settings = window.TFCG_CONTENT && window.TFCG_CONTENT.settings;
    const app = window.TFCG_CONFIG && window.TFCG_CONFIG.app;
    const config = app && app.installBanner;

    const enabled = config && config.enabled &&
      (!settings || !settings.features || settings.features.showInstallBanner !== false);

    if (!enabled || isStandalone() || isDismissed()) return;

    buildGuideModal();
    const bar = buildBanner(config);

    document.getElementById("tfcg-install-dismiss").addEventListener("click", () => {
      dismissFor(config.dismissRemembersDays || 14);
      bar.remove();
      setInstallBannerHeightVar(0);
    });

    document.getElementById("tfcg-install-btn").addEventListener("click", () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(() => {
          deferredPrompt = null;
          bar.remove();
          setInstallBannerHeightVar(0);
        });
      } else if (window.bootstrap) {
        /* No native prompt available (iOS Safari, or Chrome hasn't
           fired beforeinstallprompt yet) — show the manual guide. */
        const modalEl = document.getElementById("installGuideModal");
        const platform = detectPlatform();
        const tabMap = { android: "#install-android", ios: "#install-ios", desktop: "#install-desktop" };
        const trigger = modalEl.querySelector(`[data-bs-target="${tabMap[platform]}"]`);
        if (trigger) new window.bootstrap.Tab(trigger).show();
        new window.bootstrap.Modal(modalEl).show();
      }
    });
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  document.addEventListener("tfcg:content-ready", initInstallExperience);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* Offline caching is optional — fail silently if unsupported
           (e.g. when opened directly from disk without a web server). */
      });
    });
  }

  /* Belt-and-braces on top of the CSS z-index ordering: actively hide
     the install banner while ANY modal is open (lightbox, video player,
     install guide, etc.) so it never visually competes with modal
     content, then restore it when the modal closes. */
  document.addEventListener("show.bs.modal", () => {
    const bar = document.getElementById("tfcg-install-banner");
    if (bar) bar.classList.add("tfcg-hidden-for-modal");
  });
  document.addEventListener("hidden.bs.modal", () => {
    const bar = document.getElementById("tfcg-install-banner");
    if (bar) bar.classList.remove("tfcg-hidden-for-modal");
  });
})();
