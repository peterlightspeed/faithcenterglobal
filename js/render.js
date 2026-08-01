/*
  TFCG CMS Renderer
  ------------------------------------------------------------
  Reusable rendering functions that turn window.TFCG_CONTENT /
  window.TFCG_CONFIG (populated by js/content-loader.js) into
  markup. Every function starts by looking up its container by
  id and returns immediately if that container isn't present on
  the current page — so this single file can be included on
  every page without extra per-page wiring.

  To change WHAT shows up on the site: edit the JSON files in
  /content and /config. To change HOW it is displayed: edit the
  template strings below. See CONTENT_SCHEMA.md and
  CONTENT_MANAGEMENT_GUIDE.md for details.
*/
(function () {
  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------------------------------------------------------- */
  /* Card renderers (shared building blocks)                     */
  /* ---------------------------------------------------------- */

  function renderBooks() {
    const grid = $("books-grid");
    const books = window.TFCG_CONTENT.books;
    if (!grid || !books) return;

    grid.innerHTML = books.map((book, index) => {
      const badgeClass = book.badge === "Bestseller" ? "bestseller" : (book.badge === "New" ? "new" : "");
      const badgeHtml = book.badge ? `<span class="book-badge ${badgeClass}">${escapeHtml(book.badge)}</span>` : "";
      const message = encodeURIComponent(`Hello, I would like to purchase "${book.title}" by ${book.author}.`);
      const delay = (index % 4) * 100;
      const searchText = `${book.title} ${book.author} ${book.categories}`;

      return `
        <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="${delay}" data-book-card data-category="${escapeHtml(book.categories)}" data-search-text="${escapeHtml(searchText)}">
          <div class="book-card">
            <div class="book-cover-wrap">
              ${badgeHtml}
              <img src="${escapeHtml(book.cover)}" alt="Cover of ${escapeHtml(book.title)} by ${escapeHtml(book.author)}" loading="lazy">
            </div>
            <div class="book-card-body">
              <h3 class="h4">${escapeHtml(book.title)}</h3>
              <p class="book-author">${escapeHtml(book.author)}</p>
              <p class="book-price">${escapeHtml(book.price)}</p>
              <a href="https://wa.me/${escapeHtml(book.whatsappNumber)}?text=${message}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm w-100"><i class="bi bi-whatsapp me-2" aria-hidden="true"></i>Buy Now</a>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderEvents() {
    const list = $("events-list");
    const events = window.TFCG_CONTENT.events;
    if (!list || !events) return;

    list.innerHTML = events.map((ev, index) => {
      const dateBlockClass = ev.special ? "event-date-block gold-block" : "event-date-block";
      const badgeClass = ev.special ? "badge-red" : "badge-gold";
      const btnClass = ev.special ? "btn btn-primary mt-2" : "btn btn-outline-gold mt-2";
      const cardStyle = ev.special ? ' style="border-color: rgba(212,160,23,0.4);"' : "";
      const delay = (index % 4 + 1) * 100;

      return `
        <div class="col-lg-10" data-aos="fade-up" data-aos-delay="${delay}">
          <div class="event-card event-card-horizontal"${cardStyle}>
            <div class="${dateBlockClass}">
              <span class="event-month">${escapeHtml(ev.month)}</span>
              <span class="event-day">${escapeHtml(ev.day)}</span>
            </div>
            <div class="event-body">
              <div class="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                <h2 class="heading-font text-white mb-0 h4">${escapeHtml(ev.title)}</h2>
                <span class="${badgeClass}">${escapeHtml(ev.badge)}</span>
              </div>
              <p class="text-gold mb-3"><i class="bi bi-clock me-2" aria-hidden="true"></i>${escapeHtml(ev.time)}<i class="bi bi-geo-alt ms-3 me-2" aria-hidden="true"></i>${escapeHtml(ev.location)}</p>
              <p class="text-secondary">${escapeHtml(ev.description)}</p>
              <a href="contact.html" class="${btnClass}">Learn More</a>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderSermons() {
    const grid = $("sermons-grid");
    const sermons = window.TFCG_CONTENT.sermons;
    if (!grid || !sermons) return;

    const church = window.TFCG_CONTENT.church;
    const author = (church && church.contact && church.leadName) || (window.TFCG_CONTENT.leadership && window.TFCG_CONTENT.leadership[0] && window.TFCG_CONTENT.leadership[0].name) || "Pastor Godspower Opara Martins";

    grid.innerHTML = sermons.map((s, index) => {
      const categoryLabel = s.category.charAt(0).toUpperCase() + s.category.slice(1);
      const delay = (index % 3) * 100;

      return `
        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${delay}" data-sermon-card data-category="${escapeHtml(s.category)}">
          <div class="sermon-card">
            <div class="sermon-card-thumb">
              <span class="sermon-category">${escapeHtml(categoryLabel)}</span>
              <i class="bi bi-play-circle-fill play-icon" aria-hidden="true"></i>
            </div>
            <div class="sermon-card-body">
              <h3 class="h4">${escapeHtml(s.title)}</h3>
              <p class="sermon-meta">${escapeHtml(author)}<br><span class="scripture">${escapeHtml(s.scripture)}</span></p>
              <div class="d-flex gap-2">
                <a href="${escapeHtml(s.watchUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm flex-grow-1"><i class="bi bi-play-fill" aria-hidden="true"></i> Watch</a>
                <a href="${escapeHtml(s.listenUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-gold btn-sm flex-grow-1"><i class="bi bi-headphones" aria-hidden="true"></i> Listen</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  function ministryCardHtml(m, delay) {
    return `
      <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${delay}">
        <div class="ministry-card">
          <div class="ministry-icon"><i class="bi ${escapeHtml(m.icon)}" aria-hidden="true"></i></div>
          <h3 class="heading-font text-white mb-3 h4">${escapeHtml(m.name)}</h3>
          <p class="text-secondary">${escapeHtml(m.description)}</p>
          <a href="contact.html" class="btn btn-outline-gold btn-sm mt-3">Get Involved</a>
        </div>
      </div>
    `;
  }

  function renderMinistries() {
    const grid = $("ministries-grid");
    const ministries = window.TFCG_CONTENT.ministries;
    if (!grid || !ministries) return;

    grid.innerHTML = ministries.map((m, index) => ministryCardHtml(m, (index % 3 + 1) * 100)).join("");
  }

  function renderHomeMinistriesPreview() {
    const grid = $("home-ministries-preview");
    const ministries = window.TFCG_CONTENT.ministries;
    if (!grid || !ministries) return;

    const featured = ministries.filter((m) => m.featuredOnHome).slice(0, 3);
    const list = featured.length ? featured : ministries.slice(0, 3);

    grid.innerHTML = list.map((m, index) => `
      <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
        <div class="glass-card h-100">
          <i class="bi ${escapeHtml(m.icon)}" aria-hidden="true"></i>
          <h3 class="text-white h4">${escapeHtml(m.name)}</h3>
          <p class="text-secondary">${escapeHtml(m.description)}</p>
          <a href="ministries.html" class="text-gold mt-2 d-inline-block">Explore &rarr;</a>
        </div>
      </div>
    `).join("");
  }

  function renderTestimonials() {
    const grid = $("testimonials-list");
    const testimonies = window.TFCG_CONTENT.testimonies;
    if (!grid || !testimonies) return;

    grid.innerHTML = testimonies.map((t, index) => `
      <div class="col-lg-4" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
        <div class="glass-card testimonial-card">
          <div class="quote-icon" aria-hidden="true">&ldquo;</div>
          <p class="testimonial-text">${escapeHtml(t.text)}</p>
          <div class="testimonial-avatar" aria-hidden="true"><i class="bi bi-person-fill"></i></div>
          <div class="testimonial-author">${escapeHtml(t.author)}</div>
          <div class="testimonial-title">${escapeHtml(t.role)}</div>
        </div>
      </div>
    `).join("");
  }

  function renderServiceTimes() {
    const grid = $("service-times-list");
    const services = window.TFCG_CONTENT.services;
    if (!grid || !services) return;

    grid.innerHTML = services.map((s, index) => `
      <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
        <div class="glass-card text-center p-5${s.featured ? " border-gold" : ""}">
          <i class="bi ${escapeHtml(s.icon)}" aria-hidden="true"></i>
          <h3 class="h4 heading-font text-white mt-3">${escapeHtml(s.name)}</h3>
          <p class="display-6 fw-bold text-light my-3">${escapeHtml(s.time)}</p>
          <p class="text-secondary small">${escapeHtml(s.subtitle)}</p>
        </div>
      </div>
    `).join("");
  }

  function renderFooterServiceTimes() {
    const list = $("footer-service-times");
    const services = window.TFCG_CONTENT.services;
    if (!list || !services) return;

    list.innerHTML = services.map((s) => `<li><strong>${escapeHtml(s.name)}</strong><br>${escapeHtml(s.timeWithZone)}</li>`).join("");
  }

  function renderStats() {
    const el = $("stats-strip-list");
    const church = window.TFCG_CONTENT.church;
    if (!el || !church || !church.stats) return;

    el.innerHTML = church.stats.map((s) => `
      <div class="col-6 col-md-3 stat-item">
        <div class="stat-number"><span class="counter-value" data-target="${escapeHtml(s.target)}">0</span>${escapeHtml(s.suffix || "")}</div>
        <div class="stat-label">${escapeHtml(s.label)}</div>
      </div>
    `).join("");
  }

  /* ---------------------------------------------------------- */
  /* Church-wide text (hero, about, footer, contact info)        */
  /* ---------------------------------------------------------- */

  function renderHero() {
    const church = window.TFCG_CONTENT.church;
    if (!church || !church.hero) return;
    const hero = church.hero;

    const label = $("hero-label");
    if (label) label.textContent = hero.label;

    const title = $("hero-title");
    if (title) title.textContent = hero.title;

    const subtitle = $("hero-subtitle");
    if (subtitle) subtitle.textContent = hero.subtitle;

    const btnPrimary = $("hero-btn-primary");
    if (btnPrimary) {
      btnPrimary.textContent = hero.primaryButtonLabel;
      btnPrimary.href = hero.primaryButtonLink;
    }

    const btnSecondary = $("hero-btn-secondary");
    if (btnSecondary) {
      btnSecondary.textContent = hero.secondaryButtonLabel;
      btnSecondary.href = hero.secondaryButtonLink;
    }

    const img = $("hero-image");
    if (img) {
      img.src = hero.image;
      img.alt = hero.imageAlt;
    }

    const caption = $("hero-image-caption");
    if (caption) caption.textContent = hero.imageCaption;
  }

  function renderHomeAbout() {
    const church = window.TFCG_CONTENT.church;
    if (!church) return;

    const text = $("home-about-text");
    if (text) text.textContent = church.aboutExtended || church.about;

    const cards = $("home-about-cards");
    if (cards && church.vision && church.mission) {
      cards.innerHTML = [church.vision, church.mission].map((item) => `
        <div class="col-md-12">
          <div class="glass-card d-flex align-items-center gap-4 p-4">
            <i class="bi ${escapeHtml(item.icon)} mb-0" aria-hidden="true"></i>
            <div>
              <h3 class="mb-1 heading-font text-white h4">${escapeHtml(item.title)}</h3>
              <p class="mb-0 text-secondary">${escapeHtml(item.statement)}</p>
            </div>
          </div>
        </div>
      `).join("");
    }
  }

  function renderAboutStory() {
    const church = window.TFCG_CONTENT.church;
    const el = $("about-story-text");
    if (!el || !church) return;

    const paragraphs = [church.about, church.aboutExtended, church.belonging].filter(Boolean);
    el.innerHTML = paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
  }

  function renderAboutVisionMandate() {
    const church = window.TFCG_CONTENT.church;
    const el = $("about-vision-mandate");
    if (!el || !church || !church.vision || !church.mission) return;

    el.innerHTML = [church.vision, church.mission].map((item) => `
      <div class="col-12">
        <div class="glass-card" style="border-left: 4px solid var(--tfcg-gold);">
          <h3 class="heading-font text-white mb-3 h4">${escapeHtml(item.title)}</h3>
          <p class="text-secondary mb-0">${escapeHtml(item.statement)}</p>
        </div>
      </div>
    `).join("");
  }

  function renderStatementOfFaith() {
    const church = window.TFCG_CONTENT.church;
    const list = $("statement-of-faith-list");
    if (!list || !church || !church.statementOfFaith) return;

    const half = Math.ceil(church.statementOfFaith.length / 2);
    const columns = [church.statementOfFaith.slice(0, half), church.statementOfFaith.slice(half)];

    list.innerHTML = columns.map((col, colIndex) => `
      <div class="col-md-6" data-aos="fade-up" data-aos-delay="${(colIndex + 1) * 100}">
        ${col.map((item, i) => `
          <div class="faith-item">
            <span class="faith-number" aria-hidden="true">${colIndex * half + i + 1}</span>
            <p class="mb-0">${escapeHtml(item)}</p>
          </div>
        `).join("")}
      </div>
    `).join("");
  }

  function renderLeadership() {
    const list = $("leadership-list");
    const leadership = window.TFCG_CONTENT.leadership;
    if (!list || !leadership) return;

    list.innerHTML = leadership.map((person) => `
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="glass-card p-0 overflow-hidden">
            <div class="row g-0 align-items-center">
              <div class="col-md-5 p-4">
                <div class="pastor-placeholder" style="aspect-ratio: 1/1; border-radius: 20px;">
                  <img src="${escapeHtml(person.image)}" alt="${escapeHtml(person.imageAlt)}" style="object-position: top;" width="620" height="620" loading="lazy">
                </div>
              </div>
              <div class="col-md-7 p-4 p-md-5">
                <h3 class="heading-font text-white text-gold mb-2 h4">${escapeHtml(person.name)}</h3>
                <p class="text-secondary mb-4 small text-uppercase letter-spacing-1">${escapeHtml(person.title)}</p>
                ${(person.bio || []).map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  }

  function renderGallery() {
    const section = $("gallery-section");
    const grid = $("gallery-grid");
    const gallery = window.TFCG_CONTENT.gallery;
    const settings = window.TFCG_CONTENT.settings;
    if (!grid) return;

    const enabled = !settings || !settings.features || settings.features.showGallery !== false;
    if (!gallery || !gallery.length || !enabled) {
      if (section) section.style.display = "none";
      return;
    }

    grid.innerHTML = gallery.map((item, index) => `
      <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(index % 3 + 1) * 100}">
        <div class="glass-card p-0 overflow-hidden">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" class="w-100" style="aspect-ratio: 4/3; object-fit: cover;" loading="lazy">
          <p class="text-secondary text-center small mb-0 py-3 px-2">${escapeHtml(item.caption)}</p>
        </div>
      </div>
    `).join("");
  }

  function renderFAQs() {
    const section = $("faqs-section");
    const list = $("faqs-list");
    const faqs = window.TFCG_CONTENT.faqs;
    const settings = window.TFCG_CONTENT.settings;
    if (!list) return;

    const enabled = !settings || !settings.features || settings.features.showFAQs !== false;
    if (!faqs || !faqs.length || !enabled) {
      if (section) section.style.display = "none";
      return;
    }

    list.innerHTML = faqs.map((faq, index) => {
      const id = "faq-" + index;
      return `
        <div class="accordion-item">
          <h3 class="accordion-header" id="${id}-heading">
            <button class="accordion-button${index === 0 ? "" : " collapsed"}" type="button" data-bs-toggle="collapse" data-bs-target="#${id}-body" aria-expanded="${index === 0 ? "true" : "false"}" aria-controls="${id}-body">
              ${escapeHtml(faq.question)}
            </button>
          </h3>
          <div id="${id}-body" class="accordion-collapse collapse${index === 0 ? " show" : ""}" aria-labelledby="${id}-heading" data-bs-parent="#faqs-list">
            <div class="accordion-body text-secondary">${escapeHtml(faq.answer)}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderAnnouncementBar() {
    const bar = $("announcement-bar");
    const announcements = window.TFCG_CONTENT.announcements;
    const settings = window.TFCG_CONTENT.settings;
    if (!bar) return;

    const enabled = announcements && announcements.enabled &&
      (!settings || !settings.features || settings.features.showAnnouncementBar !== false);

    if (!enabled) {
      bar.hidden = true;
      bar.innerHTML = "";
      return;
    }

    bar.hidden = false;
    bar.innerHTML = `
      <div class="container d-flex align-items-center justify-content-center gap-3 flex-wrap">
        <span>${escapeHtml(announcements.message)}</span>
        ${announcements.linkUrl ? `<a href="${escapeHtml(announcements.linkUrl)}" class="announcement-link">${escapeHtml(announcements.linkLabel || "Learn More")} <i class="bi bi-arrow-right" aria-hidden="true"></i></a>` : ""}
        <button type="button" class="announcement-close" id="announcement-close" aria-label="Dismiss announcement"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
      </div>
    `;

    const closeBtn = $("announcement-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        bar.hidden = true;
      });
    }
  }

  /* ---------------------------------------------------------- */
  /* Giving page                                                 */
  /* ---------------------------------------------------------- */

  function renderGiving() {
    const giving = window.TFCG_CONTENT.giving;
    if (!giving) return;

    const title = $("giving-hero-title");
    if (title) title.textContent = giving.heroTitle;

    const verse = $("giving-hero-verse");
    if (verse) verse.textContent = giving.heroVerse;

    const intro = $("giving-intro");
    if (intro) intro.textContent = giving.intro;

    const methods = $("giving-methods");
    if (methods && giving.methods) {
      methods.innerHTML = giving.methods.map((m, index) => `
        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
          <div class="giving-method-card${m.featured ? " featured" : ""}">
            <i class="bi ${escapeHtml(m.icon)} fs-1 text-gold mb-3" aria-hidden="true"></i>
            <h2 class="heading-font mb-3 h4">${escapeHtml(m.title)}</h2>
            <p class="text-secondary">${escapeHtml(m.description)}</p>
          </div>
        </div>
      `).join("");
    }

    const bank = $("giving-bank-details");
    if (bank && giving.bankDetails) {
      const b = giving.bankDetails;
      bank.innerHTML = `
        <div class="bank-detail-row">
          <span class="bank-detail-label">Account Name</span>
          <span class="bank-detail-value">${escapeHtml(b.accountName)}</span>
        </div>
        <div class="bank-detail-row">
          <span class="bank-detail-label">Bank Name</span>
          <span class="bank-detail-value">${escapeHtml(b.bankName)}</span>
        </div>
        <div class="bank-detail-row">
          <span class="bank-detail-label">Account Number</span>
          <span class="bank-account-number">${escapeHtml(b.accountNumber)}</span>
        </div>
      `;
    }

    const note = $("giving-note");
    if (note) note.textContent = giving.note;

    /* Online giving button — driven by config/payments.json.
       TODO (Paystack): once config/payments.json has "enabled": true
       and real links, this button activates automatically. Until
       then it stays disabled and says "Coming Soon". */
    const onlineBtnWrap = $("giving-online-btn-wrap");
    const payments = window.TFCG_CONFIG.payments;
    if (onlineBtnWrap) {
      const paystack = payments && payments.paystack;
      if (paystack && paystack.enabled && paystack.titheLink) {
        onlineBtnWrap.innerHTML = `
          <div class="d-flex gap-2 justify-content-center flex-wrap">
            <a href="${escapeHtml(paystack.titheLink)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Give Tithe Online</a>
            ${paystack.offeringLink ? `<a href="${escapeHtml(paystack.offeringLink)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-gold">Give Offering</a>` : ""}
            ${paystack.seedLink ? `<a href="${escapeHtml(paystack.seedLink)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-gold">Sow a Seed</a>` : ""}
          </div>
        `;
      } else {
        onlineBtnWrap.innerHTML = `<button class="btn btn-primary" disabled aria-disabled="true">Give Online (Coming Soon)</button>`;
      }
    }
  }

  /* ---------------------------------------------------------- */
  /* Livestream page                                              */
  /* ---------------------------------------------------------- */

  function renderLivestream() {
    const content = window.TFCG_CONTENT.livestream;
    const config = window.TFCG_CONFIG.livestream;

    const iframe = $("livestream-iframe") || $("home-livestream-iframe");
    if (iframe && config) {
      const src = (config.embedMode === "video" && config.videoId)
        ? `https://www.youtube.com/embed/${config.videoId}`
        : `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(config.channelHandle || "TfcglobalTV")}${config.autoplay ? "&autoplay=1" : ""}`;
      iframe.src = src;
    }

    if (!content) return;

    const liveLabel = $("livestream-live-label");
    if (liveLabel) liveLabel.textContent = content.liveNowLabel;

    const subscribeBtn = $("livestream-subscribe-label");
    if (subscribeBtn) subscribeBtn.textContent = content.subscribeLabel;

    const scheduleList = $("livestream-schedule-list");
    const services = window.TFCG_CONTENT.services;
    if (scheduleList && services) {
      scheduleList.innerHTML = services.map((s) => `
        <li class="mb-3 d-flex justify-content-between align-items-center">
          <span class="text-white fw-medium">${escapeHtml(s.name)} ${escapeHtml(s.subtitle.includes("Service") ? "" : "")}</span>
          <span class="text-gold">${escapeHtml(s.timeWithZone)}</span>
        </li>
      `).join("");
    }

    const offlineTitle = $("livestream-offline-title");
    if (offlineTitle) offlineTitle.textContent = content.offlineTitle;

    const offlineMessage = $("livestream-offline-message");
    if (offlineMessage) offlineMessage.textContent = content.offlineMessage;

    const primaryBtn = $("livestream-offline-btn-primary");
    if (primaryBtn) {
      primaryBtn.textContent = content.offlineButtonPrimaryLabel;
      primaryBtn.href = content.offlineButtonPrimaryLink;
    }

    const secondaryBtn = $("livestream-offline-btn-secondary");
    if (secondaryBtn) {
      secondaryBtn.textContent = content.offlineButtonSecondaryLabel;
      secondaryBtn.href = content.offlineButtonSecondaryLink;
    }
  }

  /* ---------------------------------------------------------- */
  /* Contact page                                                 */
  /* ---------------------------------------------------------- */

  function renderContactInfo() {
    const church = window.TFCG_CONTENT.church;
    const social = window.TFCG_CONFIG.social;

    const infoList = $("contact-info-list");
    if (infoList && church && church.contact) {
      const c = church.contact;
      infoList.innerHTML = `
        <li class="d-flex mb-4">
          <i class="bi bi-geo-alt-fill fs-4 text-gold me-3 mt-1" aria-hidden="true"></i>
          <div>
            <h3 class="text-white mb-1 h6">Our Location</h3>
            <p class="text-secondary mb-0">${c.addressLines.map(escapeHtml).join("<br>")}</p>
          </div>
        </li>
        <li class="d-flex mb-4">
          <i class="bi bi-envelope-fill fs-4 text-gold me-3 mt-1" aria-hidden="true"></i>
          <div>
            <h3 class="text-white mb-1 h6">Email Us</h3>
            <a href="mailto:${escapeHtml(c.email)}" class="text-secondary text-decoration-none hover-gold">${escapeHtml(c.email)}</a>
          </div>
        </li>
        <li class="d-flex">
          <i class="bi bi-telephone-fill fs-4 text-gold me-3 mt-1" aria-hidden="true"></i>
          <div>
            <h3 class="text-white mb-1 h6">Call Us</h3>
            <a href="tel:${escapeHtml(c.phoneE164)}" class="text-secondary text-decoration-none hover-gold">${escapeHtml(c.phoneDisplay)}</a>
          </div>
        </li>
      `;
    }

    const socialIcons = $("contact-social-icons");
    if (socialIcons && social) {
      socialIcons.innerHTML = socialLinksHtml(social, "btn btn-outline-gold rounded-circle p-2 px-3");
    }

    const mapFrame = $("contact-map-embed");
    if (mapFrame && church && church.contact && church.contact.mapEmbedUrl) {
      mapFrame.src = church.contact.mapEmbedUrl;
    }
  }

  function socialLinksHtml(social, linkClass) {
    const items = [
      { key: "youtube", icon: "bi-youtube", label: "YouTube" },
      { key: "facebook", icon: "bi-facebook", label: "Facebook" },
      { key: "whatsapp", icon: "bi-whatsapp", label: "WhatsApp" },
      { key: "instagram", icon: "bi-instagram", label: "Instagram" },
      { key: "tiktok", icon: "bi-tiktok", label: "TikTok" },
      { key: "x", icon: "bi-twitter-x", label: "X (Twitter)" }
    ];
    return items
      .filter((item) => social[item.key])
      .map((item) => `<a href="${escapeHtml(social[item.key])}" target="_blank" rel="noopener noreferrer" class="${linkClass}" aria-label="TFCG on ${item.label}"><i class="bi ${item.icon}" aria-hidden="true"></i></a>`)
      .join("");
  }

  function renderFooterSocial() {
    const el = $("footer-social");
    const social = window.TFCG_CONFIG.social;
    if (!el || !social) return;
    el.innerHTML = socialLinksHtml(social, "");
  }

  /* ---------------------------------------------------------- */
  /* Footer + WhatsApp float + copyright (every page)             */
  /* ---------------------------------------------------------- */

  function renderFooterChurchInfo() {
    const church = window.TFCG_CONTENT.church;
    if (!church) return;

    const tagline = $("footer-tagline");
    if (tagline) tagline.textContent = church.footer.tagline;

    const address = $("footer-address");
    if (address && church.contact) {
      address.innerHTML = `
        <p><i class="bi bi-geo-alt-fill" aria-hidden="true"></i> ${escapeHtml(church.contact.addressSingleLine)}</p>
        <p><i class="bi bi-envelope-fill" aria-hidden="true"></i> <a href="mailto:${escapeHtml(church.contact.email)}">${escapeHtml(church.contact.email)}</a></p>
        <p><i class="bi bi-telephone-fill" aria-hidden="true"></i> <a href="tel:${escapeHtml(church.contact.phoneE164)}">${escapeHtml(church.contact.phoneDisplay)}</a></p>
      `;
    }

    const ministryStatement = $("footer-ministry-statement");
    if (ministryStatement) ministryStatement.textContent = church.footer.ministryStatement;

    const copyright = $("footer-copyright");
    if (copyright) {
      copyright.textContent = `\u00A9 ${church.footer.copyrightYear} ${church.footer.copyrightName}. All Rights Reserved.`;
    }

    const credit = $("footer-credit-name");
    if (credit && credit.tagName === "A") {
      credit.textContent = church.footer.credit;
      if (church.footer.creditUrl) credit.href = church.footer.creditUrl;
    } else if (credit) {
      credit.textContent = church.footer.credit;
    }

    document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
      el.href = `https://wa.me/${church.contact.whatsappNumber}`;
    });
  }

  /* ---------------------------------------------------------- */
  /* Forms — wired to config/forms.json (Formspree)               */
  /* ---------------------------------------------------------- */

  function friendlyFormNotice(form, message) {
    let notice = form.querySelector(".form-not-configured-notice");
    if (!notice) {
      notice = document.createElement("div");
      notice.className = "form-not-configured-notice alert alert-warning mt-3 mb-0";
      form.appendChild(notice);
    }
    notice.textContent = message;
  }

  function wireForm(form, formKey) {
    if (!form || form.dataset.tfcgWired) return;
    form.dataset.tfcgWired = "true";

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let isValid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("is-invalid");
        } else {
          field.classList.remove("is-invalid");
        }
      });
      if (!isValid) return;

      const formsConfig = (window.TFCG_CONFIG.forms || {})[formKey];
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : "";

      if (!formsConfig || !formsConfig.endpoint) {
        /* TODO: Add a Formspree endpoint in config/forms.json under
           "contactForm" or "prayerRequest" to activate real submissions.
           See CONTENT_MANAGEMENT_GUIDE.md → "Connecting Your Forms". */
        friendlyFormNotice(form, "This form is not fully set up yet — please reach out to us directly by phone, email, or WhatsApp in the meantime. Thank you for your patience!");
        return;
      }

      if (btn) {
        btn.innerHTML = "Sending...";
        btn.disabled = true;
      }

      fetch(formsConfig.endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then((res) => {
          if (!res.ok) throw new Error("Submission failed");
          if (btn) {
            btn.innerHTML = "Message Sent Successfully";
            btn.classList.remove("btn-primary");
            btn.classList.add("btn-success");
          }
          form.reset();
          setTimeout(() => {
            if (btn) {
              btn.innerHTML = originalText;
              btn.classList.remove("btn-success");
              btn.classList.add("btn-primary");
              btn.disabled = false;
            }
          }, 2800);
        })
        .catch(() => {
          friendlyFormNotice(form, "Something went wrong sending your message. Please try again, or contact us directly by phone or WhatsApp.");
          if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }
        });
    });
  }

  function wireAllForms() {
    wireForm($("prayerForm"), "prayerRequest");
    wireForm($("modalPrayerForm"), "prayerRequest");
    wireForm($("contactForm"), "contactForm");
  }

  /* ---------------------------------------------------------- */
  /* Init                                                         */
  /* ---------------------------------------------------------- */

  /* ---------------------------------------------------------- */
  /* Media Centre — Photos / Videos / News & Updates              */
  /* ---------------------------------------------------------- */

  function buildCategoryFilterButtons(containerId, items) {
    const container = $(containerId);
    if (!container || !items) return;

    /* Idempotent: remove any category buttons from a previous render
       (keeping the "All" button) before rebuilding, so this is safe to
       call again if content is ever refreshed without a full page reload. */
    container.querySelectorAll('.filter-tab:not([data-category="all"])').forEach((btn) => btn.remove());

    const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "filter-tab";
      btn.setAttribute("data-category", cat);
      btn.textContent = cat;
      container.appendChild(btn);
    });
  }

  function formatMediaDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  let lightboxItems = [];
  let lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = index;
    const item = lightboxItems[lightboxIndex];
    if (!item) return;

    $("lightboxImage").src = item.image;
    $("lightboxImage").alt = item.alt || item.title || "";
    $("photoLightboxLabel").textContent = item.title || item.caption || "Photo";
    $("lightboxDate").textContent = formatMediaDate(item.date);
    $("lightboxDescription").textContent = item.description || item.caption || "";

    if (window.bootstrap) {
      const modalEl = $("photoLightboxModal");
      const instance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      instance.show();
    }
  }

  function renderMediaPhotos() {
    const grid = $("media-photos-grid");
    const gallery = window.TFCG_CONTENT.gallery;
    if (!grid || !gallery) return;

    lightboxItems = gallery;
    buildCategoryFilterButtons("photo-filter-tabs", gallery);

    grid.innerHTML = gallery.map((item, index) => `
      <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(index % 3 + 1) * 100}" data-photo-card data-category="${escapeHtml(item.category || "")}">
        <div class="media-photo-card" tabindex="0" role="button" aria-label="View photo: ${escapeHtml(item.title || item.caption || "")}" data-photo-index="${index}">
          ${item.category ? `<span class="media-category-pill">${escapeHtml(item.category)}</span>` : ""}
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.title || "")}" loading="lazy">
          <div class="media-card-overlay">
            <div class="media-card-title">${escapeHtml(item.title || item.caption || "")}</div>
            <div class="media-card-date">${escapeHtml(formatMediaDate(item.date))}</div>
          </div>
        </div>
      </div>
    `).join("");

    grid.querySelectorAll("[data-photo-index]").forEach((card) => {
      const open = () => openLightbox(Number(card.getAttribute("data-photo-index")));
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    /* Lightbox prev/next + keyboard navigation. Wired once; guarded so
       re-rendering (e.g. content refresh) doesn't double-bind. */
    if (!grid.dataset.tfcgLightboxWired) {
      grid.dataset.tfcgLightboxWired = "true";
      $("lightboxPrev").addEventListener("click", () => openLightbox((lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length));
      $("lightboxNext").addEventListener("click", () => openLightbox((lightboxIndex + 1) % lightboxItems.length));
      document.addEventListener("keydown", (e) => {
        const modalEl = $("photoLightboxModal");
        if (!modalEl || !modalEl.classList.contains("show")) return;
        if (e.key === "ArrowLeft") $("lightboxPrev").click();
        if (e.key === "ArrowRight") $("lightboxNext").click();
      });
    }
  }

  function youtubeIdFromUrl(url) {
    if (!url) return "";
    const match = url.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{6,})/);
    return match ? match[1] : "";
  }

  function renderMediaVideos() {
    const grid = $("media-videos-grid");
    const videos = window.TFCG_CONTENT.videos;
    if (!grid || !videos) return;

    buildCategoryFilterButtons("video-filter-tabs", videos);

    grid.innerHTML = videos.map((video, index) => {
      const videoId = video.youtubeId || youtubeIdFromUrl(video.youtubeUrl);
      const thumb = video.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "images/hero-bg.jpg");

      return `
        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(index % 3 + 1) * 100}" data-video-card data-category="${escapeHtml(video.category || "")}">
          <div class="sermon-card media-video-card" tabindex="0" role="button" aria-label="Play video: ${escapeHtml(video.title)}" data-video-index="${index}">
            <div class="sermon-card-thumb">
              ${video.category ? `<span class="sermon-category">${escapeHtml(video.category)}</span>` : ""}
              <img src="${escapeHtml(thumb)}" alt="${escapeHtml(video.title)}" loading="lazy">
              <i class="bi bi-play-circle-fill play-icon" style="position:relative;z-index:2;" aria-hidden="true"></i>
            </div>
            <div class="sermon-card-body">
              <h3 class="h4">${escapeHtml(video.title)}</h3>
              <p class="sermon-meta"><span class="scripture">${escapeHtml(formatMediaDate(video.date))}</span></p>
              <p class="text-secondary small mb-0">${escapeHtml(video.description || "")}</p>
            </div>
          </div>
        </div>
      `;
    }).join("");

    grid.querySelectorAll("[data-video-index]").forEach((card) => {
      const open = () => {
        const video = videos[Number(card.getAttribute("data-video-index"))];
        const videoId = video.youtubeId || youtubeIdFromUrl(video.youtubeUrl);
        const frameWrap = $("videoPlayerFrameWrap");
        $("videoPlayerLabel").textContent = video.title;
        $("videoPlayerDescription").textContent = video.description || "";

        if (videoId) {
          frameWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="${escapeHtml(video.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
          if (window.bootstrap) window.bootstrap.Modal.getOrCreateInstance($("videoPlayerModal")).show();
        } else if (video.youtubeUrl) {
          /* No specific video ID yet — open the channel/link directly
             instead of a broken embed. Add a "youtubeId" in
             content/videos.json once a specific video is published to
             enable inline playback. */
          window.open(video.youtubeUrl, "_blank", "noopener,noreferrer");
        }
      };
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    /* Clear the embedded iframe when the modal closes so playback stops. */
    const videoModal = $("videoPlayerModal");
    if (videoModal && !videoModal.dataset.tfcgWired) {
      videoModal.dataset.tfcgWired = "true";
      videoModal.addEventListener("hidden.bs.modal", () => {
        $("videoPlayerFrameWrap").innerHTML = "";
      });
    }
  }

  function renderMediaUpdates() {
    const grid = $("media-updates-grid");
    const updates = window.TFCG_CONTENT.updates;
    if (!grid || !updates) return;

    buildCategoryFilterButtons("update-filter-tabs", updates);

    /* Sort newest first — FUTURE: this is also where pagination could
       slice the sorted array into pages once the list grows long. */
    const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));

    grid.innerHTML = sorted.map((update, index) => `
      <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(index % 3 + 1) * 100}" data-update-card data-category="${escapeHtml(update.category || "")}">
        <div class="media-update-card">
          ${update.coverImage ? `<div class="update-cover"><img src="${escapeHtml(update.coverImage)}" alt="${escapeHtml(update.title)}" loading="lazy"></div>` : ""}
          <div class="update-body">
            ${update.category ? `<span class="badge-gold align-self-start mb-2">${escapeHtml(update.category)}</span>` : ""}
            <p class="update-date">${escapeHtml(formatMediaDate(update.date))}</p>
            <h3 class="h5 text-white">${escapeHtml(update.title)}</h3>
            <p class="update-summary">${escapeHtml(update.summary)}</p>
            <button type="button" class="btn btn-outline-gold btn-sm align-self-start mt-2" data-update-index="${index}">Read More</button>
          </div>
        </div>
      </div>
    `).join("");

    grid.querySelectorAll("[data-update-index]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const update = sorted[Number(btn.getAttribute("data-update-index"))];
        $("updateReadMoreLabel").textContent = update.title;
        $("updateReadMoreMeta").textContent = `${formatMediaDate(update.date)}${update.category ? " · " + update.category : ""}`;
        $("updateReadMoreContent").innerHTML = `<p>${escapeHtml(update.content || update.summary).split("\n\n").join("</p><p>")}</p>`;
        if (window.bootstrap) window.bootstrap.Modal.getOrCreateInstance($("updateReadMoreModal")).show();
      });
    });
  }

  function renderAll() {
    renderAnnouncementBar();
    renderHero();
    renderStats();
    renderHomeAbout();
    renderServiceTimes();
    renderFooterServiceTimes();
    renderHomeMinistriesPreview();
    renderTestimonials();

    renderAboutStory();
    renderAboutVisionMandate();
    renderStatementOfFaith();
    renderLeadership();
    renderGallery();

    renderMinistries();
    renderSermons();
    renderBooks();
    renderEvents();

    renderGiving();
    renderLivestream();

    renderMediaPhotos();
    renderMediaVideos();
    renderMediaUpdates();

    renderContactInfo();
    renderFAQs();
    renderFooterSocial();
    renderFooterChurchInfo();

    wireAllForms();

    if (typeof AOS !== "undefined") {
      AOS.refreshHard ? AOS.refreshHard() : AOS.refresh();
    }
    if (typeof window.TFCG_setupFilters === "function") {
      window.TFCG_setupFilters();
    }
    if (typeof window.TFCG_setupCounters === "function") {
      window.TFCG_setupCounters();
    }
  }

  if (window.TFCG_CONTENT && window.TFCG_CONTENT.church) {
    /* content-loader already finished (unlikely but safe to check) */
    renderAll();
  } else {
    document.addEventListener("tfcg:content-ready", renderAll);
  }
})();
