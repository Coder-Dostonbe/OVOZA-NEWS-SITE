/* ===== OVOZA — PASSWORD RESET DONE JS ===== */
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

  /* ─── Countdown & redirect ───────────────────────── */
  const countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    let seconds = 5;
    const timer = setInterval(() => {
      seconds--;
      countdownEl.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(timer);
        window.location.href = "/login/";
      }
    }, 1000);
  }

  /* ─── Lang switcher ──────────────────────────────── */
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  console.log("Ovoza – password_reset_done.js yuklandi");
})();
