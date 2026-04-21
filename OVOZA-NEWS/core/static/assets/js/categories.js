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
  function animCount(el, target, ms) {
    if (!el) return;
    let v = 0;
    const step = Math.ceil(target / (ms / 16));
    const t = setInterval(() => {
      v += step; if (v >= target) { v = target; clearInterval(t); }
      el.textContent = v.toLocaleString("ru-RU");
    }, 16);
  }
  let countersRan = false;
  const cObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersRan) {
      countersRan = true;
      animCount(document.getElementById("statArticles"), 1892, 1200);
      animCount(document.getElementById("statToday"),      47,  800);
    }
  });
  const hero = document.querySelector(".page-hero");
  if (hero) cObs.observe(hero);

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
        const url = `category-detail.html?cat=${key}`;

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
})();
