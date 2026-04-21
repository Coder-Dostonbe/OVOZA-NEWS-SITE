/* ===== OVOZA — PASSWORD RESET JS ===== */
(function () {
  "use strict";

  /* ─── Loader ─────────────────────────────────────── */
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.getElementById('pageLoader').classList.add('hidden');
    }, 1100);
  });

  /* ─── Live date ──────────────────────────────────── */
  const dateEl = document.getElementById("topbarDate");
  if (dateEl) {
    const days   = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
    const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
    const n = new Date();
    dateEl.textContent = `${days[n.getDay()]}, ${n.getDate()} ${months[n.getMonth()]} ${n.getFullYear()}`;
  }

  /* ─── Show / hide error ──────────────────────────── */
  function showError(id, show = true) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("show", show);
  }
  function markField(id, error = true) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("error", error);
  }

  /* ─── Toast ──────────────────────────────────────── */
  function showToast(msg, type = "error") {
    const wrap = document.getElementById("toastWrap");
    if (!wrap) return;
    const icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
    wrap.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ─── Reset form ─────────────────────────────────── */
  const resetForm = document.getElementById("resetForm");
  if (resetForm) {
    resetForm.addEventListener("submit", function (e) {
      const email = document.getElementById("resetEmail");
      showError("emailError", false);
      markField("resetEmail", false);

      if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        e.preventDefault();
        showError("emailError");
        markField("resetEmail");
        return;
      }

      const btn = document.getElementById("resetBtn");
      if (btn) {
        btn.classList.add("loading");
        btn.disabled = true;
      }
    });

    document.getElementById("resetEmail")?.addEventListener("input", function () {
      markField("resetEmail", false);
      showError("emailError", false);
    });
  }

  /* ─── Lang switcher ──────────────────────────────── */
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  console.log("Ovoza – password_reset.js yuklandi");
})();
