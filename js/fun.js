/* =========================================================
   VVN — FUN. Hidden easter eggs, purely visual.
   100% safe to delete: remove this file + its <script> tag.
   Nothing here touches the real content or the layout.
   ========================================================= */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- toast helper ---------- */
  let stack = null;
  function toast(msg, ms = 3000) {
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    stack.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 450);
    }, ms);
  }

  /* ---------- emoji confetti ---------- */
  function burst(emojis, n) {
    if (reduce) return;
    n = n || 36;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      p.textContent = emojis[(Math.random() * emojis.length) | 0];
      p.style.left = Math.random() * 100 + "vw";
      p.style.fontSize = (1 + Math.random() * 1.7).toFixed(2) + "rem";
      document.body.appendChild(p);
      const dx = (Math.random() * 2 - 1) * 140;
      const rot = (Math.random() * 2 - 1) * 720;
      const dur = 2200 + Math.random() * 1700;
      const anim = p.animate(
        [
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          { transform: "translate(" + dx + "px,114vh) rotate(" + rot + "deg)", opacity: 1 },
        ],
        { duration: dur, easing: "cubic-bezier(.2,.6,.4,1)" }
      );
      anim.onfinish = () => p.remove();
    }
  }

  /* ---------- screen shake ---------- */
  function shake() {
    if (reduce) return;
    document.body.classList.remove("vvn-shake");
    void document.body.offsetWidth; // restart animation
    document.body.classList.add("vvn-shake");
    setTimeout(() => document.body.classList.remove("vvn-shake"), 700);
  }

  /* ---------- console hire-me + hints ---------- */
  try {
    const big = "color:#ff5c00;font-size:42px;font-weight:800;font-family:Syne,Arial,sans-serif";
    const ink = "color:#ece9e0;font-size:13px;font-family:monospace";
    const acc = "color:#ff5c00;font-size:13px;font-family:monospace";
    const dim = "color:#8c8a82;font-size:12px;font-family:monospace";
    console.log("%cVVN.", big);
    console.log("%cWell, well, well — a fellow dev snooping in the console. 👀", ink);
    console.log("%cLike what you see? Let's talk → hello@example.com", acc);
    console.log("%cPsst… a few secrets are hidden on this page:", ink);
    console.log("%c  • the Konami code  (↑ ↑ ↓ ↓ ← → ← → B A)", dim);
    console.log('%c  • type "comicsans"  😱', dim);
    console.log('%c  • type "makeitpop"  🎨', dim);
    console.log("%c  • poke the logo a few times", dim);
  } catch (e) {}

  /* ---------- chaos mode (Konami) ---------- */
  function chaos() {
    toast("🎉 CHAOS MODE UNLOCKED");
    burst(["🧡", "🔥", "🎉", "✨", "🤘", "🤌", "🖤", "💥"], 64);
    shake();
  }

  /* ---------- comic sans takeover ---------- */
  let csActive = false;
  function comicSans() {
    if (csActive) return;
    csActive = true;
    document.body.classList.add("comic-sans");
    toast("😱 Comic Sans mode — a designer's worst nightmare", 3500);
    setTimeout(() => {
      document.body.classList.remove("comic-sans");
      toast("😮‍💨 crisis averted. you're safe now.", 2500);
      csActive = false;
    }, 4000);
  }

  /* ---------- make it pop ---------- */
  function makeItPop() {
    burst(["🧡", "✨", "💥", "🔥"], 30);
    toast('🎨 "Can you make it pop?" — say no more', 2600);
  }

  /* ---------- keyboard: Konami + typed words ---------- */
  const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let ki = 0;
  let buf = "";
  window.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;

    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    // Konami
    if (key === seq[ki]) {
      ki++;
      if (ki === seq.length) { ki = 0; chaos(); }
    } else {
      ki = key === seq[0] ? 1 : 0;
    }
    // typed secret words
    if (e.key.length === 1) {
      buf = (buf + e.key.toLowerCase()).slice(-12);
      if (buf.endsWith("comicsans")) comicSans();
      if (buf.endsWith("makeitpop")) makeItPop();
    }
  });

  /* ---------- poke the logo ---------- */
  const logo = document.querySelector(".nav__logo");
  const dot = document.querySelector(".nav__dot");
  if (logo) {
    let count = 0, last = 0;
    const lines = ["👋 hey, that tickles", "again? 🙃", "you really like this logo, huh", "🤹 okay, showoff", "stop poking me 😤"];
    logo.addEventListener("click", () => {
      const now = Date.now();
      if (now - last > 1200) count = 0;
      last = now;
      count++;
      if (dot && !reduce) { dot.classList.remove("flip"); void dot.offsetWidth; dot.classList.add("flip"); }
      if (count >= 2 && count <= 6) toast(lines[Math.min(count - 2, lines.length - 1)], 1700);
      if (count === 7) { burst(["🧡", "✨"], 18); toast("fine, you win 🏆", 2000); count = 0; }
    });
  }

  /* ---------- rage click ---------- */
  let clicks = [];
  window.addEventListener("click", () => {
    const now = Date.now();
    clicks.push(now);
    clicks = clicks.filter((t) => now - t < 1500);
    if (clicks.length >= 9) { clicks = []; toast("😅 whoa there, easy on the clicks"); }
  });

  /* ---------- reached the bottom ---------- */
  let bottomShown = false;
  window.addEventListener(
    "scroll",
    () => {
      if (bottomShown) return;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        bottomShown = true;
        toast("🏁 you scrolled all the way down. legend.", 3000);
      }
    },
    { passive: true }
  );
})();
