/* ===== OVOZA — PROFILE PAGE JS ===== */
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

  /* ─── Lang switcher ───────────────────────────────── */
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
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

  /* ─── Toast ───────────────────────────────────────── */
  function showToast(msg, type = "success") {
    const wrap = document.getElementById("toastWrap");
    if (!wrap) return;
    const icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 3000);
  }

  /* ─── Tabs ────────────────────────────────────────── */
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const target = this.dataset.tab;

      tabBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      const panel = document.getElementById("tab-" + target);
      if (panel) panel.classList.add("active");
    });
  });

    /* ─── Unlike (yoqtirishni bekor qilish) ──────────── */
    document.querySelectorAll(".unlike-btn").forEach(btn => {
      btn.addEventListener("click", async function () {
        const card = this.closest(".liked-card");
        if (!card) return;

        const postId = this.dataset.id;

        const res = await fetch(`/like/${postId}/`, {
          method: "POST",
          credentials: "include",
          headers: { "X-CSRFToken": getCookie("csrftoken") },
        });

        const data = await res.json();

        if (!data.liked) {
          card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          card.style.opacity = "0";
          card.style.transform = "translateX(-20px)";
          setTimeout(() => {
            card.remove();
            updateLikedCount();
            showToast("Yoqtirishdan olib tashlandi", "success");
          }, 320);
        }
      });
    });

  function updateLikedCount() {
      const remaining = document.querySelectorAll(".liked-card").length;
      const countEl   = document.querySelector('[data-tab="liked"] .tab-count');
      if (countEl) countEl.textContent = remaining;

      const statNum = document.getElementById("likesStatNum");
      if (statNum) statNum.textContent = remaining;

      if (remaining === 0) {
          const list = document.getElementById("likedList");
          if (list) list.innerHTML = `
            <div class="empty-state">
              <div class="empty-icon"><i class="far fa-heart"></i></div>
              <div class="empty-title">Yoqtirganlar yo'q</div>
              <div class="empty-text">Yangiliklar o'qib, yoqtirgan maqolalaringiz bu yerda ko'rinadi</div>
            </div>`;
      }
    }

    /* ─── Edit comment ────────────────────────────────── */
    document.querySelectorAll(".edit-action").forEach(btn => {
      btn.addEventListener("click", function () {
        const commentId = this.dataset.comment;
        const textEl    = document.getElementById(`comment-text-${commentId}`);
        const editForm  = document.getElementById(`edit-form-${commentId}`);
        const textarea  = document.getElementById(`edit-textarea-${commentId}`);
        if (!editForm) return;
        if (textarea && textEl) textarea.value = textEl.textContent.trim();
        if (textEl) textEl.style.display = "none";
        editForm.style.display = "block";
        textarea?.focus();
      });
    });

    document.querySelectorAll(".edit-cancel").forEach(btn => {
      btn.addEventListener("click", function () {
        const commentId = this.dataset.comment;
        const textEl    = document.getElementById(`comment-text-${commentId}`);
        const editForm  = document.getElementById(`edit-form-${commentId}`);
        if (editForm) editForm.style.display = "none";
        if (textEl)   textEl.style.display   = "block";
      });
    });

    document.querySelectorAll(".edit-save").forEach(btn => {
      btn.addEventListener("click", async function () {
        const commentId = this.dataset.comment;
        const textEl    = document.getElementById(`comment-text-${commentId}`);
        const editForm  = document.getElementById(`edit-form-${commentId}`);
        const textarea  = document.getElementById(`edit-textarea-${commentId}`);
        const message   = textarea?.value.trim();
        if (!message) return;

        const res = await fetch(`/comment/edit/${commentId}/`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") },
          body: JSON.stringify({ message }),
        });

        const data = await res.json();

        if (data.success) {
          if (textEl) textEl.textContent = message;
          if (editForm) editForm.style.display = "none";
          if (textEl)   textEl.style.display   = "block";
          showToast("Izoh tahrirlandi", "success");
        } else {
          showToast("Xatolik yuz berdi", "error");
        }
      });
    });

    /* ─── Delete comment ──────────────────────────────── */
    let currentDeleteCard = null;
    let currentDeleteId = null;

    document.querySelectorAll(".delete-action").forEach(btn => {
      btn.addEventListener("click", function () {
        currentDeleteCard = this.closest(".comment-card");
        currentDeleteId = this.dataset.comment;
        document.getElementById("deleteCommentModal").style.display = "flex";
      });
    });

    document.getElementById("deleteCommentCancel")?.addEventListener("click", () => {
      document.getElementById("deleteCommentModal").style.display = "none";
    });

    document.getElementById("deleteCommentConfirm")?.addEventListener("click", async () => {
      document.getElementById("deleteCommentModal").style.display = "none";

      const res = await fetch(`/comment/delete/${currentDeleteId}/`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
      });

      const data = await res.json();

      if (data.success) {
        currentDeleteCard.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        currentDeleteCard.style.opacity = "0";
        currentDeleteCard.style.transform = "translateX(-20px)";
        setTimeout(() => {
          currentDeleteCard.remove();
          updateCommentCount();
          showToast("Izoh o'chirildi", "success");
        }, 320);
      } else {
        showToast("Xatolik yuz berdi", "error");
      }
    });

  function updateCommentCount() {
      const remaining = document.querySelectorAll(".comment-card").length;
      const countEl   = document.querySelector('[data-tab="comments"] .tab-count');
      if (countEl) countEl.textContent = remaining;

      const statNum = document.getElementById("commentsStatNum");
      if (statNum) statNum.textContent = remaining;
    }

  /* ─── Edit profile btn ────────────────────────────── */
  const editBtn = document.getElementById("editProfileBtn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      showToast("Profil tahrirlash funksiyasi tez orada!", "success");
    });
  }

  /* ─── Logout btn ──────────────────────────────────── */
      const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("logoutModal").style.display = "flex";
      });
    }

    document.getElementById("logoutConfirm")?.addEventListener("click", () => {
      window.location.href = "/log_out/";
    });

    document.getElementById("logoutCancel")?.addEventListener("click", () => {
      document.getElementById("logoutModal").style.display = "none";
    });

  /* ─── Avatar upload ───────────────────────────────── */
    const avatarEditBtn = document.getElementById("avatarEditBtn");
    const avatarInput   = document.getElementById("avatarInput");

    if (avatarEditBtn && avatarInput) {
      avatarEditBtn.addEventListener("click", () => avatarInput.click());

      avatarInput.addEventListener("change", async function () {
        const file = this.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        const res = await fetch("/avatar_upload/", {
          method: "POST",
          credentials: "include",
          headers: { "X-CSRFToken": getCookie("csrftoken") },
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          const img = document.getElementById("profileAvatar");
          const def = document.getElementById("profileAvatarDefault");

          if (img) {
            img.src = data.avatar_url;
          } else if (def) {
            const newImg = document.createElement("img");
            newImg.className   = "profile-avatar";
            newImg.id          = "profileAvatar";
            newImg.src         = data.avatar_url;
            newImg.alt         = "";
            def.replaceWith(newImg);
          }
          showToast("Rasm muvaffaqiyatli yuklandi!", "success");
        } else {
          showToast(data.message || "Xatolik yuz berdi", "error");
        }
      });
    }

    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : '';
    }

  /* ─── Toggle switches ─────────────────────────────── */
  document.querySelectorAll(".toggle-switch input").forEach(toggle => {
    toggle.addEventListener("change", function () {
      const label = this.closest(".pref-item")?.querySelector(".pref-label")?.textContent?.trim();
      const state = this.checked ? "yoqildi" : "o'chirildi";
      if (label) showToast(`${label} ${state}`, "success");
    });
  });

  /* ─── Liked cards hover click (demo) ─────────────── */
  document.querySelectorAll(".liked-card").forEach(card => {
    card.addEventListener("click", function (e) {
      if (e.target.closest(".unlike-btn")) return;
      window.location.href = "news-detail.html";
    });
  });

  /* ─── Comment cards article click ────────────────── */
  document.querySelectorAll(".comment-article-ref").forEach(ref => {
    ref.addEventListener("click", () => window.location.href = "news-detail.html");
    ref.style.cursor = "pointer";
  });

  console.log("Ovoza – profile.js yuklandi");
})();
