/*
  TFCG Content Renderer
  Builds cards/sections from the content/*.js data files so pages can be
  updated by editing data only. Markup mirrors the original hand-written
  HTML exactly so the design system classes still apply unchanged.
*/
(function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderBooks() {
    const grid = document.getElementById("books-grid");
    if (!grid || !window.BOOKS_DATA) return;

    grid.innerHTML = window.BOOKS_DATA.map((book, index) => {
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
    const list = document.getElementById("events-list");
    if (!list || !window.EVENTS_DATA) return;

    list.innerHTML = window.EVENTS_DATA.map((ev, index) => {
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
    const grid = document.getElementById("sermons-grid");
    if (!grid || !window.SERMONS_DATA) return;

    const author = (window.CHURCH_INFO && window.CHURCH_INFO.pastor && window.CHURCH_INFO.pastor.name) || "Pastor Godspower Opara Martins";

    grid.innerHTML = window.SERMONS_DATA.map((s, index) => {
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

  function renderMinistries() {
    const grid = document.getElementById("ministries-grid");
    if (!grid || !window.MINISTRIES_DATA) return;

    grid.innerHTML = window.MINISTRIES_DATA.map((m, index) => {
      const delay = (index % 3 + 1) * 100;
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
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderBooks();
    renderEvents();
    renderSermons();
    renderMinistries();

    /* Re-init AOS after dynamic content injection so scroll animations still apply */
    if (typeof AOS !== "undefined") {
      AOS.refreshHard ? AOS.refreshHard() : AOS.refresh();
    }
  });
})();
