/* Date */
  const days   = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
  const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
  const n = new Date();
  const d = document.getElementById("topbarDate");
  if (d) d.textContent = `${days[n.getDay()]}, ${n.getDate()} ${months[n.getMonth()]} ${n.getFullYear()}`;

  /* Lang */
  document.querySelectorAll(".lang-btn").forEach(b => {
    b.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".lang-btn").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
    });
  });

  /* Scroll top */
  const sb = document.getElementById("scrollTop");
  if (sb) {
    window.addEventListener("scroll", () => {
      sb.style.opacity       = window.scrollY > 400 ? "1" : "0";
      sb.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
    });
    sb.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }