/* ===== OVOZA — NEWS DETAIL PAGE JS ===== */
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

  /* ─── CSRF ────────────────────────────────────────── */
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : '';
  }

  /* ─── Mobile drawer (o'ng tarafdan) ──────────────── */
  const navToggler   = document.getElementById("navToggler");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const mobileOverlay= document.getElementById("mobileOverlay");
  const drawerClose  = document.getElementById("drawerClose");

  function openDrawer() {
    mobileDrawer.classList.add("open");
    mobileOverlay.classList.add("open");
    navToggler.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    mobileDrawer.classList.remove("open");
    mobileOverlay.classList.remove("open");
    navToggler.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (navToggler)    navToggler.addEventListener("click", openDrawer);
  if (drawerClose)   drawerClose.addEventListener("click", closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

  /* ─── Sticky navbar shadow ────────────────────────── */
  const navbar = document.querySelector(".main-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 60
        ? "0 4px 30px rgba(0,0,0,0.9)"
        : "0 2px 20px rgba(0,0,0,0.5)";
    });
  }

  /* ─── O'qish progressi ────────────────────────────── */
  const progress  = document.getElementById("readProgress");
  const articleEl = document.getElementById("articleMain");
  if (progress && articleEl) {
    window.addEventListener("scroll", () => {
      const total   = articleEl.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -articleEl.getBoundingClientRect().top);
      progress.style.width = Math.min(100, (scrolled / total) * 100) + "%";
    });
  }

  /* ─── Scroll to top ───────────────────────────────── */
  const scrollBtn = document.getElementById("scrollTop");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.opacity       = window.scrollY > 500 ? "1" : "0";
      scrollBtn.style.pointerEvents = window.scrollY > 500 ? "auto" : "none";
    });
    scrollBtn.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
  }

  /* ─── Comment ga scroll ───────────────────────────── */
  const commentScrollBtn = document.getElementById("commentScrollBtn");
  if (commentScrollBtn) {
    commentScrollBtn.addEventListener("click", () => {
      document.getElementById("commentsSection")?.scrollIntoView({ behavior:"smooth", block:"start" });
    });
  }

  /* ─── Alert modal ─────────────────────────────────── */
  const alertModal = document.getElementById("alertModal");
  const alertClose = document.getElementById("alertClose");

  function showAlert() { if (alertModal) { alertModal.classList.add("open"); document.body.style.overflow = "hidden"; } }
  function hideAlert() { if (alertModal) { alertModal.classList.remove("open"); document.body.style.overflow = ""; } }

  if (alertClose) alertClose.addEventListener("click", hideAlert);
  if (alertModal) alertModal.addEventListener("click", e => { if (e.target === alertModal) hideAlert(); });

  /* ─── LIKE TUGMASI (pastdagi asosiy) ─────────────── */
  const likeBtn      = document.getElementById("likeBtn");
  const likeCount    = document.getElementById("likeCount");     // pastdagi
  const likeCountTop = document.getElementById("likeCountTop");  // tepadagi (display)

  if (likeBtn) {
    // Sahifa yuklanishida tepani sinxronlashtir
    const initialCount = parseInt(likeBtn.dataset.likes) || 0;
    if (likeCountTop) likeCountTop.textContent = initialCount;
    if (likeCount)    likeCount.textContent    = initialCount;

    likeBtn.addEventListener("click", function () {
      // Guest user bo'lsa alert chiqar
      if (this.dataset.guest === "true") { showAlert(); return; }

      const id = this.dataset.id;
      fetch(`/like/${id}/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
      })
      .then(r => r.json())
      .then(data => {
        const count = data.count;
        const liked = data.liked;

        // Pastdagi tugma
        if (likeCount) likeCount.textContent = count;
        likeBtn.classList.toggle("liked", liked);
        const icon = likeBtn.querySelector("i");
        if (icon) icon.className = liked ? "fas fa-thumbs-up" : "far fa-thumbs-up";

        // Tepadagi display (avtomatik yangilanadi)
        if (likeCountTop) likeCountTop.textContent = count;
      })
      .catch(() => {});
    });
  }

  /* ─── Nusxa olish ─────────────────────────────────── */
  const copyBtn = document.getElementById("copyLinkBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard?.writeText(window.location.href).then(() => {
        const orig = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i><span> Nusxalandi!</span>';
        this.style.color = "#58d68d";
        setTimeout(() => { this.innerHTML = orig; this.style.color = ""; }, 2000);
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

  /* ─── Share counter ───────────────────────────────── */
  document.querySelectorAll('.share-btn.tg,.share-btn.fb,.share-btn.tw,.share-btn.wa').forEach(btn => {
    btn.addEventListener('click', function () {
      const postId = likeBtn?.dataset.id;
      if (!postId) return;
      fetch(`/share/${postId}/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
      })
      .then(r => r.json())
      .then(data => {
        const el = document.getElementById('shareCount');
        if (el) el.textContent = data.shares;
      }).catch(() => {});
    });
  });

  /* ─── Komment yuborish ────────────────────────────── */
  const submitBtn       = document.getElementById("submitComment");
  const commentTextarea = document.getElementById("commentTextarea");

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const text = commentTextarea?.value.trim();
      if (!text) return;
      const postId = submitBtn.dataset.postId;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';

      fetch(`/about/${postId}/comment/`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'X-CSRFToken':getCookie('csrftoken') },
        body: JSON.stringify({ message: text })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          commentTextarea.value = "";
          addCommentToList(data.comment, postId);
          const countEl = document.getElementById("commentsCount");
          if (countEl) {
            const cur = parseInt(countEl.textContent) || 0;
            countEl.textContent = (cur + 1) + " ta izoh";
          }
          // Empty state olib tashla
          const empty = document.querySelector(".comments-empty");
          if (empty) empty.remove();
        }
      })
      .catch(() => {})
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Yuborish';
      });
    });
  }

  /* ─── Delegated click handler ─────────────────────── */
  document.addEventListener("click", function (e) {

    /* Reply tugmasi */
    if (e.target.closest(".reply-btn")) {
      const btn       = e.target.closest(".reply-btn");
      const commentId = btn.dataset.commentId;
      const form      = document.getElementById(`reply-form-${commentId}`);
      if (form) {
        const isOpen = form.style.display !== "none";
        form.style.display = isOpen ? "none" : "block";
        if (!isOpen) form.querySelector("textarea")?.focus();
      }
    }

    /* Reply yuborish */
    if (e.target.closest(".reply-submit")) {
      const btn      = e.target.closest(".reply-submit");
      const postId   = btn.dataset.postId;
      const parentId = btn.dataset.parentId;
      const textarea = btn.previousElementSibling;
      const text     = textarea?.value.trim();
      if (!text) return;

      btn.disabled = true;

      fetch(`/about/${postId}/comment/`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'X-CSRFToken':getCookie('csrftoken') },
        body: JSON.stringify({ message: text, parent_id: parentId })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          textarea.value = "";
          const form = document.getElementById(`reply-form-${parentId}`);
          if (form) form.style.display = "none";
          addReplyToComment(data.comment, parentId);
        }
      })
      .catch(() => {})
      .finally(() => { btn.disabled = false; });
    }

    /* ─── Comment tahrirlash (edit tugmasi) ─── */
    if (e.target.closest(".comment-edit-btn")) {
      const btn       = e.target.closest(".comment-edit-btn");
      const commentId = btn.dataset.commentId;
      const editForm  = document.getElementById(`inline-edit-form-${commentId}`);
      const textEl    = document.getElementById(`inline-comment-text-${commentId}`);

      if (!editForm) return;

      const isOpen = editForm.style.display !== "none";
      if (isOpen) {
        editForm.style.display = "none";
        if (textEl) textEl.style.display = "block";
      } else {
        const textarea = document.getElementById(`inline-edit-textarea-${commentId}`);
        if (textarea && textEl) textarea.value = textEl.textContent.trim();
        if (textEl) textEl.style.display = "none";
        editForm.style.display = "block";
        textarea?.focus();
      }
    }

    /* ─── Edit bekor qilish ─── */
    if (e.target.closest(".inline-edit-cancel")) {
      const btn       = e.target.closest(".inline-edit-cancel");
      const commentId = btn.dataset.commentId;
      const editForm  = document.getElementById(`inline-edit-form-${commentId}`);
      const textEl    = document.getElementById(`inline-comment-text-${commentId}`);
      if (editForm) editForm.style.display = "none";
      if (textEl)   textEl.style.display   = "block";
    }

    /* ─── Edit saqlash ─── */
    if (e.target.closest(".inline-edit-save")) {
      const btn       = e.target.closest(".inline-edit-save");
      const commentId = btn.dataset.commentId;
      const textarea  = document.getElementById(`inline-edit-textarea-${commentId}`);
      const textEl    = document.getElementById(`inline-comment-text-${commentId}`);
      const editForm  = document.getElementById(`inline-edit-form-${commentId}`);
      const message   = textarea?.value.trim();
      if (!message) return;

      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saqlanmoqda...';

      fetch(`/comment/edit/${commentId}/`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'X-CSRFToken':getCookie('csrftoken') },
        body: JSON.stringify({ message })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          // Matnni yangilashtir
          if (textEl) {
            textEl.textContent = message;
            textEl.style.display = "block";
          }
          if (editForm) editForm.style.display = "none";
        }
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check"></i> Saqlash';
      })
      .catch(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check"></i> Saqlash';
      });
    }

  });

  /* ─── Avatar HTML yaratish (JS tomonida) ─────────── */
  function avatarHtml(avatarUrl, username, size) {
    size = size || 42;
    if (avatarUrl) {
      return `<img class="comment-avatar" src="${avatarUrl}" alt="${username}" style="width:${size}px;height:${size}px;" />`;
    }
    // Harf bilan default avatar
    const letter = (username || 'U').charAt(0).toUpperCase();
    return `<div class="comment-avatar comment-avatar-default" style="width:${size}px;height:${size}px;font-size:${Math.round(size*0.38)}px;">${letter}</div>`;
  }

  /* ─── Yangi komment qo'shish (DOM) ───────────────── */
  function addCommentToList(comment, postId) {
    const list = document.getElementById("commentList");
    if (!list) return;

    const item = document.createElement("div");
    item.className = "comment-item";
    item.id = `comment-${comment.id}`;
    item.style.cssText = "opacity:0;transform:translateY(14px);transition:opacity 0.35s ease,transform 0.35s ease;";

    item.innerHTML = `
      ${avatarHtml(comment.avatar, comment.user)}
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">${comment.user}</span>
          <span class="comment-date">${comment.created_at}</span>
        </div>
        <div class="comment-text" id="inline-comment-text-${comment.id}">${comment.message}</div>
        <div id="inline-edit-form-${comment.id}" style="display:none;margin-top:10px;">
          <textarea id="inline-edit-textarea-${comment.id}" class="comment-textarea" style="min-height:80px;">${comment.message}</textarea>
          <div class="edit-form-actions">
            <button class="btn-comment-submit inline-edit-save" data-comment-id="${comment.id}">
              <i class="fas fa-check"></i> Saqlash
            </button>
            <button class="inline-edit-cancel" data-comment-id="${comment.id}">
              <i class="fas fa-times"></i> Bekor
            </button>
          </div>
        </div>
        <div class="comment-actions">
          <button class="comment-action-btn reply-btn" data-comment-id="${comment.id}">
            <i class="far fa-reply"></i> Javob
          </button>
          <button class="comment-action-btn comment-edit-btn" data-comment-id="${comment.id}">
            <i class="fas fa-pen"></i> Tahrirlash
          </button>
        </div>
        <div class="reply-form" id="reply-form-${comment.id}" style="display:none;">
          <textarea class="comment-textarea reply-textarea" placeholder="Javobingizni yozing..."></textarea>
          <button class="btn-comment-submit reply-submit" data-post-id="${postId}" data-parent-id="${comment.id}" style="margin-top:8px;">
            <i class="fas fa-paper-plane"></i> Yuborish
          </button>
        </div>
      </div>`;

    list.insertBefore(item, list.firstChild);
    requestAnimationFrame(() => {
      item.style.opacity   = "1";
      item.style.transform = "translateY(0)";
    });
  }

  /* ─── Reply qo'shish (DOM) ────────────────────────── */
  function addReplyToComment(reply, parentId) {
    const parentItem = document.getElementById(`comment-${parentId}`);
    if (!parentItem) return;

    const replyEl = document.createElement("div");
    replyEl.className = "comment-item reply-item";
    replyEl.id = `comment-${reply.id}`;
    replyEl.style.cssText = "opacity:0;transform:translateY(10px);transition:opacity 0.3s ease,transform 0.3s ease;";

    replyEl.innerHTML = `
      ${avatarHtml(reply.avatar, reply.user, 34)}
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">${reply.user}</span>
          <span class="comment-date">${reply.created_at}</span>
        </div>
        <div class="comment-text" id="inline-comment-text-${reply.id}">${reply.message}</div>
        <div class="comment-actions">
          <button class="comment-action-btn comment-edit-btn" data-comment-id="${reply.id}">
            <i class="fas fa-pen"></i> Tahrirlash
          </button>
        </div>
        <div id="inline-edit-form-${reply.id}" style="display:none;margin-top:10px;">
          <textarea id="inline-edit-textarea-${reply.id}" class="comment-textarea" style="min-height:70px;">${reply.message}</textarea>
          <div class="edit-form-actions">
            <button class="btn-comment-submit inline-edit-save" data-comment-id="${reply.id}">
              <i class="fas fa-check"></i> Saqlash
            </button>
            <button class="inline-edit-cancel" data-comment-id="${reply.id}">
              <i class="fas fa-times"></i> Bekor
            </button>
          </div>
        </div>
      </div>`;

    // Reply formdan keyin qo'sh
    const replyForm = document.getElementById(`reply-form-${parentId}`);
    const commentBody = parentItem.querySelector(".comment-body");
    if (replyForm && commentBody) {
      commentBody.insertBefore(replyEl, replyForm.nextSibling);
    } else if (commentBody) {
      commentBody.appendChild(replyEl);
    }

    requestAnimationFrame(() => {
      replyEl.style.opacity   = "1";
      replyEl.style.transform = "translateY(0)";
    });
  }

  document.querySelectorAll('.article-text *').forEach(el => {
  el.style.backgroundColor = '';
  el.style.color = '';
});
})();