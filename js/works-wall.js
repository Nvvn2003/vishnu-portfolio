/* ==========================================================================
   WORKS WALL (preview)
   One collage of work drifting left → right behind Vishnu.
   - Every tile keeps its design's real proportions, so nothing is cropped.
   - Tiles come in different sizes: the collage is built from "blocks",
     each block is a stack of strips, each strip holds 1–3 pieces side by
     side. A block's width is solved so its strips fill the wall's height
     exactly, which keeps the gaps thin and even everywhere.
   - Click any piece to expand it into a full preview.
   All sizes are in "units": the wall is 100 units tall, CSS turns units
   into real sizes per screen (see --u in the page styles).
   ========================================================================== */
(() => {
  const wall = document.getElementById("worksWall");
  if (!wall) return;

  /* ---- the work: w × h is the full-size file, the tile has the same shape ---- */
  const Q = (name, w, h, title, cat) => ({
    id: `quintet-${name}`, w, h, title: `QUINTET — ${title}`, cat,
    full: `assets/quintet/${name}.jpg`,
  });
  const G = (id, w, h, title, cat) => ({ id, w, h, title, cat, full: `assets/wall/full/${id}.jpg` });

  const WORKS = [
    Q("keyvisual", 2000, 1116, "The Elements Collection", "Key Visual"),
    Q("lineup", 2000, 1116, "The Five Eau de Parfums", "Packaging"),
    Q("water", 1200, 1607, "Water", "Art Direction"),
    Q("earth", 1200, 1607, "Earth", "Art Direction"),
    Q("fire", 1200, 1607, "Fire", "Art Direction"),
    Q("air", 1200, 1607, "Air", "Art Direction"),
    Q("aether", 1200, 1607, "Aether", "Art Direction"),
    Q("wardrobe", 2000, 1116, "The Wardrobe", "Packaging"),
    Q("discovery", 1400, 1738, "The Discovery Set", "Packaging"),
    Q("payday-vertical", 1100, 1971, "The Payday Ritual", "Campaign"),
    Q("payday-square", 1400, 1400, "The Payday Ritual, Feed Format", "Social"),
    G("poster-boy-ads", 2000, 1391, "Poster Boy Ads — Brand Identity", "Branding"),
    G("bb-building-mockup", 2000, 1500, "BB Building — Architectural Mock", "Art Direction"),
    G("demo-invite", 1410, 2000, "Demo Invite — Event Design", "Print"),
    G("atom-thumbnail", 1820, 1024, "Atom — Content Thumbnail", "Content"),
    G("ozone-thumbnail", 1920, 1080, "Ozone — Content Thumbnail", "Content"),
    G("fish-aqua", 1080, 1080, "Fish Aqua — Visual Identity", "Branding"),
    G("iphone-winter", 1493, 2000, "iPhone Winter — Product Shoot", "Product"),
    G("ti-mockup", 2000, 1391, "TI — Brand Mockup", "Brand"),
    G("missamma", 2000, 1391, "Missamma — Campaign", "Campaign"),
  ];
  const byId = new Map(WORKS.map((w) => [w.id, w]));

  /* ---- the collage, left to right: block → strips (top to bottom) → pieces ---- */
  // three strips per block keeps every tile small (about a quarter to two
  // fifths of the wall's height) while sizes still vary with each design
  const SHEET = [
    [["poster-boy-ads"], ["quintet-water", "demo-invite"], ["atom-thumbnail"]],
    [["quintet-fire", "quintet-discovery"], ["ti-mockup"], ["quintet-keyvisual"]],
    [["ozone-thumbnail"], ["fish-aqua"], ["missamma"]],
    [["quintet-earth", "iphone-winter"], ["quintet-wardrobe"], ["quintet-payday-vertical", "quintet-aether"]],
    [["quintet-lineup"], ["bb-building-mockup"], ["quintet-air", "quintet-payday-square"]],
  ];
  const GAP = 1.4;  // space between tiles, in units
  const SPEED = 8;  // units per second — one speed for the whole sheet

  // browsing order in the preview follows the collage as you see it
  const ORDER = SHEET.flat(2).map((id) => byId.get(id));
  const ratio = (w) => w.w / w.h;
  const tileSrc = (w) => `assets/wall/tile/${w.id}.jpg`;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function layoutSheet() {
    const tiles = [];
    let x = 0;
    for (const block of SHEET) {
      const strips = block.map((ids) => ids.map((id) => byId.get(id)));
      const sums = strips.map((s) => s.reduce((a, w) => a + ratio(w), 0));
      // solve the block width so the strips stack to exactly 100 units tall
      let inv = 0, extra = 0;
      strips.forEach((s, k) => { inv += 1 / sums[k]; extra += ((s.length - 1) * GAP) / sums[k]; });
      const bw = (100 - (strips.length - 1) * GAP + extra) / inv;
      let y = 0;
      strips.forEach((s, k) => {
        const h = (bw - (s.length - 1) * GAP) / sums[k];
        let sx = x;
        s.forEach((w) => {
          const tw = h * ratio(w);
          tiles.push({ work: w, x: sx, y, w: tw, h });
          sx += tw + GAP;
        });
        y += h + GAP;
      });
      x += bw + GAP;
    }
    return { tiles, width: x };
  }

  /* ---- build the moving track ----
     The track holds two identical halves and slides exactly one half, so the
     loop is seamless. Each half repeats the sheet as often as needed to span
     the screen (on today's sizes once is enough). */
  const stage = wall.querySelector(".ww__stage");
  const track = wall.querySelector(".ww__track");
  const sheet = layoutSheet();
  let perHalf = 0;

  function build() {
    const box = stage.getBoundingClientRect();
    if (!box.height) return;
    const visibleUnits = box.width / (box.height / 100);
    const need = Math.max(1, Math.ceil(visibleUnits / sheet.width));
    if (need === perHalf) return;
    perHalf = need;

    const copies = reduced ? perHalf : perHalf * 2;
    const liveCopy = reduced ? 0 : perHalf; // the copy on screen when the loop starts
    const frag = document.createDocumentFragment();
    for (let c = 0; c < copies; c++) {
      sheet.tiles.forEach((t) => {
        const w = t.work;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ww__tile";
        btn.dataset.i = String(ORDER.indexOf(w));
        btn.style.setProperty("--x", (t.x + c * sheet.width).toFixed(3));
        btn.style.setProperty("--y", t.y.toFixed(3));
        btn.style.setProperty("--w", t.w.toFixed(3));
        btn.style.setProperty("--h", t.h.toFixed(3));
        if (c === liveCopy) btn.setAttribute("aria-label", `Open ${w.title}`);
        else { btn.tabIndex = -1; btn.setAttribute("aria-hidden", "true"); }

        const img = document.createElement("img");
        img.src = tileSrc(w);
        img.width = w.w; img.height = w.h;
        img.alt = ""; img.decoding = "async"; img.draggable = false;

        const lbl = document.createElement("span");
        lbl.className = "ww__lbl";
        lbl.textContent = w.cat;

        btn.append(img, lbl);
        frag.appendChild(btn);
      });
    }
    track.replaceChildren(frag);
    track.style.setProperty("--sheet", sheet.width.toFixed(3));
    track.style.setProperty("--copies", String(copies));
    track.style.animationDuration = `${((sheet.width * perHalf) / SPEED).toFixed(2)}s`;
  }
  build();
  let resizeTimer;
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(build, 150); });

  /* ---- you: rise into place, then drift a little as the page scrolls
     (the breathing idle itself lives in the CSS) ---- */
  const person = wall.querySelector(".ww__person");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { wall.classList.add("is-in"); io.disconnect(); } });
    }, { threshold: 0.18 });
    io.observe(wall);
  } else {
    wall.classList.add("is-in");
  }

  if (person && !reduced) {
    let ticking = false;
    const drift = () => {
      ticking = false;
      const r = stage.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      // -1 as the wall enters the screen → +1 as it leaves
      const p = (r.top + r.height / 2 - innerHeight / 2) / (innerHeight / 2 + r.height / 2);
      person.style.setProperty("--py", (p * r.height * 0.06).toFixed(1));
    };
    addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(drift); }
    }, { passive: true });
    drift();
  }

  /* ---- the site's custom cursor turns to "VIEW" over a piece ---- */
  const siteCursor = document.querySelector(".cursor");
  if (siteCursor) {
    track.addEventListener("mouseover", (e) => { if (e.target.closest(".ww__tile")) siteCursor.classList.add("is-view"); });
    track.addEventListener("mouseout", (e) => { if (e.target.closest(".ww__tile")) siteCursor.classList.remove("is-view"); });
  }

  /* ==========================================================================
     FULL PREVIEW
     ========================================================================== */
  const lb = document.getElementById("wlb");
  const lbStage = document.getElementById("wlbStage");
  const lbImg = document.getElementById("wlbImg");
  const lbTitle = document.getElementById("wlbTitle");
  const lbCat = document.getElementById("wlbCat");
  const lbCount = document.getElementById("wlbCount");
  const lbBackdrop = lb.querySelector(".wlb__backdrop");
  const lbChrome = lb.querySelectorAll(".wlb__top, .wlb__bar");
  const btnClose = lb.querySelector(".wlb__close");
  const EASE = "cubic-bezier(.2,.8,.2,1)";
  const pad2 = (n) => String(n).padStart(2, "0");

  let current = -1;
  let byKeyboard = false;
  let closing = false;

  function fit() {
    const w = ORDER[current];
    const cs = getComputedStyle(lbStage);
    const maxW = lbStage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const maxH = lbStage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const s = Math.min(maxW / w.w, maxH / w.h, 1);
    lbImg.style.width = `${Math.round(w.w * s)}px`;
    lbImg.style.height = `${Math.round(w.h * s)}px`;
  }

  function show(i) {
    current = (i + ORDER.length) % ORDER.length;
    const w = ORDER[current];
    // the tile is already loaded, so it appears instantly; the sharp file swaps in
    lbImg.src = tileSrc(w);
    lbImg.alt = w.title;
    lbImg.classList.add("is-soft");
    fit();
    lbTitle.textContent = w.title;
    lbCat.textContent = w.cat;
    lbCount.innerHTML = `<b>${pad2(current + 1)}</b> / ${pad2(ORDER.length)}`;

    const want = current;
    const full = new Image();
    full.src = w.full;
    full.decode().catch(() => {}).then(() => {
      if (want !== current || !full.naturalWidth) return;
      lbImg.src = full.src;
      lbImg.classList.remove("is-soft");
    });
    [1, -1].forEach((d) => { new Image().src = ORDER[(current + d + ORDER.length) % ORDER.length].full; });
  }

  const flipFrom = (a, b) =>
    `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) ` +
    `scale(${a.width / b.width}, ${a.height / b.height})`;

  // the on-screen copy of a piece (for the expand / shrink-back animation)
  function visibleTile(i) {
    const s = stage.getBoundingClientRect();
    let best = null, bestArea = 0;
    track.querySelectorAll(`.ww__tile[data-i="${i}"]`).forEach((t) => {
      const r = t.getBoundingClientRect();
      const vw = Math.min(r.right, s.right) - Math.max(r.left, s.left);
      const vh = Math.min(r.bottom, s.bottom, innerHeight) - Math.max(r.top, s.top, 0);
      const area = Math.max(0, vw) * Math.max(0, vh);
      if (area > bestArea) { best = t; bestArea = area; }
    });
    return best && bestArea > 0.35 * best.offsetWidth * best.offsetHeight ? best : null;
  }

  function open(i, tile, keyboard) {
    if (!lb.hidden) return;
    byKeyboard = keyboard;
    wall.classList.add("is-open");
    if (siteCursor) siteCursor.classList.remove("is-view");
    document.documentElement.classList.add("wlb-lock");
    if (window.lenis) window.lenis.stop();
    lb.hidden = false;
    show(i);
    if (!reduced && tile) {
      lbImg.animate([{ transform: flipFrom(tile.getBoundingClientRect(), lbImg.getBoundingClientRect()) }, { transform: "none" }],
        { duration: 620, easing: EASE });
      lbBackdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: "ease-out" });
      lbChrome.forEach((el) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: 260, fill: "backwards" }));
    }
    btnClose.focus({ preventScroll: true });
  }

  function close() {
    if (lb.hidden || closing) return;
    closing = true;
    const tile = visibleTile(current);
    const finish = () => {
      lb.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      lb.hidden = true;
      closing = false;
      wall.classList.remove("is-open");
      document.documentElement.classList.remove("wlb-lock");
      if (window.lenis) window.lenis.start();
      if (byKeyboard) {
        const live = track.querySelector(`.ww__tile[data-i="${current}"]:not([tabindex])`);
        if (live) live.focus({ preventScroll: true });
      }
    };
    if (reduced) return finish();

    const fadeOut = [{ opacity: 1 }, { opacity: 0 }];
    lbChrome.forEach((el) => el.animate(fadeOut, { duration: 160, fill: "forwards" }));
    lbBackdrop.animate(fadeOut, { duration: 420, delay: 80, easing: "ease-in", fill: "forwards" });
    const anim = tile
      ? lbImg.animate([{ transform: "none" }, { transform: flipFrom(tile.getBoundingClientRect(), lbImg.getBoundingClientRect()) }],
          { duration: 520, easing: EASE, fill: "forwards" })
      : lbImg.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.94)" }],
          { duration: 260, fill: "forwards" });
    anim.finished.then(finish, finish);
  }

  function step(d) {
    if (lb.hidden || closing) return;
    show(current + d);
    if (!reduced) {
      lbImg.animate([{ opacity: 0, transform: `translateX(${d * 28}px)` }, { opacity: 1, transform: "none" }],
        { duration: 320, easing: EASE });
    }
  }

  track.addEventListener("click", (e) => {
    const tile = e.target.closest(".ww__tile");
    if (tile) open(Number(tile.dataset.i), tile, e.detail === 0);
  });
  btnClose.addEventListener("click", close);
  lb.querySelector(".wlb__prev").addEventListener("click", () => step(-1));
  lb.querySelector(".wlb__next").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) close(); });

  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "Tab") {
      // keep keyboard focus inside the preview while it's open
      const f = [...lb.querySelectorAll("button, a[href]")].filter((el) => !el.hidden && el.getClientRects().length);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  let touchX = null;
  lbStage.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lbStage.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
  });

  addEventListener("resize", () => { if (!lb.hidden) fit(); });
})();
