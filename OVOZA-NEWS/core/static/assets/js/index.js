/* ===== OVOZA NEWS — INDEX PAGE JS ===== */
(function () {
  "use strict";

  /* ─── Live clock ─────────────────────────────────────── */
  const dateEl = document.getElementById("topbarDate");
  if (dateEl) {
    const days   = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
    const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
    function tick() {
      const n = new Date();
      dateEl.textContent = `${days[n.getDay()]}, ${n.getDate()} ${months[n.getMonth()]} ${n.getFullYear()} | ${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;
    }
    tick();
    setInterval(tick, 30000);
  }

  /* ─── Lang switcher ──────────────────────────────────── */
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ─── Mobile nav ─────────────────────────────────────── */
  const navToggler = document.getElementById("navbarToggler");
  const navMenu    = document.getElementById("navbarMenu");
  if (navToggler && navMenu) {
    navToggler.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const ic = navToggler.querySelector("i");
      if (ic) { ic.classList.toggle("fa-bars"); ic.classList.toggle("fa-times"); }
    });
  }

  /* ─── Sticky navbar shadow ───────────────────────────── */
  const navbar = document.querySelector(".main-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 50
        ? "0 4px 30px rgba(0,0,0,0.8)"
        : "0 2px 20px rgba(0,0,0,0.5)";
    });
  }

  /* ─── Scroll to top ──────────────────────────────────── */
  const scrollBtn = document.getElementById("scrollTop");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.opacity       = window.scrollY > 400 ? "1" : "0";
      scrollBtn.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
    });
    scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ─── Page loader ────────────────────────────────────── */
  window.addEventListener("load", function () {
    setTimeout(function () {
      const loader = document.getElementById("pageLoader");
      if (loader) loader.classList.add("hidden");
    }, 1100);
  });

  /* ─── Hero typewriter ────────────────────────────────── */
  window.addEventListener("load", function () {
    const titleEl = document.getElementById("heroTitle");
    const text = titleEl ? titleEl.getAttribute("data-text") : "";
    if (!text) return;
    const cursor = document.createElement("span");
    cursor.className = "hero-cursor";
    titleEl.appendChild(cursor);
    let i = 0;
    function type() {
      if (i < text.length) {
        titleEl.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(type, 38);
      } else {
        cursor.remove();
        document.querySelectorAll(".hero-anim-badge, .hero-anim-desc, .hero-anim-meta, .hero-anim-btn")
          .forEach(el => el.classList.add("visible"));
      }
    }
    setTimeout(type, 300);
  });

  /* ─── Search overlay ─────────────────────────────────── */
  const overlay = document.getElementById("searchOverlay");
  const input   = document.getElementById("searchOverlayInput");
  const closeS  = document.getElementById("searchOverlayClose");
  const trigger = document.getElementById("searchTrigger");

  function openSearch() {
    if (!overlay) return;
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => { if (input) input.focus(); }, 120);
  }
  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (trigger) trigger.addEventListener("click", openSearch);
  if (closeS)  closeS.addEventListener("click", closeSearch);
  if (overlay) overlay.addEventListener("click", e => { if (e.target === overlay) closeSearch(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      overlay?.classList.contains("active") ? closeSearch() : openSearch();
    }
  });

  document.querySelectorAll(".search-tag").forEach(tag => {
    tag.addEventListener("click", function () {
      if (input) input.value = this.dataset.q || this.textContent.trim().replace(/^[^\wA-Za-z]+/, "");
      const form = overlay?.querySelector("form");
      if (form) form.submit();
    });
  });

  /* ─── Valyuta kurslari (Markaziy bank API) ───────────── */
  const CURRENCY_KEY = "ovoza_currency";
  const CURRENCY_TTL = 60 * 60 * 1000;

  const CURRENCIES = [
    { code: "USD", el: "rate-usd", chg: "chg-usd" },
    { code: "EUR", el: "rate-eur", chg: "chg-eur" },
    { code: "RUB", el: "rate-rub", chg: "chg-rub" },
    { code: "CNY", el: "rate-cny", chg: "chg-cny" },
    { code: "GBP", el: "rate-gbp", chg: "chg-gbp" },
  ];

  function formatRate(rate) {
    return Number(rate).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function updateCurrencyUI(data) {
    const timeEl = document.getElementById("currencyTime");
    if (timeEl) {
      const now = new Date();
      timeEl.textContent = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    }
    CURRENCIES.forEach(cur => {
      const item = data.find(d => d.Ccy === cur.code);
      if (!item) return;
      const rateEl = document.getElementById(cur.el);
      const chgEl  = document.getElementById(cur.chg);
      if (rateEl) rateEl.textContent = formatRate(item.Rate);
      if (chgEl) {
        const isUp = parseFloat(item.Diff) >= 0;
        const base = parseFloat(item.Rate) - parseFloat(item.Diff);
        const pct  = base !== 0 ? Math.abs(parseFloat(item.Diff) / base * 100).toFixed(2) : "0.00";
        chgEl.className = `currency-change ${isUp ? "up" : "down"}`;
        chgEl.innerHTML = `<i class="fas fa-arrow-${isUp ? "up" : "down"}"></i> ${pct}%`;
      }
    });
  }

  async function fetchCurrency() {
    try {
      const cached = localStorage.getItem(CURRENCY_KEY);
      if (cached) {
        const { data, time } = JSON.parse(cached);
        if (Date.now() - time < CURRENCY_TTL) { updateCurrencyUI(data); return; }
      }
    } catch (e) {}
    try {
      const res  = await fetch("https://cbu.uz/uz/arkhiv-kursov-valyut/json/");
      const data = await res.json();
      updateCurrencyUI(data);
      localStorage.setItem(CURRENCY_KEY, JSON.stringify({ data, time: Date.now() }));
    } catch (err) {
      console.warn("Valyuta kurslari yuklanmadi:", err);
    }
  }

  fetchCurrency();

  /* ─── Ob-havo + AQI ─────────────────────────────────── */
  const WEATHER_API_KEY = "ac657e0bd3c958347b6b27ef4a4fd29b";
  const IQAIR_API_KEY   = "1a123432-925a-42d5-a400-9ebce10b2a64";

  const REGIONS = [
    { name: "Toshkent",    en: "Tashkent",   iqCity: "Tashkent",    iqState: "Toshkent Shahri" },
    { name: "Samarqand",   en: "Samarkand",  iqCity: "Samarkand",   iqState: "Samarqand"       },
    { name: "Buxoro",      en: "Bukhara",    iqCity: "Bukhara",     iqState: "Bukhara"         },
    { name: "Namangan",    en: "Namangan",   iqCity: "Namangan",    iqState: "Namangan"        },
    { name: "Andijon",     en: "Andijan",    iqCity: "Andijon",     iqState: "Andijon"         },
    { name: "Farg'ona",    en: "Fergana",    iqCity: "Fergana",     iqState: "Fergana"         },
    { name: "Nukus",       en: "Nukus",      iqCity: "Nukus",       iqState: "Karakalpakstan"  },
    { name: "Qarshi",      en: "Karshi",     iqCity: "Karshi",      iqState: "Qashqadaryo"     },
    { name: "Termiz",      en: "Termez",     iqCity: "Termez",      iqState: "Surxondaryo"     },
    { name: "Jizzax",      en: "Jizzakh",    iqCity: "Jizzax",      iqState: "Jizzax"          },
    { name: "Guliston",    en: "Guliston",   iqCity: "Gulistan",    iqState: "Sirdaryo"        },
    { name: "Navoiy",      en: "Navoi",      iqCity: "Navoiy",      iqState: "Navoiy"          },
    { name: "Urganch",     en: "Urgench",    iqCity: "Urgench",     iqState: "Xorazm"          },
    { name: "Xiva",        en: "Khiva",      iqCity: "Khiva",       iqState: "Xorazm"          },
  ];

  const W_ICONS = {
    "01d":"fa-sun sunny","01n":"fa-moon",
    "02d":"fa-cloud-sun cloudy","02n":"fa-cloud-moon cloudy",
    "03d":"fa-cloud cloudy","03n":"fa-cloud cloudy",
    "04d":"fa-cloud cloudy","04n":"fa-cloud cloudy",
    "09d":"fa-cloud-rain rainy","09n":"fa-cloud-rain rainy",
    "10d":"fa-cloud-sun-rain rainy","10n":"fa-cloud-moon-rain rainy",
    "11d":"fa-bolt","11n":"fa-bolt",
    "13d":"fa-snowflake snowy","13n":"fa-snowflake snowy",
    "50d":"fa-smog cloudy","50n":"fa-smog cloudy",
  };

  function aqiInfo(aqi) {
    if (aqi <= 50)  return { label: "Yaxshi",       color: "#27ae60", bg: "rgba(39,174,96,0.12)",  icon: "fa-smile" };
    if (aqi <= 100) return { label: "O'rtacha",     color: "#f39c12", bg: "rgba(243,156,18,0.12)", icon: "fa-meh" };
    if (aqi <= 150) return { label: "Sezgir uchun", color: "#e67e22", bg: "rgba(230,126,34,0.12)", icon: "fa-meh-rolling-eyes" };
    if (aqi <= 200) return { label: "Zararli",      color: "#c0392b", bg: "rgba(192,57,43,0.12)",  icon: "fa-frown" };
    if (aqi <= 300) return { label: "Juda zararli", color: "#8e44ad", bg: "rgba(142,68,173,0.12)", icon: "fa-tired" };
    return                  { label: "Xavfli",      color: "#641e16", bg: "rgba(100,30,22,0.15)",  icon: "fa-skull" };
  }

  const SELECT_STYLE = `
    width:100%; background:var(--dark-3); border:none;
    border-bottom:1px solid var(--border); color:var(--white);
    font-family:var(--font-label); font-size:12px; font-weight:600;
    letter-spacing:0.5px; text-transform:uppercase;
    padding:9px 14px; cursor:pointer; outline:none;
  `;

  document.addEventListener("DOMContentLoaded", function () {

    /* ── Ob-havo dropdown ── */
    const weatherTabs = document.querySelector(".weather-tabs");
    if (weatherTabs) {
      weatherTabs.innerHTML = `
        <select id="weatherSelect" style="${SELECT_STYLE}">
          ${REGIONS.map((r, i) => `<option value="${i}">${r.name}</option>`).join("")}
        </select>
      `;
      const sel = document.getElementById("weatherSelect");
      if (sel) {
        sel.addEventListener("change", () => {
          const idx = parseInt(sel.value);
          fetchWeather(idx);
        });
        fetchWeather(0);
      }
    }

    /* ── AQI dropdown ── */
    const aqiWrap = document.getElementById("aqiWidget");
    if (aqiWrap) {
      const selectHtml = `
        <select id="aqiSelect" style="${SELECT_STYLE}">
          ${REGIONS.map((r, i) => `<option value="${i}">${r.name}</option>`).join("")}
        </select>
        <div id="aqiContent">
          <div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">Yuklanmoqda...</div>
        </div>
      `;
      aqiWrap.innerHTML = selectHtml;

      const aqiSel = document.getElementById("aqiSelect");
      if (aqiSel) {
        aqiSel.addEventListener("change", () => fetchAQI(parseInt(aqiSel.value)));
        fetchAQI(0);
      }
    }
  });

  /* ─── Ob-havo ────────────────────────────────────────── */
  async function fetchWeather(idx) {
    const region = REGIONS[idx];
    if (!region) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${region.en},UZ&appid=${WEATHER_API_KEY}&units=metric&lang=ru`
      );
      const data = await res.json();
      if (data.cod !== 200) return;

      const icon    = data.weather[0].icon;
      const iconCls = W_ICONS[icon] || "fa-cloud cloudy";
      const temp    = Math.round(data.main.temp);
      const desc    = data.weather[0].description;
      const wind    = Math.round(data.wind.speed * 3.6);
      const humid   = data.main.humidity;
      const vis     = data.visibility ? Math.round(data.visibility / 1000) : "-";

      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set("weatherTemp",  `${temp > 0 ? "+" : ""}${temp}°C`);
      set("weatherDesc",  desc.charAt(0).toUpperCase() + desc.slice(1));
      set("weatherCity",  region.name);
      set("wWind",        `${wind} km/h`);
      set("wHumid",       `${humid}%`);
      set("wVis",         `${vis} km`);

      const iconEl = document.querySelector(".weather-icon");
      if (iconEl) {
        const parts = iconCls.split(" ");
        iconEl.className = `fas ${parts[0]} weather-icon${parts[1] ? " " + parts[1] : ""}`;
      }

      fetchForecast(idx);
    } catch (err) {
      console.warn("Ob-havo yuklanmadi:", err);
    }
  }

  async function fetchForecast(idx) {
    const region = REGIONS[idx];
    if (!region) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${region.en},UZ&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await res.json();
      if (!data.list) return;

      const days  = ["Yak","Dush","Ses","Chor","Pay","Jum","Shan"];
      const seen  = new Set();
      const items = [];
      const today = new Date().getDate();

      for (const item of data.list) {
        const d = new Date(item.dt * 1000);
        const dayKey = d.getDate();
        if (dayKey !== today && !seen.has(dayKey) && items.length < 4) {
          seen.add(dayKey);
          items.push({ day: days[d.getDay()], icon: item.weather[0].icon, temp: Math.round(item.main.temp) });
        }
      }

      const wrap = document.querySelector(".weather-forecast");
      if (!wrap) return;
      wrap.innerHTML = items.map(it => {
        const cls = (W_ICONS[it.icon] || "fa-cloud").split(" ")[0];
        return `<div class="wf-item">
          <span>${it.day}</span>
          <i class="fas ${cls}"></i>
          <span>${it.temp > 0 ? "+" : ""}${it.temp}°</span>
        </div>`;
      }).join("");
    } catch (err) {
      console.warn("Forecast yuklanmadi:", err);
    }
  }

  /* ─── Havo sifati widget (IQAir AQI) ────────────────── */
  async function fetchAQI(idx) {
    const region  = REGIONS[idx];
    const content = document.getElementById("aqiContent");
    if (!region || !content) return;

    content.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">Yuklanmoqda...</div>`;

    try {
      const res = await fetch(
        `https://api.airvisual.com/v2/city?city=${encodeURIComponent(region.iqCity)}&state=${encodeURIComponent(region.iqState)}&country=Uzbekistan&key=${IQAIR_API_KEY}`
      );
      const data = await res.json();

      if (data.status !== "success") {
        content.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">${region.name} uchun ma'lumot topilmadi</div>`;
        return;
      }

      const aqi  = data.data.current.pollution.aqius;
      const pm25 = data.data.current.pollution.p2;
      const info = aqiInfo(aqi);
      const pct  = Math.min(Math.round((aqi / 300) * 100), 100);

      content.innerHTML = `
        <div style="padding:16px 18px;">
          <div style="font-family:var(--font-label);font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--primary);margin-bottom:12px;">
            <i class="fas fa-map-marker-alt"></i> ${region.name}
          </div>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
            <div style="
              width:72px;height:72px;border-radius:50%;
              background:${info.bg};border:3px solid ${info.color};
              display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;
            ">
              <div style="font-family:var(--font-display);font-size:24px;font-weight:900;color:${info.color};line-height:1;">${aqi}</div>
              <div style="font-size:9px;color:${info.color};font-family:var(--font-label);letter-spacing:0.5px;">AQI</div>
            </div>
            <div>
              <div style="font-family:var(--font-display);font-size:17px;font-weight:700;color:var(--white);margin-bottom:4px;">${info.label}</div>
              <div style="font-size:12px;color:var(--text-muted);">Havo sifati indeksi</div>
              ${pm25 && pm25.v != null ? `<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">PM2.5: <span style="color:${info.color}">${pm25.v} µg/m³</span></div>` : ""}
            </div>
          </div>
          <div style="background:var(--dark-3);border-radius:4px;height:6px;overflow:hidden;margin-bottom:10px;">
            <div style="height:100%;width:${pct}%;background:linear-gradient(to right,#27ae60,#f39c12,#c0392b);border-radius:4px;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);font-family:var(--font-label);">
            <span style="color:#27ae60;">Yaxshi</span>
            <span style="color:#f39c12;">O'rtacha</span>
            <span style="color:#c0392b;">Zararli</span>
          </div>
          <div style="margin-top:14px;padding:10px 12px;background:${info.bg};border-radius:3px;border-left:3px solid ${info.color};font-size:12px;color:var(--text-muted);line-height:1.5;">
            <i class="fas ${info.icon}" style="color:${info.color};margin-right:6px;"></i>
            ${aqi <= 50  ? "Havo toza. Tashqarida bo'lish xavfsiz." :
              aqi <= 100 ? "Sezgir odamlar ehtiyot bo'lsin." :
              aqi <= 150 ? "Tashqarida uzoq turmaslik tavsiya etiladi." :
              aqi <= 200 ? "Tashqarida faoliyatni cheklang." :
              aqi <= 300 ? "Jiddiy xavf. Tashqariga chiqmang." :
                           "Favqulodda xavfli. Darhol ichkariga kiring."}
          </div>
        </div>
        <div style="padding:8px 18px;border-top:1px solid var(--border);font-size:11px;color:var(--gray-mid);display:flex;align-items:center;gap:6px;">
          <i class="fas fa-sync-alt" style="color:var(--primary);"></i> IQAir ma'lumotlari
        </div>
      `;
    } catch (err) {
      content.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">Yuklanmadi</div>`;
      console.warn("AQI yuklanmadi:", err);
    }
  }

  console.log("Ovoza – index.js yuklandi");
})();


window.subscribeNow = function() {
  const email = document.getElementById('subscribeEmail')?.value?.trim();
  if (!email) return;

  const csrfToken = document.cookie.split(';')
    .find(c => c.trim().startsWith('csrftoken='))
    ?.split('=')[1] || '';

  fetch('/subscribe/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
    body: JSON.stringify({ email })
  })
  .then(r => r.json())
  .then(data => {
    showToast(data.message, data.success);
    if (data.success) document.getElementById('subscribeEmail').value = '';
  });
};

function showToast(message, success) {
  let toast = document.getElementById('ovozaToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ovozaToast';
    toast.style.cssText = `
      position:fixed; bottom:80px; right:28px; z-index:99999;
      padding:14px 20px; border-radius:4px; font-size:14px;
      font-family:var(--font-body); color:#fff; max-width:320px;
      box-shadow:0 8px 24px rgba(0,0,0,0.5);
      display:flex; align-items:center; gap:10px;
      transform:translateY(20px); opacity:0;
      transition:transform 0.3s ease, opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
  }

  toast.style.background = success ? '#27ae60' : '#c0392b';
  toast.innerHTML = `
    <i class="fas fa-${success ? 'check-circle' : 'times-circle'}" style="font-size:18px;flex-shrink:0;"></i>
    <span>${message}</span>
  `;

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3500);
}