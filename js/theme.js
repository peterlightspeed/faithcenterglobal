/*
  TFCG Theme Toggle
  ------------------------------------------------------------
  Handles the light/dark mode toggle button in the navbar. The
  actual FIRST-PAINT theme decision (avoiding a flash of the
  wrong theme) happens in a tiny inline <script> at the very top
  of every page's <head> — see that script for the initial
  localStorage/system-preference logic. This file only handles:
    - Wiring the toggle button's click
    - Updating the button's icon/label to match the active theme
    - Persisting the visitor's explicit choice to localStorage
    - Following the OS-level theme if the visitor hasn't made an
      explicit choice yet (i.e., no localStorage value saved)
*/
(function () {
  const STORAGE_KEY = "tfcg-theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage unavailable (private browsing, etc.) — the choice
         just won't persist across visits, which is an acceptable
         degradation rather than breaking the toggle entirely. */
    }
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function updateToggleUI(theme) {
    const btn = document.getElementById("themeToggle");
    const icon = document.getElementById("themeToggleIcon");
    if (!btn || !icon) return;

    if (theme === "light") {
      icon.className = "bi bi-sun-fill";
      btn.setAttribute("aria-label", "Switch to dark mode");
      btn.setAttribute("aria-pressed", "true");
      btn.title = "Switch to dark mode";
    } else {
      icon.className = "bi bi-moon-stars-fill";
      btn.setAttribute("aria-label", "Switch to light mode");
      btn.setAttribute("aria-pressed", "false");
      btn.title = "Switch to light mode";
    }
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    updateToggleUI(theme);
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateToggleUI(currentTheme());

    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", function () {
        const next = currentTheme() === "light" ? "dark" : "light";
        applyTheme(next);
        setStoredTheme(next);
      });
    }

    /* If the visitor hasn't made an explicit choice on this device yet,
       keep following their OS-level preference live (e.g. their system
       switches to light mode at sunrise). Once they click the toggle,
       their explicit choice always wins from then on. */
    if (!getStoredTheme() && window.matchMedia) {
      const mql = window.matchMedia("(prefers-color-scheme: light)");
      const handleChange = function (e) {
        if (!getStoredTheme()) applyTheme(e.matches ? "light" : "dark");
      };
      if (mql.addEventListener) mql.addEventListener("change", handleChange);
      else if (mql.addListener) mql.addListener(handleChange); // Safari <14
    }
  });
})();
