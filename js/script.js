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

  /* Counter animation */
  const counterElements = document.querySelectorAll('.counter-value');
  const animateCounters = () => {
    counterElements.forEach((counter) => {
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

  if (counterElements.length > 0) {
    const statsContainer = counterElements[0].closest('.stats-strip') || counterElements[0];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(statsContainer);
  }

  /* Form validation (client-side, no backend wired yet) */
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('is-invalid');
        } else {
          field.classList.remove('is-invalid');
        }
      });

      if (!isValid) return;

      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;

      /* TODO: Replace this timeout with a real submission call
         to a backend endpoint or a service such as Formspree or
         EmailJS once one is connected. */
      setTimeout(() => {
        btn.innerHTML = 'Message Sent Successfully';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
        form.reset();

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-success');
          btn.classList.add('btn-primary');
          btn.disabled = false;
        }, 2800);
      }, 1200);
    });
  });

  /* Filter tabs (sermons, books, ministries) */
  const filterGroups = document.querySelectorAll('[data-filter-group]');
  filterGroups.forEach((group) => {
    const tabs = group.querySelectorAll('.filter-tab');
    const targetSelector = group.getAttribute('data-filter-group');
    const items = document.querySelectorAll(targetSelector);

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const category = tab.getAttribute('data-category');

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
    const targetSelector = input.getAttribute('data-search-target');
    const items = document.querySelectorAll(targetSelector);

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
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
});
