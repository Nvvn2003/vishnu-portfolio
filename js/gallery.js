/* =========================================================
   VVN — GALLERY
   Auto-scrolling marquee rows + click-to-lightbox.
   To add work: drop the file in assets/gallery/ and add a line
   to the ITEMS array below (src, title, cat, optional type:'video').
   ========================================================= */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ITEMS = [
    // Add your work here, e.g.:
    // { src: "assets/gallery/my-poster.jpg", title: "Project — Piece", cat: "Branding" },
    // { src: "assets/gallery/reel.mp4",      title: "Launch Film",     cat: "Motion", type: "video" },
  ];

  const wrap = document.getElementById("galleryRows");
  if (!wrap) return;
  if (!ITEMS.length) {
    wrap.innerHTML = '<p class="gallery__empty">Work coming soon — drop pieces into <code>assets/gallery/</code>.</p>';
    return;
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function tileHTML(it, i) {
    const media = it.type === "video"
      ? `<video src="${esc(it.src)}" muted loop playsinline preload="metadata"></video>`
      : `<img src="${esc(it.src)}" alt="${esc(it.title)}" decoding="async">`;
    return `<button class="gtile" type="button" data-i="${i}" aria-label="${esc(it.title)}">
        ${media}
        <span class="gtile__label"><span class="gtile__cat">${esc(it.cat)}</span><span class="gtile__title">${esc(it.title)}</span></span>
      </button>`;
  }

  // distribute into 3 rows (round-robin keeps each row varied)
  const ROWS = ITEMS.length >= 9 ? 3 : 2;
  const rows = Array.from({ length: ROWS }, () => []);
  ITEMS.forEach((it, i) => rows[i % ROWS].push(i));

  rows.forEach((idxs, r) => {
    const row = document.createElement("div");
    row.className = "mq-row";
    const track = document.createElement("div");
    track.className = "mq-track" + (r % 2 ? " is-reverse" : "");
    track.style.setProperty("--dur", 46 + r * 12 + "s");
    const html = idxs.map((i) => tileHTML(ITEMS[i], i)).join("");
    if (reduce) { track.innerHTML = html; row.classList.add("is-static"); }
    else { track.innerHTML = html + html; } // duplicate for seamless loop
    row.appendChild(track);
    wrap.appendChild(row);
  });

  /* ---------- lightbox ---------- */
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("aria-hidden", "true");
  lb.innerHTML =
    '<button class="lb-btn lb-close" aria-label="Close">✕</button>' +
    '<button class="lb-btn lb-prev" aria-label="Previous">‹</button>' +
    '<div class="lb-stage"></div>' +
    '<button class="lb-btn lb-next" aria-label="Next">›</button>' +
    '<div class="lightbox__cap"></div>';
  document.body.appendChild(lb);
  const stage = lb.querySelector(".lb-stage");
  const cap = lb.querySelector(".lightbox__cap");
  let cur = 0;

  function render() {
    const it = ITEMS[cur];
    stage.innerHTML = it.type === "video"
      ? `<video class="lightbox__media" src="${esc(it.src)}" controls autoplay loop playsinline></video>`
      : `<img class="lightbox__media" src="${esc(it.src)}" alt="${esc(it.title)}">`;
    cap.innerHTML = `<span class="lightbox__cat">${esc(it.cat)}</span>${esc(it.title)}`;
  }
  function openAt(i) {
    cur = i; render();
    lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    if (window.lenis) window.lenis.stop();
  }
  function close() {
    lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    const v = stage.querySelector("video"); if (v) v.pause();
    if (window.lenis) window.lenis.start();
  }
  function go(d) { cur = (cur + d + ITEMS.length) % ITEMS.length; render(); }

  wrap.addEventListener("click", (e) => {
    const t = e.target.closest(".gtile");
    if (t) openAt(parseInt(t.dataset.i, 10));
  });
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", () => go(-1));
  lb.querySelector(".lb-next").addEventListener("click", () => go(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  window.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
  });
})();
