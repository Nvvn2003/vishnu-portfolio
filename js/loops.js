/* Silent looping previews — play only while on screen, so a film never
   downloads or decodes for a visitor who scrolls past.
   Kept in a file (not inline) so the Content Security Policy can forbid
   inline scripts entirely. */
(function () {
  var vids = document.querySelectorAll(".q-loop");
  if (!vids.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  vids.forEach(function (v) { v.muted = true; v.defaultMuted = true; v.volume = 0; });
  if (reduce) return;

  if (!("IntersectionObserver" in window)) {
    vids.forEach(function (v) { v.play().catch(function () {}); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { v.play().catch(function () {}); }
      else if (!v.paused) { v.pause(); }
    });
  }, { threshold: 0.25 });
  vids.forEach(function (v) { io.observe(v); });
})();
