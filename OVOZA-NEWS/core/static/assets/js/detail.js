/* ===== OVOZA — NEWS DETAIL PAGE JS ===== */
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
    tick();
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

  /* ─── Sticky navbar shadow ────────────────────────── */
  const navbar = document.querySelector(".main-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 60
        ? "0 4px 30px rgba(0,0,0,0.8)"
        : "0 2px 20px rgba(0,0,0,0.5)";
    });
  }

  /* ─── O'qish jarayoni progress bar ───────────────── */
  const progress  = document.getElementById("readProgress");
  const articleEl = document.getElementById("articleMain");
  if (progress && articleEl) {
    window.addEventListener("scroll", () => {
      const rect    = articleEl.getBoundingClientRect();
      const total   = articleEl.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct     = Math.min(100, (scrolled / total) * 100);
      progress.style.width = pct + "%";
    });
  }

  /* ─── Scroll to top ───────────────────────────────── */
  const scrollBtn = document.getElementById("scrollTop");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.opacity       = window.scrollY > 500 ? "1" : "0";
      scrollBtn.style.pointerEvents = window.scrollY > 500 ? "auto" : "none";
    });
    scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ─── CSRF Cookie ────────────────────────────────── */
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : '';
  }

  /* ─── Like tugmasi (DB) ───────────────────────────── */
  const likeBtn   = document.getElementById("likeBtn");
  const likeCount = document.getElementById("likeCount");
  let liked       = false;
  let likeVal     = parseInt(likeBtn?.dataset.likes) || 0;

  if (likeBtn && likeCount) {
    likeCount.textContent = likeVal;

    likeBtn.addEventListener("click", function () {
      const id = this.dataset.id;
      fetch(`/like/${id}/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
      })
      .then(r => r.json())
      .then(data => {
        likeCount.textContent = data.count;
        liked = data.liked;
        this.classList.toggle("liked", liked);
        const icon = this.querySelector("i");
        if (icon) icon.className = liked ? "fas fa-heart" : "far fa-heart";
      });
    });
  }

  /* ─── Comment tugmasiga bosish → pastga scroll ───── */
  const commentScrollBtn = document.getElementById("commentScrollBtn");
  if (commentScrollBtn) {
    commentScrollBtn.addEventListener("click", () => {
      const section = document.getElementById("commentsSection");
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ─── Alert modal ─────────────────────────────────── */
  const alertModal = document.getElementById("alertModal");
  const alertClose = document.getElementById("alertClose");

  function showAlert() {
    if (alertModal) {
      alertModal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }
  function hideAlert() {
    if (alertModal) {
      alertModal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  if (alertClose) alertClose.addEventListener("click", hideAlert);
  if (alertModal) {
    alertModal.addEventListener("click", e => {
      if (e.target === alertModal) hideAlert();
    });
  }
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") hideAlert();
  });

  /* ─── Komment yuborish ────────────────────────────── */
  const submitBtn       = document.getElementById("submitComment");
  const commentTextarea = document.getElementById("commentTextarea");

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const text   = commentTextarea?.value.trim();
      if (!text) return;
      const postId = submitBtn.dataset.postId;

      fetch(`/about/${postId}/comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ message: text })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          commentTextarea.value = "";
          addCommentToList(data.comment, postId);
          const countEl = document.getElementById("commentsCount");
          if (countEl) {
            const current = parseInt(countEl.textContent) || 0;
            countEl.textContent = (current + 1) + " ta izoh";
          }
        }
      });
    });
  }

  /* ─── Reply tugmasi ───────────────────────────────── */
  document.addEventListener("click", function (e) {
    if (e.target.closest(".reply-btn")) {
      const btn       = e.target.closest(".reply-btn");
      const commentId = btn.dataset.commentId;
      const replyForm = document.getElementById(`reply-form-${commentId}`);
      if (replyForm) {
        replyForm.style.display = replyForm.style.display === "none" ? "block" : "none";
      }
    }

    if (e.target.closest(".reply-submit")) {
      const btn      = e.target.closest(".reply-submit");
      const postId   = btn.dataset.postId;
      const parentId = btn.dataset.parentId;
      const textarea = btn.previousElementSibling;
      const text     = textarea?.value.trim();
      if (!text) return;

      fetch(`/about/${postId}/comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ message: text, parent_id: parentId })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          textarea.value = "";
          const replyForm = document.getElementById(`reply-form-${parentId}`);
          if (replyForm) replyForm.style.display = "none";
          addReplyToComment(data.comment, parentId);
        }
      });
    }
  });

  /* ─── Komment qo'shish (DOM) ──────────────────────── */
  function addCommentToList(comment, postId) {
    const list = document.getElementById("commentList");
    if (!list) return;

    const item = document.createElement("div");
    item.className = "comment-item";
    item.id = `comment-${comment.id}`;
    item.style.cssText = "opacity:0;transform:translateY(12px);transition:opacity 0.3s ease,transform 0.3s ease;";
    item.innerHTML = `
      <img class="comment-avatar" src="https://i.pravatar.cc/80?u=${comment.id}" alt="" />
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">${comment.user}</span>
          <span class="comment-date">${comment.created_at}</span>
        </div>
        <div class="comment-text">${comment.message}</div>
        <div class="comment-actions"></div>
        <div class="reply-form" id="reply-form-${comment.id}" style="display:none;">
          <textarea class="comment-textarea" placeholder="Javobingizni yozing..." style="margin-top:10px;"></textarea>
          <button class="btn-comment-submit reply-submit" data-post-id="${postId}" data-parent-id="${comment.id}" style="margin-top:8px;">
            <i class="fas fa-paper-plane"></i> Yuborish
          </button>
        </div>
      </div>`;

    const empty = list.querySelector("p");
    if (empty) empty.remove();

    list.insertBefore(item, list.firstChild);
    requestAnimationFrame(() => {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    });
  }

  /* ─── Reply qo'shish (DOM) ────────────────────────── */
  function addReplyToComment(reply, parentId) {
    const parentItem = document.getElementById(`comment-${parentId}`);
    if (!parentItem) return;

    const replyEl = document.createElement("div");
    replyEl.className = "comment-item reply-item";
    replyEl.style.cssText = "margin-top:12px;margin-left:40px;opacity:0;transform:translateY(12px);transition:opacity 0.3s ease,transform 0.3s ease;";
    replyEl.innerHTML = `
      <img class="comment-avatar" src="https://i.pravatar.cc/80?u=${reply.id}" alt="" />
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">${reply.user}</span>
          <span class="comment-date">${reply.created_at}</span>
        </div>
        <div class="comment-text">${reply.message}</div>
      </div>`;

    parentItem.querySelector(".comment-body").appendChild(replyEl);
    requestAnimationFrame(() => {
      replyEl.style.opacity = "1";
      replyEl.style.transform = "translateY(0)";
    });
  }

  /* ─── Nusxa olish tugmasi ─────────────────────────── */
  const copyBtn = document.getElementById("copyLinkBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard?.writeText(window.location.href).then(() => {
        const origHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i><span> Nusxalandi!</span>';
        this.style.color = "#58d68d";
        setTimeout(() => {
          this.innerHTML = origHTML;
          this.style.color = "";
        }, 2000);
      });
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

  /* ─── Share tugmalari ─────────────────────────────── */
  document.querySelectorAll('.share-btn.tg, .share-btn.fb, .share-btn.tw, .share-btn.wa').forEach(btn => {
    btn.addEventListener('click', function () {
      const postId = document.getElementById('likeBtn')?.dataset.id;
      if (postId) {
        fetch(`/share/${postId}/`, {
          method: 'POST',
          headers: { 'X-CSRFToken': getCookie('csrftoken') }
        })
        .then(r => r.json())
        .then(data => {
          const shareCount = document.getElementById('shareCount');
          if (shareCount) shareCount.textContent = data.shares;
        });
      }
    });
  });

  console.log("Ovoza – detail.js yuklandi");
})();