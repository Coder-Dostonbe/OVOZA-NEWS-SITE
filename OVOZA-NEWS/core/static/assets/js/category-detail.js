/* ===== OVOZA NEWS — CATEGORY DETAIL JS ===== */
(function () {
  "use strict";

  /* ─── Live clock ──────────────────────────────────── */
  const dateEl = document.getElementById("topbarDate");
  if (dateEl) {
    const days   = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
    const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
    function tick() {
      const n = new Date();
      dateEl.textContent = `${days[n.getDay()]}, ${n.getDate()} ${months[n.getMonth()]} ${n.getFullYear()} | ${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;
    }
    tick(); setInterval(tick, 30000);
  }

  /* ─── Lang switcher ───────────────────────────────── */
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ─── Mobile nav toggle ───────────────────────────── */
  const navToggler = document.getElementById("navToggler");
  const navMenu    = document.getElementById("navMenu");
  if (navToggler && navMenu) {
    navToggler.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const ic = navToggler.querySelector("i");
      if (ic) { ic.classList.toggle("fa-bars"); ic.classList.toggle("fa-times"); }
    });
  }

  /* ─── Sticky navbar shadow ────────────────────────── */
  const navbar    = document.querySelector(".main-navbar");
  const scrollBtn = document.getElementById("scrollTop");
  window.addEventListener("scroll", () => {
    if (navbar) navbar.style.boxShadow = window.scrollY > 50
      ? "0 4px 30px rgba(0,0,0,0.8)" : "0 2px 20px rgba(0,0,0,0.5)";
    if (scrollBtn) {
      scrollBtn.style.opacity       = window.scrollY > 400 ? "1" : "0";
      scrollBtn.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
    }
  });

  /* ─── Scroll to top ───────────────────────────────── */
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ─── Stats animation ─────────────────────────────── */
  function animCount(el, target, ms) {
  if (!el) return Promise.resolve();
  return new Promise(resolve => {
    let v = 0;
    const totalSteps = ms / 16;
    const step = target / totalSteps; // Math.ceil o'rniga oddiy bo'linma
    const t = setInterval(() => {
      v += step;
      if (v >= target) { v = target; clearInterval(t); resolve(); }
      el.textContent = Math.floor(v).toLocaleString("ru-RU");
    }, 16);
  });
}

  async function runStats() {
  const statArticles = document.getElementById("statArticles");
  const statToday    = document.getElementById("statToday");
  const statViews    = document.getElementById("statViews");

  const articlesVal = parseInt(statArticles?.textContent || 0);
  const todayVal    = parseInt(statToday?.textContent    || 0);
  const viewsVal    = parseInt(statViews?.textContent    || 0);

  // 0 ga o'zgartirmaymiz — loader yopilgandan keyin animatsiya boshlanadi
  await animCount(statArticles, articlesVal, 1200);
  await animCount(statToday,    todayVal,    800);
  await animCount(statViews,    viewsVal,    1000);
}

/* ─── Sub-tabs AJAX ───────────────────────────────── */

// Sahifa ochilganda dastlabki holatni saqlaymiz
const initialFeatured = document.querySelector('.featured-article')?.outerHTML || '';
const initialGrid = document.getElementById('articlesGrid')?.innerHTML || '';

document.querySelectorAll(".cat-tab").forEach(tab => {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".cat-tab").forEach(t => t.classList.remove("active"));
    this.classList.add("active");

    const tabKey = this.dataset.tab;

    // Barchasi tabida dastlabki holatga qaytamiz
    if (tabKey === 'all') {
      const featuredWrap = document.querySelector('.featured-article');
      if (featuredWrap) {
        featuredWrap.outerHTML = initialFeatured;
      } else {
        const contentArea = document.querySelector('.content-area');
        if (contentArea) contentArea.insertAdjacentHTML('afterbegin', initialFeatured);
      }
      const grid = document.getElementById('articlesGrid');
      if (grid) grid.innerHTML = initialGrid;
      return;
    }

    // Boshqa tablarda AJAX
    const slug = window.location.pathname.split('/')[2];

    fetch(`/category/${slug}/posts/?tab=${tabKey}`)
      .then(r => r.json())
      .then(data => {

        // ── Featured yangilash ──
        const featuredWrap = document.querySelector('.featured-article');
        if (data.featured) {
          if (featuredWrap) {
            featuredWrap.style.display = '';
            featuredWrap.href = data.featured.url;
            const img = featuredWrap.querySelector('img');
            if (img) img.src = data.featured.image;
            const title = featuredWrap.querySelector('.featured-title');
            if (title) title.textContent = data.featured.title;
            const meta = featuredWrap.querySelector('.featured-meta');
            if (meta) meta.innerHTML = `
              <span><i class="far fa-user"></i> ${data.featured.author}</span>
              <span><i class="far fa-clock"></i> ${data.featured.time_since}</span>
              <span><i class="far fa-eye"></i> ${data.featured.views}</span>
              <span><i class="far fa-comment"></i> ${data.featured.comments}</span>
            `;
          }
        } else {
          if (featuredWrap) featuredWrap.style.display = 'none';
        }

        // ── Grid yangilash ──
        const grid = document.getElementById("articlesGrid");
        if (!grid) return;

        if (!data.posts.length) {
          grid.innerHTML = `
            <div class="empty-wrapper">
              <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-newspaper"></i></div>
                <h3 class="empty-title">Hozircha maqola yo'q</h3>
                <p class="empty-desc">Bu bo'limda hali maqolalar qo'shilmagan.</p>
              </div>
            </div>`;
          return;
        }

        grid.innerHTML = data.posts.map((post, i) => `
          <a href="${post.url}" class="art-card ${i % 3 === 2 ? 'wide' : ''}">
            <div class="art-card-img tall">
              ${post.image ? `<img src="${post.image}" alt="${post.title}" loading="lazy" />` : ''}
              <span class="art-card-tag">${post.category_name || ''}</span>
            </div>
            <div class="art-card-body">
              <div class="art-card-title">${post.title}</div>
              <div class="art-card-excerpt">${post.short_description}</div>
              <div class="art-card-footer">
                <span><i class="far fa-clock"></i> ${post.time_since} &nbsp;·&nbsp; <i class="far fa-eye"></i> ${post.views}</span>
                <span class="art-read-more">O'qish <i class="fas fa-arrow-right"></i></span>
              </div>
            </div>
          </a>
        `).join('');

        // Animatsiya
        grid.querySelectorAll('.art-card').forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(18px)';
          card.style.transition = `opacity 0.4s ease ${i * 50}ms, transform 0.4s ease ${i * 50}ms`;
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        });
      });
  });
});

  /* ─── Pagination ──────────────────────────────────── */
  document.querySelectorAll(".page-btn:not(.disabled)").forEach(btn => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".page-btn:not(.disabled)").forEach(b => {
        if (!b.querySelector("i")) b.classList.remove("active");
      });
      if (!this.querySelector("i")) {
        this.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  /* ─── Art card entrance animation ────────────────── */
  const cards = document.querySelectorAll(".art-card, .featured-article");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = "1";
        e.target.style.transform = "translateY(0)";
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  cards.forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(18px)";
    card.style.transition = `opacity 0.45s ease ${i * 60}ms, transform 0.45s ease ${i * 60}ms, box-shadow 0.28s ease, border-color 0.28s ease`;
    io.observe(card);
  });

  /* ─── View Transitions — Orqaga qaytish ──────────── */
  function goBackWithTransition(url) {
    if (document.startViewTransition) {
      document.documentElement.classList.add("going-back");
      document.startViewTransition(() => {
        window.location.href = url;
      });
    } else {
      window.location.href = url;
    }
  }

  document.querySelectorAll(".breadcrumb a").forEach(link => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href !== "#") {
        e.preventDefault();
        goBackWithTransition(href);
      }
    });
  });

  document.querySelectorAll(".nav-menu a, .nav-item a").forEach(link => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.includes("categories")) {
        e.preventDefault();
        goBackWithTransition(href);
      }
    });
  });

  /* ─── Page loader + stats ─────────────────────────── */
  window.addEventListener('load', function () {
  // Avval raqamlarni 0 qilamiz — loader ostida
  const statArticles = document.getElementById("statArticles");
  const statToday    = document.getElementById("statToday");
  const statViews    = document.getElementById("statViews");

  const articlesVal = parseInt(statArticles?.textContent || 0);
  const todayVal    = parseInt(statToday?.textContent    || 0);
  const viewsVal    = parseInt(statViews?.textContent    || 0);

  if (statArticles) statArticles.textContent = "0";
  if (statToday)    statToday.textContent    = "0";
  if (statViews)    statViews.textContent    = "0";

  setTimeout(function () {
    const loader = document.getElementById('pageLoader');
    if (loader) {
      loader.classList.add('hidden');

    }
    // Loader yopilishi bilan animatsiya boshlanadi
    animCount(statArticles, articlesVal, 400).then(() =>
      animCount(statToday, todayVal, 400).then(() =>
        animCount(statViews, viewsVal, 600)
      )
    );
  }, 1100);
});
})();