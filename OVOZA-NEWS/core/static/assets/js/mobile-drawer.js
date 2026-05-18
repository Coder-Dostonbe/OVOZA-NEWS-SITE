/* ===== OVOZA — Mobile Nav Overlay & Animations ===== */
(function () {
  'use strict';

  /* ─── Scroll Progress Bar ─── */
  function initProgressBar() {
    var prog = document.createElement('div');
    prog.className = 'scroll-progress';
    document.body.prepend(prog);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var total = document.documentElement.scrollHeight - window.innerHeight;
          prog.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── Language Overlay ─── */
  function initLangOverlay() {
    var globeBtn = document.getElementById('langGlobeBtn');
    if (!globeBtn) return;

    /* Detect current language from active lang-btn */
    var currentLang = 'uz';
    var activeBtn = document.querySelector('.lang-btn.active');
    if (activeBtn) {
      var m = (activeBtn.getAttribute('onclick') || '').match(/switchLang\('([^']+)'\)/);
      if (m) currentLang = m[1];
    }

    /* Set badge on globe button */
    var codeMap = { 'uz': 'UZ', 'uz-cyrl': 'УЗ', 'ru': 'RU', 'en': 'EN' };
    globeBtn.setAttribute('data-code', codeMap[currentLang] || currentLang.toUpperCase());

    /* Build overlay HTML once */
    var overlay = document.createElement('div');
    overlay.className = 'lang-overlay';
    overlay.id = 'langOverlay';
    overlay.innerHTML =
      '<button class="lang-ov-close" id="langOvClose" aria-label="Yopish"><i class="fas fa-times"></i></button>' +
      '<div class="lang-ov-body">' +
        '<div class="lang-ov-label"><i class="fas fa-globe"></i>&nbsp;&nbsp;TIL TANLASH</div>' +
        '<div class="lang-ov-grid">' +
          '<button class="lang-ov-card' + (currentLang === 'uz' ? ' active' : '') + '" data-lang="uz">' +
            '<span class="lang-ov-flag">🇺🇿</span>' +
            '<span class="lang-ov-code">UZ</span>' +
            '<span class="lang-ov-name">O\'zbekcha</span>' +
          '</button>' +
          '<button class="lang-ov-card' + (currentLang === 'uz-cyrl' ? ' active' : '') + '" data-lang="uz-cyrl">' +
            '<span class="lang-ov-flag">🇺🇿</span>' +
            '<span class="lang-ov-code">УЗ</span>' +
            '<span class="lang-ov-name">Ўзбекча</span>' +
          '</button>' +
          '<button class="lang-ov-card' + (currentLang === 'ru' ? ' active' : '') + '" data-lang="ru">' +
            '<span class="lang-ov-flag">🇷🇺</span>' +
            '<span class="lang-ov-code">RU</span>' +
            '<span class="lang-ov-name">Русский</span>' +
          '</button>' +
          '<button class="lang-ov-card' + (currentLang === 'en' ? ' active' : '') + '" data-lang="en">' +
            '<span class="lang-ov-flag">🇬🇧</span>' +
            '<span class="lang-ov-code">EN</span>' +
            '<span class="lang-ov-name">English</span>' +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    function openLang() {
      var rect = globeBtn.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      overlay.style.setProperty('--lo-x', cx + 'px');
      overlay.style.setProperty('--lo-y', cy + 'px');
      overlay.classList.add('open');
      globeBtn.classList.add('active');
    }

    function closeLang() {
      overlay.classList.remove('open');
      globeBtn.classList.remove('active');
    }

    globeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      overlay.classList.contains('open') ? closeLang() : openLang();
    });

    var closeX = document.getElementById('langOvClose');
    if (closeX) closeX.addEventListener('click', closeLang);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLang();
    });

    /* Language card click — delegate to lang.js switchLang */
    overlay.querySelectorAll('.lang-ov-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var lang = card.getAttribute('data-lang');
        if (typeof switchLang === 'function') {
          closeLang();
          switchLang(lang);
        }
      });
    });
  }

  /* ─── Main init — DOM tayyor bo'lgach ─── */
  function init() {
    /* Navbar shadow on scroll */
    var navbar = document.querySelector('.main-navbar');
    if (navbar) {
      window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
      }, { passive: true });
    }

    /* ─── Full-screen Overlay Nav ─── */
    var drawer   = document.getElementById('mobDrawer');
    var closeBtn = document.getElementById('mobClose');

    /* Deduplicate toggle buttons (same el matches both .mob-toggle and #mobToggleBtn) */
    var seen = new Set();
    var toggleBtns = [];
    document.querySelectorAll('.mob-toggle, #mobToggleBtn').forEach(function (el) {
      if (!seen.has(el)) { seen.add(el); toggleBtns.push(el); }
    });

    if (!drawer) return;

    function openNav() {
      drawer.classList.add('open');
      document.body.classList.add('mob-open');
      toggleBtns.forEach(function (b) { b.classList.add('active'); });
    }

    function closeNav() {
      drawer.classList.remove('open');
      document.body.classList.remove('mob-open');
      toggleBtns.forEach(function (b) { b.classList.remove('active'); });
    }

    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        drawer.classList.contains('open') ? closeNav() : openNav();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeNav);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    drawer.querySelectorAll('.mob-nav a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });

    /* Mark active link */
    var path = window.location.pathname;
    drawer.querySelectorAll('.mob-nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href !== '#') {
        if (href === path || (path !== '/' && href !== '/' && path.startsWith(href))) {
          a.classList.add('mob-active');
        }
      }
    });

    /* ─── Scroll Reveal ─── */
    if ('IntersectionObserver' in window) {
      var autoSelectors = [
        '.news-card', '.art-card', '.cat-card', '.ni-card',
        '.result-card', '.liked-card', '.section-title',
        '.latest-item', '.stat-item', '.team-card'
      ];
      var tagged = new Set();
      autoSelectors.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el, idx) {
          if (!tagged.has(el) && !el.classList.contains('reveal')) {
            el.classList.add('reveal');
            var d = idx % 4;
            if (d === 1) el.classList.add('reveal-d1');
            else if (d === 2) el.classList.add('reveal-d2');
            else if (d === 3) el.classList.add('reveal-d3');
            tagged.add(el);
          }
        });
      });

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
        io.observe(el);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initProgressBar();
      initLangOverlay();
      init();
    });
  } else {
    initProgressBar();
    initLangOverlay();
    init();
  }

})();