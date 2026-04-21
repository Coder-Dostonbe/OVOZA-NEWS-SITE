/* ===== OVOZA — CONTACT PAGE JS ===== */
(function () {
  "use strict";

  /* ─── Loader ─────────────────────────────────────── */
  window.addEventListener('load', function () {
    setTimeout(function () {
      const l = document.getElementById('pageLoader');
      if (l) l.classList.add('hidden');
    }, 1100);
  });

  /* ─── Date ───────────────────────────────────────── */
  const dateEl = document.getElementById("topbarDate");
  if (dateEl) {
    const days   = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
    const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
    const n = new Date();
    dateEl.textContent = `${days[n.getDay()]}, ${n.getDate()} ${months[n.getMonth()]} ${n.getFullYear()}`;
  }

  /* ─── Highlight today ────────────────────────────── */
  const dayIdx = new Date().getDay(); // 0=yakshanba
  const rows   = document.querySelectorAll(".hours-row");
  // 1=dushanba...5=juma, 6=shanba, 0=yakshanba
  const mapDay = { 1:0, 2:1, 3:2, 4:3, 5:4, 6:5, 0:6 };
  if (rows[mapDay[dayIdx]]) {
    rows.forEach(r => r.classList.remove("today"));
    rows[mapDay[dayIdx]].classList.add("today");
  }

  /* ─── Lang switcher ──────────────────────────────── */
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ─── Scroll top ─────────────────────────────────── */
  const scrollBtn = document.getElementById("scrollTop");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.opacity       = window.scrollY > 400 ? "1" : "0";
      scrollBtn.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
    });
    scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ─── Toast ──────────────────────────────────────── */
  function toast(msg, type = "success") {
    const wrap = document.getElementById("toastWrap");
    if (!wrap) return;
    const icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 3500);
  }

  /* ─── Subject tabs ───────────────────────────────── */
  const subjectInput = document.getElementById("subjectInput");
  document.querySelectorAll(".subject-tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".subject-tab").forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      const map = {
        umumiy:    "Umumiy savol",
        hamkorlik: "Hamkorlik",
        reklama:   "Reklama",
        xato:      "Xato bildirish",
        boshqa:    "Boshqa"
      };
      if (subjectInput) subjectInput.value = map[this.dataset.subject] || "Umumiy savol";
    });
  });

  /* ─── Form validation ────────────────────────────── */
  function showErr(id, show) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("show", show);
  }
  function markErr(id, err) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("error", err);
  }

  /* Real-time clear */
  ["fname","email","message"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", function () {
      markErr(id, false);
      const errMap = { fname:"fnameErr", email:"emailErr", message:"msgErr" };
      showErr(errMap[id], false);
    });
  });

  /* ─── Form submit ────────────────────────────────── */
  const form    = document.getElementById("contactForm");
  const sendBtn = document.getElementById("sendBtn");
  const success = document.getElementById("formSuccess");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const fname   = document.getElementById("fname");
      const email   = document.getElementById("email");
      const message = document.getElementById("message");
      let valid = true;

      /* Reset */
      ["fnameErr","emailErr","msgErr"].forEach(id => showErr(id, false));
      ["fname","email","message"].forEach(id => markErr(id, false));

      if (!fname?.value.trim()) { showErr("fnameErr", true); markErr("fname", true); valid = false; }
      if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showErr("emailErr", true); markErr("email", true); valid = false;
      }
      if (!message?.value.trim()) { showErr("msgErr", true); markErr("message", true); valid = false; }

      if (!valid) return;

      /* Loading */
      sendBtn.classList.add("loading");
      sendBtn.disabled = true;

      await new Promise(r => setTimeout(r, 1600));

      /* Success */
      form.style.display = "none";
      if (success) success.classList.add("show");
      toast("Xabar muvaffaqiyatli yuborildi!", "success");
    });
  }

  /* ─── FAQ accordion ──────────────────────────────── */
  document.querySelectorAll(".faq-item").forEach(item => {
    item.querySelector(".faq-question")?.addEventListener("click", function () {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });

  console.log("Ovoza – contact.js yuklandi");
})();
