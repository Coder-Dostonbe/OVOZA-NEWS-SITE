/* ===== OVOZA NEWS — NEWS LIST PAGE JS ===== */
(function () {
  "use strict";

  /* ─── Live clock ──────────────────────────────────── */
  const dateEl = document.getElementById("topbarDate");
  if (dateEl) {
    const days   = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
    const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
    function tick() {
      const n = new Date();
      dateEl.textContent = `${days[n.getDay()]}, ${n.getDate()} ${months[n.getMonth()]} ${n.getFullYear()}`;
    }
    tick(); setInterval(tick, 60000);
  }

  /* ─── Lang switcher ───────────────────────────────── */
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ─── Mobile nav ──────────────────────────────────── */
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
  const navbar = document.querySelector(".main-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 50
        ? "0 4px 30px rgba(0,0,0,0.8)"
        : "0 2px 20px rgba(0,0,0,0.5)";
    });
  }

  /* ─── Category filter ─────────────────────────────── */
  const allItems   = Array.from(document.querySelectorAll(".news-item[data-cat]"));
  const filterBtns = document.querySelectorAll(".filter-cat");
  const resultEl   = document.getElementById("resultCount");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      filterBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      const cat = this.dataset.cat;
      filterNews(cat);
    });
  });

  function filterNews(cat) {
    let visible = 0;
    allItems.forEach(item => {
      const itemCat = item.dataset.cat;
      const show = cat === "all" || itemCat === cat;
      item.style.display = show ? "" : "none";
      if (show) visible++;
    });

    // Also hide/show dividers
    document.querySelectorAll(".news-divider").forEach(div => {
      div.style.display = cat === "all" ? "" : "none";
    });

    if (resultEl) {
      const counts = { all:247, siyosat:48, iqtisod:62, sport:83, tech:44, dunyo:55, jamiyat:35 };
      resultEl.textContent = `${counts[cat] || visible} ta yangilik topildi`;
    }
  }

  /* ─── View toggle (List ↔ Grid) ───────────────────── */
  const listViewBtn = document.getElementById("listViewBtn");
  const gridViewBtn = document.getElementById("gridViewBtn");
  const newsList    = document.getElementById("newsList");

  if (listViewBtn && gridViewBtn && newsList) {
    listViewBtn.addEventListener("click", () => {
      newsList.classList.remove("grid-view");
      listViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");
      // Restore horizontal layout for non-featured items
      document.querySelectorAll(".news-item:not(.featured)").forEach(item => {
        item.style.flexDirection = "";
        const img = item.querySelector(".ni-img");
        if (img) img.style.width = "";
      });
    });

    gridViewBtn.addEventListener("click", () => {
      newsList.classList.add("grid-view");
      gridViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");
    });
  }

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

  /* ─── News item click animation ───────────────────── */
  allItems.forEach(item => {
    item.addEventListener("click", function () {
      this.style.opacity = "0.7";
      setTimeout(() => { this.style.opacity = ""; }, 300);
    });
  });

  /* ─── News item staggered entrance ───────────────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = "1";
        e.target.style.transform = "translateX(0)";
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.07 });

  allItems.forEach((item, i) => {
    item.style.opacity    = "0";
    item.style.transform  = "translateX(-16px)";
    item.style.transition = `opacity 0.4s ease ${i * 70}ms, transform 0.4s ease ${i * 70}ms, border-color 0.28s ease, box-shadow 0.28s ease`;
    io.observe(item);
  });

  /* ─── Newsletter form ─────────────────────────────── */
  const nlForm = document.getElementById("newsletterForm");
  if (nlForm) {
    nlForm.addEventListener("submit", e => {
      e.preventDefault();
      const input = nlForm.querySelector("input");
      const btn   = nlForm.querySelector("button");
      if (input && input.value.trim()) {
        if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Obuna bo\'ldingiz!'; btn.style.background = "#27ae60"; }
        input.value = "";
        setTimeout(() => {
          if (btn) { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Obuna bo\'lish'; btn.style.background = ""; }
        }, 3000);
      }
    });
  }

  /* ─── Tag pills ───────────────────────────────────── */
  document.querySelectorAll(".tag-item").forEach(tag => {
    tag.addEventListener("click", function () {
      this.style.borderColor = "var(--primary)";
      this.style.color = "var(--white)";
      setTimeout(() => { this.style.borderColor = ""; this.style.color = ""; }, 800);
    });
  });

  /* ─── Scroll to top ───────────────────────────────── */
  const scrollBtn = document.getElementById("scrollTop");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.opacity       = window.scrollY > 400 ? "1" : "0";
      scrollBtn.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
    });
    scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ─── URL param — filter from other pages ─────────── */
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("cat");
  if (catParam) {
    const matchBtn = document.querySelector(`.filter-cat[data-cat="${catParam}"]`);
    if (matchBtn) { matchBtn.click(); }
  }

  console.log("Ovoza – news.js yuklandi");
})();
