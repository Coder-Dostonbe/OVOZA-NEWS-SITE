/* ===== OVOZA — SEARCH PAGE JS ===== */
(function () {
  "use strict";

  /* ─── Live clock ──────────────────────────────────── */
  const dateEl = document.getElementById("topbarDate");
  if (dateEl) {
    const days   = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
    const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
    const n = new Date();
    dateEl.textContent = `${days[n.getDay()]}, ${n.getDate()} ${months[n.getMonth()]} ${n.getFullYear()}`;
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

  /* ─── Sticky navbar ───────────────────────────────── */
  const navbar = document.querySelector(".main-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 50
        ? "0 4px 30px rgba(0,0,0,0.8)"
        : "0 2px 20px rgba(0,0,0,0.5)";
    });
  }

  /* ─── Search clear button ─────────────────────────── */
  const clearBtn = document.getElementById("searchClear");
  const searchInput = document.getElementById("navSearchInput");
  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      clearBtn.style.display = "none";
    });
    searchInput.addEventListener("input", () => {
      clearBtn.style.display = searchInput.value ? "block" : "none";
    });
  }

  /* ─── Scroll to top ───────────────────────────────── */
  const scrollBtn = document.getElementById("scrollTop");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.opacity       = window.scrollY > 400 ? "1" : "0";
      scrollBtn.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
    });
    scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ─── Card entrance animation ─────────────────────── */
  const cards = document.querySelectorAll(".result-card");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = "1";
        e.target.style.transform = "translateY(0)";
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });

  cards.forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(16px)";
    card.style.transition = `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms, border-color 0.28s, box-shadow 0.28s`;
    obs.observe(card);
  });

  console.log("Ovoza – search.js yuklandi");
})();
