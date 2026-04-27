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

  /* ─── Tab config ─────────────────────────────────── */
  const TAB_CONFIG = {
    umumiy:    { extra: null,            placeholder: "Savolingizni batafsil yozing..." },
    hamkorlik: { extra: "extraHamkorlik", placeholder: "Hamkorlik taklifi va kompaniyangiz haqida batafsil yozing..." },
    reklama:   { extra: "extraReklama",   placeholder: "Reklama maqsadi, maqsadli auditoriya va kutilayotgan natija haqida yozing..." },
    xato:      { extra: "extraXato",      placeholder: "Qaysi ma'lumot noto'g'ri? To'g'ri variant qanday? Maqola URL ni ham qo'shing." },
    boshqa:    { extra: null,            placeholder: "Xabaringizni batafsil yozing..." },
  };
  const messageEl = document.getElementById("message");

  function applyTab(subject) {
    const cfg = TAB_CONFIG[subject] || TAB_CONFIG.umumiy;
    // extra maydonlarni yashir/ko'rsat
    document.querySelectorAll(".extra-field").forEach(el => {
      el.style.display = "none";
    });
    if (cfg.extra) {
      const el = document.getElementById(cfg.extra);
      if (el) el.style.display = "";
    }
    // placeholder yangilash
    if (messageEl) messageEl.placeholder = cfg.placeholder;
  }

  /* ─── Subject tabs ───────────────────────────────── */
  const subjectInput = document.getElementById("subjectInput");
  document.querySelectorAll(".subject-tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".subject-tab").forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      applyTab(this.dataset.subject);
    });
  });

  applyTab("umumiy"); // boshlang'ich holat

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

      const activeTab = document.querySelector(".subject-tab.active");
      const csrfToken = document.cookie.split(';')
        .find(c => c.trim().startsWith('csrftoken='))?.split('=')[1] || '';

      try {
        const res = await fetch('/contact/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
          body: JSON.stringify({
            first_name:  fname.value.trim(),
            last_name:   document.getElementById('lname')?.value.trim() || '',
            email:       email.value.trim(),
            phone:       document.getElementById('phone')?.value.trim() || '',
            subject:     activeTab?.dataset.subject || 'umumiy',
            message:     message.value.trim(),
            company:     document.getElementById('company')?.value.trim() || '',
            ad_format:   document.getElementById('adFormat')?.value || '',
            ad_budget:   document.getElementById('adBudget')?.value.trim() || '',
            article_url: document.getElementById('articleUrl')?.value.trim() || '',
          }),
        });
        const data = await res.json();
        if (data.success) {
          form.style.display = "none";
          if (success) success.classList.add("show");
          toast("Xabar muvaffaqiyatli yuborildi!", "success");
        } else {
          toast(data.message || "Xatolik yuz berdi", "error");
          sendBtn.classList.remove("loading");
          sendBtn.disabled = false;
        }
      } catch {
        toast("Server bilan ulanishda xatolik", "error");
        sendBtn.classList.remove("loading");
        sendBtn.disabled = false;
      }
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
