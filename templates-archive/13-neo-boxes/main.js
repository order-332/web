(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);

  /* rain: a few dozen short diagonal streaks, ~30fps, paused when hidden */
  const cv = $("rain");
  const ctx = cv.getContext("2d");
  let drops = [], w = 0, h = 0, raf = 0, last = 0, rainOff = reduce;
  function size() {
    const d = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    cv.width = w * d; cv.height = h * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    const n = Math.round(Math.min(90, w * h / 16000));
    drops = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, v: 7 + Math.random() * 6, l: 8 + Math.random() * 12 }));
  }
  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (t - last < 33) return;
    last = t;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(110,150,200,.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const p of drops) {
      p.y += p.v; p.x -= p.v * 0.18;
      if (p.y > h) { p.y = -p.l; p.x = Math.random() * (w + 60); }
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.l * 0.18, p.y - p.l);
    }
    ctx.stroke();
  }
  function start() { if (!raf && !rainOff && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  size();
  addEventListener("resize", size);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  start();

  const optRain = $("opt-rain");
  optRain.checked = rainOff;
  optRain.addEventListener("change", () => {
    rainOff = optRain.checked;
    if (rainOff) { stop(); ctx.clearRect(0, 0, w, h); } else start();
  });
  $("opt-fx").addEventListener("change", (e) => document.body.classList.toggle("no-fx", e.target.checked));
  $("opt-hotel").addEventListener("change", (e) => document.body.classList.toggle("no-hotel", e.target.checked));

  /* moon phase (synodic month from a known new moon) */
  const syn = 29.530588853;
  const age = (((Date.now() / 864e5 - 10962.7597) % syn) + syn) % syn; // ref new moon 2000-01-06 18:14 UTC
  const f = age / syn;
  const names = ["New", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full", "Waning Gibbous", "Last Quarter", "Waning Crescent"];
  $("phase").textContent = names[Math.round(f * 8) % 8];
  const illum = (1 - Math.cos(2 * Math.PI * f)) / 2;
  $("illum").textContent = Math.round(illum * 100) + "%";
  const shade = $("moonshade");
  // slide a dark disc across: waxing = shadow leaves to the left
  const off = f < 0.5 ? -f * 2 * 100 : (1 - f) * 2 * 100;
  shade.style.transform = "translateX(" + off.toFixed(1) + "%)";
  shade.style.opacity = illum > 0.97 ? "0" : ".85";

  /* clock */
  const clock = $("clock");
  const pad = (n) => String(n).padStart(2, "0");
  function tick(force) {
    if (document.hidden && force !== true) return;
    const d = new Date();
    clock.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  tick(true);
  setInterval(tick, 1000);
})();
