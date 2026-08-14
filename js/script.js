/*
  TFCG Main Site Script
  Handles navbar behavior, mobile navigation, scroll-to-top,
  counter animations, form validation, filter tabs, and search.
*/

document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80
    });
  }

  /* Navbar scroll state */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const updateNavbar = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  /* Mobile nav auto-close on link click */
  const navbarCollapseEl = document.getElementById('navbarNav');
  if (navbarCollapseEl) {
    const navLinks = navbarCollapseEl.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navbarCollapseEl.classList.contains('show') && window.bootstrap) {
          const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navbarCollapseEl);
          bsCollapse.hide();
        }
      });
    });
  }

  /* Scroll to top button */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Smooth internal anchor scroll with navbar offset */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPos = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* Counter animation. Wrapped in a function (and exposed) because
     the stats markup is now injected asynchronously by render.js
     from content/church.json, so it may not exist yet at
     DOMContentLoaded time. */
  window.TFCG_setupCounters = function () {
    const counterElements = document.querySelectorAll('.counter-value:not([data-tfcg-counted])');
    if (!counterElements.length) return;

    const animateCounters = () => {
      counterElements.forEach((counter) => {
        counter.setAttribute('data-tfcg-counted', 'true');
        const target = +counter.getAttribute('data-target');
        const duration = 1600;
        const start = performance.now();

        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const current = Math.floor(progress * target);
          counter.textContent = current;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = target;
          }
        };
        requestAnimationFrame(step);
      });
    };

    const statsContainer = counterElements[0].closest('.stats-strip') || counterElements[0];

    if (typeof IntersectionObserver === 'undefined') {
      animateCounters();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(statsContainer);
  };

  window.TFCG_setupCounters();

  /* Form submission is now handled by js/render.js (wireAllForms),
     which reads config/forms.json and posts to Formspree once an
     endpoint is configured. See CONTENT_MANAGEMENT_GUIDE.md. */

  /* Filter tabs + live search target content that js/render.js injects
     from JSON asynchronously (books, sermons). Wiring is wrapped in
     TFCG_setupFilters() so it can be re-run by render.js right after
     the cards are drawn, in addition to running here for any content
     that is already in the DOM at page load. */
  window.TFCG_setupFilters = function () {
    /* Filter tabs (sermons, books, ministries) */
    const filterGroups = document.querySelectorAll('[data-filter-group]');
    filterGroups.forEach((group) => {
      if (group.dataset.tfcgFilterWired) return;
      group.dataset.tfcgFilterWired = 'true';

      const tabs = group.querySelectorAll('.filter-tab');
      const targetSelector = group.getAttribute('data-filter-group');

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          const category = tab.getAttribute('data-category');
          const items = document.querySelectorAll(targetSelector);

          items.forEach((item) => {
            const itemCategories = (item.getAttribute('data-category') || '').split(/\s+/);
            const show = category === 'all' || itemCategories.includes(category);
            item.style.display = show ? '' : 'none';
          });
        });
      });
    });

    /* Live search filter (books, sermons) */
    const searchInputs = document.querySelectorAll('[data-search-target]');
    searchInputs.forEach((input) => {
      if (input.dataset.tfcgSearchWired) return;
      input.dataset.tfcgSearchWired = 'true';

      const targetSelector = input.getAttribute('data-search-target');

      input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        const items = document.querySelectorAll(targetSelector);
        items.forEach((item) => {
          const searchText = (item.getAttribute('data-search-text') || item.textContent).toLowerCase();
          item.style.display = searchText.includes(query) ? '' : 'none';
        });
      });
    });

    /* Lazy-load iframes for performance */
    document.querySelectorAll('iframe').forEach((iframe) => {
      if (!iframe.hasAttribute('loading')) {
        iframe.setAttribute('loading', 'lazy');
      }
    });
  };

  /* NOTE: TFCG_setupFilters() is intentionally NOT called here.
     js/render.js calls it once, after all JSON content (and any
     dynamically-generated filter-tab buttons, like on the Media Centre
     page) has finished rendering. Calling it here too would wire the
     group before those buttons exist, mark the group as "already
     wired", and then permanently skip it once the real buttons appear —
     exactly the bug that broke filtering on the Media page. */
});
