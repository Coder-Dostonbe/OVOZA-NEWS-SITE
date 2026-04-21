/* ===== OVOZA — PASSWORD RESET FROM KEY JS ===== */
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

  /* ─── Password toggle ────────────────────────────── */
  function addToggle(btnId, inputId) {
    const btn   = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener("click", () => {
      const shown = input.type === "text";
      input.type = shown ? "password" : "text";
      btn.querySelector("i").className = shown ? "far fa-eye" : "far fa-eye-slash";
    });
  }
  addToggle("toggleNewPass",     "newPass");
  addToggle("toggleConfirmPass", "confirmPass");

  /* ─── Password strength ──────────────────────────── */
  const newPass     = document.getElementById("newPass");
  const strengthLbl = document.getElementById("strengthLabel");
  const segs        = [1,2,3,4].map(i => document.getElementById("seg" + i));
  const colors      = ["#e74c3c","#e67e22","#f39c12","#27ae60"];
  const labels      = ["Juda zaif","Zaif","O'rtacha","Kuchli"];

  function getStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8)         score++;
    if (/[A-Z]/.test(pwd))       score++;
    if (/[0-9]/.test(pwd))       score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }

  if (newPass) {
    newPass.addEventListener("input", function () {
      const pwd = this.value;
      if (!pwd) {
        segs.forEach(s => s && (s.style.background = ""));
        if (strengthLbl) strengthLbl.textContent = "";
        return;
      }
      const str = getStrength(pwd);
      segs.forEach((s, i) => {
        if (s) s.style.background = i < str ? colors[str - 1] : "";
      });
      if (strengthLbl) {
        strengthLbl.textContent = labels[str - 1] || "";
        strengthLbl.style.color = colors[str - 1] || "";
      }
      markField("newPass", false);
      showError("newPassError", false);
    });
  }

  /* ─── Form validation ────────────────────────────── */
  const resetKeyForm = document.getElementById("resetKeyForm");
  if (resetKeyForm) {
    resetKeyForm.addEventListener("submit", function (e) {
      const pass    = document.getElementById("newPass");
      const confirm = document.getElementById("confirmPass");
      let valid     = true;

      showError("newPassError", false);
      showError("confirmPassError", false);
      markField("newPass", false);
      markField("confirmPass", false);

      if (!pass?.value || pass.value.length < 8) {
        e.preventDefault();
        showError("newPassError");
        markField("newPass");
        valid = false;
      }

      if (!confirm?.value || confirm.value !== pass?.value) {
        e.preventDefault();
        showError("confirmPassError");
        markField("confirmPass");
        valid = false;
      }

      if (valid) {
        const btn = document.getElementById("resetKeyBtn");
        if (btn) {
          btn.classList.add("loading");
          btn.disabled = true;
        }
      }
    });

    document.getElementById("newPass")?.addEventListener("input", function () {
      markField("newPass", false);
      showError("newPassError", false);
    });

    document.getElementById("confirmPass")?.addEventListener("input", function () {
      markField("confirmPass", false);
      showError("confirmPassError", false);
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

  console.log("Ovoza – password_reset_from_key.js yuklandi");
})();
