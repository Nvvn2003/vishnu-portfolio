/* =========================================================
   VISHNU VARDHAN NAIDU NAKKELLA — interactions
   Everything degrades gracefully: no JS / no CDN = static site.
   ========================================================= */

document.documentElement.classList.add("has-js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- YEAR ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   SMOOTH SCROLL (Lenis) + ScrollTrigger sync
   ========================================================= */
let lenis = null;
if (typeof Lenis !== "undefined" && !reduceMotion) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  window.lenis = lenis; // exposed for debugging / programmatic scroll
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}

/* ---------- Anchor links use Lenis (or native) ---------- */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id === "#" || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else target.scrollIntoView({ behavior: "smooth" });
  });
});

/* =========================================================
   FIT HERO LINES TO FULL WIDTH (edge-to-edge editorial type)
   Each headline line is scaled so it spans the hero width,
   regardless of how long the word is.
   ========================================================= */
const heroTitle = document.querySelector(".hero__title");
const heroLines = document.querySelectorAll(".hero__title .line");

function fitHero() {
  const hero = document.querySelector(".hero");
  if (!hero || !heroLines.length) return;
  const cs = getComputedStyle(hero);
  const avail = hero.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  if (avail <= 0) return;
  const target = avail - 2; // small safety margin so the last glyph never clips
  heroLines.forEach((line) => {
    const word = line.querySelector(".word");
    if (!word) return;
    word.style.fontSize = ""; // reset to CSS base before measuring
    const base = parseFloat(getComputedStyle(word).fontSize);
    const w = word.getBoundingClientRect().width;
    if (w <= 0) return;
    let size = base * (target / w);
    word.style.fontSize = size + "px";
    // letter-spacing/kerning don't scale perfectly linearly, so re-measure
    // and correct any overshoot — guarantees the line fits within the width.
    const actual = word.getBoundingClientRect().width;
    if (actual > target) {
      size *= target / actual;
      word.style.fontSize = size + "px";
    }
  });
  if (heroTitle) heroTitle.classList.add("is-fit");
}

// Size once now, and again once the web fonts are actually loaded
fitHero();
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fitHero);
}
// Re-fit on resize (debounced)
let fitTimer;
window.addEventListener("resize", () => {
  clearTimeout(fitTimer);
  fitTimer = setTimeout(fitHero, 150);
});

/* =========================================================
   LOADER → HERO ENTRANCE ("Invincible" slam-in)
   ========================================================= */
const loader = document.querySelector(".loader");
const heroWords = document.querySelectorAll(".hero__title .word");

function revealHero() {
  if (typeof gsap !== "undefined" && !reduceMotion) {
    gsap.set(heroWords, { yPercent: 120 });
    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(heroWords, {
      yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.09,
    });
  } else {
    heroWords.forEach((w) => (w.style.transform = "none"));
  }
}

window.addEventListener("load", () => {
  if (loader) {
    setTimeout(() => {
      loader.classList.add("is-done");
      revealHero();
    }, reduceMotion ? 0 : 700);
  } else {
    revealHero();
  }
});

/* =========================================================
   SCROLL REVEALS — staggered per group, blur + rise + scale
   ========================================================= */
const revealEls = document.querySelectorAll("[data-reveal]");

// Give each element a stagger delay based on its position among reveal
// siblings, so groups (stats, services, cards…) cascade in instead of
// all snapping at once. Lone elements get 0 and reveal immediately.
revealEls.forEach((el) => {
  if (!el.parentElement) return;
  const sibs = Array.prototype.filter.call(el.parentElement.children, (c) =>
    c.hasAttribute("data-reveal")
  );
  const i = sibs.indexOf(el);
  if (i > 0) el.style.setProperty("--rd", i * 85 + "ms");
});

if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-in"));
}

/* =========================================================
   COUNT-UP STATS
   ========================================================= */
const counters = document.querySelectorAll("[data-count]");
if ("IntersectionObserver" in window) {
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const duration = reduceMotion ? 0 : 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration || 1, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => cio.observe(c));
}

/* =========================================================
   CUSTOM CURSOR + MAGNETIC + SPOTLIGHT (fine pointer only)
   ========================================================= */
if (finePointer && !reduceMotion) {
  const cursor = document.querySelector(".cursor");
  const dot = document.querySelector(".cursor-dot");
  const spotlight = document.querySelector(".spotlight");

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
    if (spotlight) spotlight.style.transform = `translate(${mx}px, ${my}px)`;
  });

  function loop() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    if (cursor) { cursor.style.left = cx + "px"; cursor.style.top = cy + "px"; }
    requestAnimationFrame(loop);
  }
  loop();

  // Hover states
  document.querySelectorAll("a, button, [data-magnetic]").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor && cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor && cursor.classList.remove("is-hover"));
  });

  // "VIEW" cursor over work items
  document.querySelectorAll('[data-cursor="view"]').forEach((el) => {
    el.addEventListener("mouseenter", () => cursor && cursor.classList.add("is-view"));
    el.addEventListener("mouseleave", () => cursor && cursor.classList.remove("is-view"));
  });

  // Magnetic pull
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = 0.35;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = "translate(0,0)"; });
  });
}

/* =========================================================
   MOBILE MENU
   ========================================================= */
const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector(".menu");

function closeMenu() {
  if (!menu || !toggle) return;
  menu.classList.remove("is-open");
  toggle.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
}
if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* =========================================================
   PAGE TRANSITIONS — fade through near-black between pages
   ========================================================= */
let pageFade = document.querySelector(".page-fade");
if (!pageFade) {
  pageFade = document.createElement("div");
  pageFade.className = "page-fade";
  pageFade.setAttribute("aria-hidden", "true");
  document.body.appendChild(pageFade);
}

function navigateTo(url) {
  if (reduceMotion) { window.location.href = url; return; }
  pageFade.style.animation = "none";          // clear the enter-reveal animation
  pageFade.style.transition = "opacity 0.42s cubic-bezier(0.16,1,0.3,1)";
  pageFade.style.pointerEvents = "all";
  requestAnimationFrame(() => { pageFade.style.opacity = "1"; });
  setTimeout(() => { window.location.href = url; }, 430);
}

// Intercept internal page links and play the transition.
document.addEventListener("click", (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest("a");
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
  if (a.target === "_blank" || a.hasAttribute("download")) return;
  let url;
  try { url = new URL(href, window.location.href); } catch (_) { return; }
  if (url.origin !== window.location.origin) return;        // external → let it go
  if (url.pathname === window.location.pathname && url.hash) return; // same page anchor
  e.preventDefault();
  closeMenu();
  navigateTo(url.href);
});

// Safari/bfcache: reset the overlay when returning to a page.
window.addEventListener("pageshow", (e) => {
  if (e.persisted) { pageFade.style.opacity = "0"; pageFade.style.pointerEvents = "none"; }
});

/* =========================================================
   CASE STUDY: keyboard navigation (← previous / → next)
   ========================================================= */
const casePrev = document.querySelector("[data-case-prev]");
const caseNext = document.querySelector("[data-case-next]");
if (casePrev || caseNext) {
  window.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || "");
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "ArrowLeft" && casePrev) navigateTo(casePrev.getAttribute("href"));
    if (e.key === "ArrowRight" && caseNext) navigateTo(caseNext.getAttribute("href"));
  });
}
