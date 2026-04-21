/* ===== OVOZA NEWS — CATEGORY DETAIL JS ===== */
(function () {
  "use strict";

  /* ─── Category config ─────────────────────────────────
     Har kategoriya uchun: rang, icon, nom, tavsif, statistika
  ──────────────────────────────────────────────────────── */
  const CATEGORIES = {
    sport: {
      name:    "Sport",
      icon:    "fa-trophy",
      color1:  "#c0392b",
      color2:  "#7b241c",
      desc:    "Futbol, boks, kurash, basketbol va barcha sport turlaridan so'nggi yangiliklar, natijalar va tahlillar.",
      articles: 312,
      today:   14,
      image:   "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=80&auto=format&fit=crop",
      tags:    ["#Futbol","#Boks","#Kurash","#Olimpiada","#Pakhtakor","#Tennis","#Basketbol","#Taekwondo","#Milliy jamoasi","#Chempionat"],
    },
    siyosat: {
      name:    "Siyosat",
      icon:    "fa-landmark",
      color1:  "#2471a3",
      color2:  "#154360",
      desc:    "O'zbekiston va dunyo siyosiy hayoti: parlament qarorlari, diplomatik munosabatlar va siyosiy tahlillar.",
      articles: 248,
      today:   9,
      image:   "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900&q=80&auto=format&fit=crop",
      tags:    ["#Parlament","#Prezident","#Diplomatiya","#Qonun","#Hukumat","#Saylov","#MDH","#Tashqi siyosat"],
    },
    iqtisod: {
      name:    "Iqtisod",
      icon:    "fa-chart-line",
      color1:  "#1e8449",
      color2:  "#145a32",
      desc:    "Valyuta kurslari, birja, biznes yangiliklari, investitsiyalar va makroiqtisodiy ko'rsatkichlar.",
      articles: 196,
      today:   11,
      image:   "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80&auto=format&fit=crop",
      tags:    ["#Dollar","#So'm","#Birja","#Investitsiya","#GDP","#Biznes","#Bank","#Eksport"],
    },
    texnologiya: {
      name:    "Texnologiya",
      icon:    "fa-microchip",
      color1:  "#6c3483",
      color2:  "#4a235a",
      desc:    "Sun'iy intellekt, 5G, IT-sanoat, startaplar va O'zbekiston raqamli transformatsiyasi.",
      articles: 174,
      today:   8,
      image:   "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop",
      tags:    ["#AI","#5G","#IT-Park","#Startup","#Dasturlash","#Raqamlashtirish","#Kiberhavfsizlik"],
    },
    dunyo: {
      name:    "Dunyo",
      icon:    "fa-globe-asia",
      color1:  "#1a5276",
      color2:  "#0e2f44",
      desc:    "Xalqaro voqealar, geosiyosat, MDH, Yevropa, Amerika va Osiyo bo'yicha xabarlar.",
      articles: 287,
      today:   16,
      image:   "https://images.unsplash.com/photo-1491466424936-e304919aada7?w=900&q=80&auto=format&fit=crop",
      tags:    ["#BMT","#NATO","#G20","#Yevropa","#AQSh","#Xitoy","#Rossiya","#MDH"],
    },
    jamiyat: {
      name:    "Jamiyat",
      icon:    "fa-users",
      color1:  "#b7950b",
      color2:  "#7d6608",
      desc:    "Ta'lim, atrof-muhit, ijtimoiy muammolar va fuqarolik hayotiga oid materiallar.",
      articles: 143,
      today:   6,
      image:   "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80&auto=format&fit=crop",
      tags:    ["#Ta'lim","#Ekologiya","#Salomatlik","#Oila","#Yoshlar","#Madaniyat"],
    },
    madaniyat: {
      name:    "Madaniyat",
      icon:    "fa-palette",
      color1:  "#943126",
      color2:  "#641e16",
      desc:    "San'at, musiqa, kino, teatr, adabiyot va O'zbekiston madaniy merosi bo'yicha yangiliklar.",
      articles: 118,
      today:   5,
      image:   "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=900&q=80&auto=format&fit=crop",
      tags:    ["#Musiqa","#Kino","#Teatr","#San'at","#Adabiyot","#Festival","#Meros"],
    },
    salomatlik: {
      name:    "Salomatlik",
      icon:    "fa-heartbeat",
      color1:  "#117a65",
      color2:  "#0b5345",
      desc:    "Tibbiyot yangiliklari, sog'lom turmush tarzi va sog'liqni saqlash tizimi haqida.",
      articles: 92,
      today:   4,
      image:   "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=80&auto=format&fit=crop",
      tags:    ["#Tibbiyot","#Sog'lom turmush","#Shifokor","#Kasalxona","#Fitness","#Ruhiyat"],
    },
  };

  /* ─── Read URL param ──────────────────────────────── */
  const params  = new URLSearchParams(window.location.search);
  const catKey  = (params.get("cat") || "sport").toLowerCase();
  const cat     = CATEGORIES[catKey] || CATEGORIES.sport;

  /* ─── Apply category colors (CSS vars) ───────────── */
  function applyColor(c1, c2) {
    document.documentElement.style.setProperty("--cat-color-1", c1);
    document.documentElement.style.setProperty("--cat-color-2", c2);
  }
  applyColor(cat.color1, cat.color2);

  /* ─── Fill hero ───────────────────────────────────── */
  const heroName    = document.getElementById("heroName");
  const heroIcon    = document.getElementById("heroIcon");
  const heroDesc    = document.getElementById("heroDesc");
  const heroBigIcon = document.getElementById("heroBigIcon");
  const breadCat    = document.getElementById("breadCrumbCat");
  const featBadge   = document.getElementById("featuredBadge");
  const trendTitle  = document.getElementById("trendingTitle");
  const pageTitle   = document.getElementById("pageTitle");

  if (heroName)    heroName.textContent    = cat.name;
  if (heroDesc)    heroDesc.textContent    = cat.desc;
  if (breadCat)    breadCat.textContent    = cat.name;
  if (trendTitle)  trendTitle.textContent  = `${cat.name} — Trendlar`;
  if (pageTitle)   pageTitle.textContent   = `${cat.name} – Ovoza Yangiliklar Portali`;

  if (heroIcon) {
    heroIcon.className = `fas ${cat.icon}`;
  }
  if (heroBigIcon) {
    heroBigIcon.className = `cat-hero-big-icon fas ${cat.icon}`;
  }
  if (featBadge) {
    featBadge.innerHTML = `<i class="fas ${cat.icon}"></i> ${cat.name}`;
  }

  /* Article tags update */
  document.querySelectorAll(".art-card-tag").forEach(el => {
    el.textContent = cat.name;
  });
  document.querySelectorAll(".featured-badge").forEach(el => {
    el.style.background = cat.color1;
  });

  /* Stats counter */
  function animCount(el, target, ms) {
    if (!el) return;
    let v = 0; const step = Math.ceil(target / (ms / 16));
    const t = setInterval(() => {
      v += step;
      if (v >= target) { v = target; clearInterval(t); }
      el.textContent = v.toLocaleString("ru-RU");
    }, 16);
  }
  const statArticles = document.getElementById("statArticles");
  const statToday    = document.getElementById("statToday");
  if (statArticles) statArticles.textContent = cat.articles;
  if (statToday)    statToday.textContent    = cat.today;

  // Animate on load
  setTimeout(() => {
    animCount(statArticles, cat.articles, 1000);
    animCount(statToday,    cat.today,    700);
  }, 400);

  /* Tags sidebar */
  const tagsWrap = document.querySelector(".tags-wrap");
  if (tagsWrap && cat.tags) {
    tagsWrap.innerHTML = cat.tags
      .map(t => `<span class="tag-item">${t}</span>`)
      .join("");
    tagsWrap.querySelectorAll(".tag-item").forEach(pill => {
      pill.addEventListener("click", function () {
        this.style.borderColor = cat.color1;
        this.style.color = "#fff";
        setTimeout(() => {
          this.style.borderColor = "";
          this.style.color = "";
        }, 900);
      });
    });
  }

  /* Featured image update */
  const featImg = document.querySelector(".featured-article img");
  if (featImg && cat.image) featImg.src = cat.image;

  /* ─── Sub-tabs ────────────────────────────────────── */
  document.querySelectorAll(".cat-tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".cat-tab").forEach(t => t.classList.remove("active"));
      this.classList.add("active");
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
  const navbar = document.querySelector(".main-navbar");
  window.addEventListener("scroll", () => {
    if (navbar) navbar.style.boxShadow = window.scrollY > 50
      ? "0 4px 30px rgba(0,0,0,0.8)" : "0 2px 20px rgba(0,0,0,0.5)";
    if (scrollBtn) {
      scrollBtn.style.opacity = window.scrollY > 400 ? "1" : "0";
      scrollBtn.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
    }
  });

  /* ─── Scroll to top ───────────────────────────────── */
  const scrollBtn = document.getElementById("scrollTop");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

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

  /* ─── View Transitions — Orqaga qaytish ──────────────
     Breadcrumb va "Kategoriyalar" linklari bosilganda
     going-back klassini qo'shib transition bilan qaytadi
  ─────────────────────────────────────────────────────── */
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

  /* Breadcrumb linklar */
  document.querySelectorAll(".breadcrumb a").forEach(link => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href !== "#") {
        e.preventDefault();
        goBackWithTransition(href);
      }
    });
  });

  /* Navbar — Categories link */
  document.querySelectorAll(".nav-menu a, .nav-item a").forEach(link => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.includes("categories")) {
        e.preventDefault();
        goBackWithTransition(href);
      }
    });
  });

  console.log(`Ovoza – category-detail.js yuklandi | kategoriya: ${cat.name}`);
})();
