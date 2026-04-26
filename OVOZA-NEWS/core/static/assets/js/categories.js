/* ===== OVOZA NEWS — CATEGORIES PAGE JS (View Transitions) ===== */
(function () {
  "use strict";

  /* ─── Live clock ─────────────────────────────────────── */
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

  /* ─── Lang switcher ──────────────────────────────────── */
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ─── Mobile nav ─────────────────────────────────────── */
  const navToggler = document.getElementById("navToggler");
  const navMenu    = document.getElementById("navMenu");
  if (navToggler && navMenu) {
    navToggler.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const ic = navToggler.querySelector("i");
      if (ic) { ic.classList.toggle("fa-bars"); ic.classList.toggle("fa-times"); }
    });
  }

  /* ─── Sticky navbar shadow ───────────────────────────── */
  const navbar = document.querySelector(".main-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 50
        ? "0 4px 30px rgba(0,0,0,0.8)" : "0 2px 20px rgba(0,0,0,0.5)";
    });
  }

  /* ─── Animated counters ──────────────────────────────── */
  /* ─── Animated counters ──────────────────────────────────── */
function typeText(el, text, ms) {
  if (!el) return Promise.resolve();
  el.textContent = "";
  return new Promise(resolve => {
    let i = 0;
    const t = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) { clearInterval(t); resolve(); }
    }, ms / text.length);
  });
}

function animCount(el, target, ms) {
  if (!el) return Promise.resolve();
  return new Promise(resolve => {
    let v = 0;
    const step = Math.ceil(target / (ms / 16));
    const t = setInterval(() => {
      v += step;
      if (v >= target) { v = target; clearInterval(t); resolve(); }
      el.textContent = v.toLocaleString("ru-RU");
    }, 16);
  });
}

async function runCounters() {
  const statArticles = document.getElementById("statArticles");
  const statCat      = document.querySelector(".hero-stat-item:nth-child(2) .hero-stat-num");
  const statToday    = document.getElementById("statToday");

  const labelArticles = statArticles?.nextElementSibling;
  const labelCat      = statCat?.nextElementSibling;
  const labelToday    = statToday?.nextElementSibling;

  const articlesVal = parseInt(statArticles?.textContent || 0);
  const catVal      = parseInt(statCat?.textContent || 0);
  const todayVal    = parseInt(statToday?.textContent || 0);

  // Barchasini nolga tushiramiz
  if (statArticles) statArticles.textContent = "0";
  if (statCat)      statCat.textContent      = "0";
  if (statToday)    statToday.textContent    = "0";
  if (labelArticles) labelArticles.textContent = "";
  if (labelCat)      labelCat.textContent      = "";
  if (labelToday)    labelToday.textContent    = "";

  // 1 — Jami maqola
  await animCount(statArticles, articlesVal, 1200);
  await typeText(labelArticles, "Jami maqola", 400);

  // 2 — Kategoriya
  await animCount(statCat, catVal, 800);
  await typeText(labelCat, "Kategoriya", 350);

  // 3 — Bugun
  await animCount(statToday, todayVal, 600);
  await typeText(labelToday, "Bugun", 300);
}



  /* ─── Card staggered entrance ────────────────────────── */
  const allCards = document.querySelectorAll(".cat-card");
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); cardObs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  allCards.forEach((c, i) => {
    c.style.transitionDelay = `${i * 55}ms`;
    cardObs.observe(c);
  });

  /* ─── Card click — View Transitions ─────────────────── */
  document.querySelectorAll(".cat-card[data-cat]").forEach(card => {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      const key    = this.dataset.cat;
      const cardEl = this;
      if (!key) return;

      /* Press feedback */
      cardEl.classList.add("pressing");

      setTimeout(() => {
        cardEl.classList.remove("pressing");
        const url = `/category/${key}/`;

        if (document.startViewTransition) {
          document.startViewTransition(() => {
            window.location.href = url;
          });
        } else {
          window.location.href = url;
        }
      }, 130);
    });
  });

  /* ─── Filter tags ────────────────────────────────────── */
  document.querySelectorAll(".filter-tag").forEach(btn => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter-tag").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      const counts = { all:12, news:10, analysis:8, interview:5, video:3 };
      const el = document.getElementById("visibleCount");
      if (el) el.textContent = `${counts[this.dataset.filter] || 12} ta kategoriya`;
    });
  });

  /* ─── Sort select ────────────────────────────────────── */
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      const grid  = document.getElementById("catGrid");
      if (!grid) return;
      const items = Array.from(grid.querySelectorAll(".cat-card:not(.featured)"));
      if (this.value === "az") {
        items.sort((a, b) => {
          const na = (a.querySelector(".cat-card-name") || a.querySelector(".cat-card-name-side"))?.textContent.trim() || "";
          const nb = (b.querySelector(".cat-card-name") || b.querySelector(".cat-card-name-side"))?.textContent.trim() || "";
          return na.localeCompare(nb, "uz");
        });
        items.forEach(item => grid.appendChild(item));
      }
    });
  }

  /* ─── Tag pills ──────────────────────────────────────── */
  document.querySelectorAll(".tag-pill").forEach(pill => {
    pill.addEventListener("click", function () {
      this.style.borderColor = "var(--primary)";
      this.style.color = "var(--white)";
      setTimeout(() => { this.style.borderColor = ""; this.style.color = ""; }, 800);
    });
  });

  /* ─── Scroll to top ──────────────────────────────────── */
  const scrollBtn = document.getElementById("scrollTop");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.opacity       = window.scrollY > 400 ? "1" : "0";
      scrollBtn.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
    });
    scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  console.log("Ovoza – categories.js (View Transitions) yuklandi");
  window.runCounters = runCounters;
})();

/* ─── Search overlay ─────────────────────────────────── */
  const searchOverlay  = document.getElementById("searchOverlay");
  const searchTrigger  = document.getElementById("searchTriggerNav");
  const searchOvClose  = document.getElementById("searchOvClose");
  const searchOvInput  = document.getElementById("searchOvInput");
  searchOvInput?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const q = this.value.trim();
        if (q) window.location.href = `/search/?q=${encodeURIComponent(q)}`;
    }
});

  if (searchTrigger) {
    searchTrigger.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      setTimeout(() => searchOvInput?.focus(), 200);
    });
  }

  if (searchOvClose) {
    searchOvClose.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
    });
  }

  // ESC bilan yopish
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") searchOverlay?.classList.remove("active");
  });

  // Ctrl+K bilan ochish
  document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      searchOverlay?.classList.add("active");
      setTimeout(() => searchOvInput?.focus(), 200);
    }
  });

  // Overlay tashqarisiga bosib yopish
  searchOverlay?.addEventListener("click", e => {
    if (e.target === searchOverlay) searchOverlay.classList.remove("active");
  });

  // Tez o'tish teglari
  document.querySelectorAll(".search-ov-tag").forEach(tag => {
    tag.addEventListener("click", function() {
      if (searchOvInput) searchOvInput.value = this.dataset.q;
      searchOvInput?.focus();
    });
  });

  window.addEventListener('load', function () {
    setTimeout(function () {
      document.getElementById('pageLoader').classList.add('hidden');
    }, 1100);

    setTimeout(function () {
      if (typeof runCounters === 'function') runCounters();
    }, 1100);  // loader (1100ms) + biroz kutish (500ms)
  });