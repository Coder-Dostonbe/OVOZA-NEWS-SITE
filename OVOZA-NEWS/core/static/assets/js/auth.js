/* ===== OVOZA — AUTH PAGE JS ===== */
(function () {
  "use strict";

  /* ─── Live date ──────────────────────────────────── */
  const dateEl = document.getElementById("topbarDate");
  if (dateEl) {
    const days   = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
    const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
    const n = new Date();
    dateEl.textContent = `${days[n.getDay()]}, ${n.getDate()} ${months[n.getMonth()]} ${n.getFullYear()}`;
  }

  /* ─── Lang switcher ──────────────────────────────── */
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

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
  addToggle("togglePass",    "loginPass");
  addToggle("toggleRegPass", "regPass");
  addToggle("toggleConfirm", "regPassConfirm");

  /* ─── Google button (demo) ───────────────────────── */
  const googleBtn = document.getElementById("googleBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      showToast("Google autentifikatsiyasi hozircha demo rejimda", "error");
    });
  }

  /* ─── CSRF Cookie ────────────────────────────────── */
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : '';
  }

  /* ═══════════════════════════════════════════════════
     LOGIN FORM
  ═══════════════════════════════════════════════════ */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail");
      const pass  = document.getElementById("loginPass");
      const btn   = document.getElementById("loginBtn");
      let valid   = true;

      /* Reset */
      ["emailError","passError"].forEach(id => showError(id, false));
      [email, pass].forEach(el => el && markField(el.id, false));

      /* Email validate */
      if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError("emailError"); markField("loginEmail"); valid = false;
      }
      /* Pass validate */
      if (!pass?.value.trim()) {
        showError("passError"); markField("loginPass"); valid = false;
      }

      if (!valid) return;

      /* Loading state */
      btn.classList.add("loading");
      btn.disabled = true;

      const res = await fetch("/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({
          email: email.value,
          password: pass.value
        })
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/";
      } else {
        btn.classList.remove("loading");
        btn.disabled = false;
        showError("passError");
        markField("loginPass");
        showToast(data.message || "Email yoki parol noto'g'ri", "error");
      }
    });

    /* Real-time clear errors */
    document.getElementById("loginEmail")?.addEventListener("input", function () {
      markField("loginEmail", false); showError("emailError", false);
    });
    document.getElementById("loginPass")?.addEventListener("input", function () {
      markField("loginPass", false); showError("passError", false);
    });
  }

  /* ═══════════════════════════════════════════════════
     REGISTER FORM
  ═══════════════════════════════════════════════════ */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {

    /* Password strength */
    const regPass     = document.getElementById("regPass");
    const strengthBar = document.getElementById("strengthBar");
    const strengthLbl = document.getElementById("strengthLabel");
    const segs        = [1,2,3,4].map(i => document.getElementById("seg" + i));

    const colors = ["#e74c3c","#e67e22","#f39c12","#27ae60"];
    const labels = ["Juda zaif","Zaif","O'rtacha","Kuchli"];

    function getStrength(pwd) {
      let score = 0;
      if (pwd.length >= 8)  score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;
      return score;
    }

    if (regPass) {
      regPass.addEventListener("input", function () {
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
        markField("regPass", false); showError("regPassError", false);
      });
    }

    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const first   = document.getElementById("regFirst");
      const last    = document.getElementById("regLast");
      const email   = document.getElementById("regEmail");
      const pass    = document.getElementById("regPass");
      const confirm = document.getElementById("regPassConfirm");
      const terms   = document.getElementById("agreeTerms");
      const btn     = document.getElementById("registerBtn");
      let valid     = true;

      /* Reset */
      ["firstError","lastError","regEmailError","regPassError","confirmError","termsError"]
        .forEach(id => showError(id, false));
      ["regFirst","regLast","regEmail","regPass","regPassConfirm"]
        .forEach(id => markField(id, false));

      if (!first?.value.trim()) { showError("firstError"); markField("regFirst"); valid = false; }
      if (!last?.value.trim())  { showError("lastError");  markField("regLast");  valid = false; }
      if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError("regEmailError"); markField("regEmail"); valid = false;
      }
      if (!pass?.value || pass.value.length < 8) {
        showError("regPassError"); markField("regPass"); valid = false;
      }
      if (!confirm?.value || confirm.value !== pass?.value) {
        showError("confirmError"); markField("regPassConfirm"); valid = false;
      }
      if (!terms?.checked) { showError("termsError"); valid = false; }

      if (!valid) return;

      /* Loading */
      btn.classList.add("loading");
      btn.disabled = true;

      const res = await fetch("/register/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({
          first_name: first.value,
          last_name: last.value,
          email: email.value,
          password: pass.value
        })
      });

      const data = await res.json();

      if (data.success) {
        registerForm.style.display = "none";
        const success = document.getElementById("regSuccess");
        if (success) success.classList.add("show");
        showToast("Muvaffaqiyatli ro'yxatdan o'tdingiz!", "success");
        setTimeout(() => window.location.href = "/login/", 1500);
      } else {
        btn.classList.remove("loading");
        btn.disabled = false;
        showToast(data.message || "Xatolik yuz berdi", "error");
      }
    });

    /* Real-time clears */
    ["regFirst","regLast","regEmail","regPass","regPassConfirm"].forEach(id => {
      document.getElementById(id)?.addEventListener("input", function () {
        markField(id, false);
        const errMap = {
          regFirst:"firstError", regLast:"lastError", regEmail:"regEmailError",
          regPass:"regPassError", regPassConfirm:"confirmError"
        };
        showError(errMap[id], false);
      });
    });
  }

  console.log("Ovoza – auth.js yuklandi");
})();