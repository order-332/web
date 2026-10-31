"use strict";
// 332 // orbit portal: an eclipse. Every body is dark, lit only by a stippled crescent facing the black sun.
(() => {
  const body = document.body;
  const toggle = (id, cls) => {
    const b = document.getElementById(id);
    b.addEventListener("click", () => b.setAttribute("aria-pressed", String(body.classList.toggle(cls))));
  };
  toggle("pause", "paused");
  toggle("power", "off");

  // "last updated" from the document's own timestamp
  const upd = document.getElementById("upd");
  const d = new Date(document.lastModified);
  if (!isNaN(d)) {
    const p = n => String(n).padStart(2, "0");
    upd.textContent = `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  const INK = { green: [181, 255, 65], bone: [223, 232, 207] };
  const rng = s => () => (s = s * 16807 % 2147483647) / 2147483647;
  const RINGS = [.5, .68, .85, .98];
  const TILT = .74;
  const TAU = Math.PI * 2;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phone = matchMedia("(max-width: 760px)");

  // a wrapping surface map: rock, bands or craters
  function surface(kind, seed) {
    const W = 128, H = 64, r = rng(seed), grid = Array.from({ length: 4 }, (_, o) => {
      const n = 4 << o, g = new Float32Array(n * n);
      for (let i = 0; i < n * n; i++) g[i] = r();
      return { n, g };
    });
    const fbm = (u, v) => {
      let out = 0, amp = .5;
      for (const { n, g } of grid) {
        const x = u * n, y = v * n, x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
        const at = (a, b) => g[(b % n) * n + (a % n)];
        out += amp * ((at(x0, y0) * (1 - sx) + at(x0 + 1, y0) * sx) * (1 - sy) + (at(x0, y0 + 1) * (1 - sx) + at(x0 + 1, y0 + 1) * sx) * sy);
        amp /= 2;
      }
      return out;
    };
    const map = new Float32Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H, n = fbm(u, v);
      map[y * W + x] = kind === "band" ? .5 + .5 * Math.sin(v * 22 + n * 7) : Math.pow(n * 1.25, 2.2);
    }
    if (kind === "crater") for (let c = 0; c < 26; c++) {
      const cx = r() * W, cy = r() * H, rad = 2 + r() * 8;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const dx = Math.min(Math.abs(x - cx), W - Math.abs(x - cx)), dd = Math.hypot(dx * .6, y - cy) / rad;
        if (dd < 1) map[y * W + x] *= .12; else if (dd < 1.25) map[y * W + x] = Math.min(1, map[y * W + x] + .4);
      }
    }
    return { map, W, H };
  }

  const links = [...document.querySelectorAll(".pl")];
  const bodies = links.map((el, i) => {
    const { ring, at, size, tex, ink } = el.dataset, cv = el.querySelector("canvas"), px = Number(size), r = rng(97 * (i + 3)), grain = Float32Array.from({ length: px * px }, () => r());
    cv.width = cv.height = px;
    cv.style.width = cv.style.height = size + "px";
    el.style.setProperty("--r", size / 2 + "px");
    const ctx = cv.getContext("2d");
    return { el, cv, ctx, img: ctx.createImageData(px, px), px, size: Number(size), ring: Number(ring), at: Number(at) * Math.PI / 180, ink: INK[ink || "green"], grain, a: Number(at) * Math.PI / 180, surf: surface(tex, 332 * (i + 3)), spin: i / 10, speed: .012 + (i % 4) * .004, lbl: el.querySelector(".lbl") };
  });

  // light always comes from the sun's edge, so each crescent turns as its body orbits
  function drawBody(b) {
    const { px, img, surf, ink, grain } = b, c = (px - 1) / 2, k = 2 / px, data = img.data;
    const gain = 1.25 + Math.max(0, 44 - px) / 44 * 1.1, rim = 1 - 3 / px, RIM = ink.map(v => v * .3 | 0);
    const lx0 = -Math.cos(b.a), ly0 = -Math.sin(b.a) * TILT, m = Math.hypot(lx0, ly0, .22) || 1, lx = lx0 / m, ly = ly0 / m, lz = .22 / m;
    for (let y = 0; y < px; y++) for (let x = 0; x < px; x++) {
      const i = (y * px + x) * 4, nx = (x - c) * k, ny = (y - c) * k, rr = nx * nx + ny * ny;
      let col = null;
      if (rr <= 1) {
        const nz = Math.sqrt(1 - rr), lit = Math.max(0, nx * lx + ny * ly + nz * lz);
        const u = (Math.atan2(nx, nz) / TAU + b.spin + 1) % 1, v = Math.asin(ny) / Math.PI + .5;
        if (Math.pow(lit, 1.6) * (.72 + .55 * surf.map[(v * (surf.H - 1) | 0) * surf.W + (u * surf.W | 0)]) * gain > grain[y * px + x]) col = ink;
        else if (Math.sqrt(rr) > rim) col = RIM;
      }
      data[i] = col ? col[0] : 2; data[i + 1] = col ? col[1] : 5; data[i + 2] = col ? col[2] : 3; data[i + 3] = rr <= 1 ? 255 : 0;
    }
    b.ctx.putImageData(img, 0, 0);
  }

  const portal = document.getElementById("portal");
  const sky = document.getElementById("sky");
  const ringsEl = document.getElementById("rings");
  const NS = "http://www.w3.org/2000/svg";
  const ellipses = RINGS.map(() => ringsEl.appendChild(document.createElementNS(NS, "ellipse")));
  let W = 0, H = 0, cx = 0, cy = 0, R = 0;

  const logo = new Image();
  logo.src = "../shared/logo-1bit.png";
  logo.addEventListener("load", () => { if (!phone.matches) paintSky(); });

  // the sky holds still: stars, then the corona burning off the black sun
  const SUN = .3;
  function paintSky() {
    const r = rng(332), ctx = sky.getContext("2d"), rad = R * SUN, flare = -.72;
    sky.width = W; sky.height = H;
    ctx.fillStyle = "#020503";
    ctx.fillRect(0, 0, W, H);
    for (let i = 0, n = W * H / 3400; i < n; i++) {
      ctx.fillStyle = r() < .18 ? "#a7b59a" : "#3a4a3c";
      ctx.fillRect(r() * W | 0, r() * H | 0, 1, 1);
    }
    // long slow lobes, so the corona is uneven like a real one
    const lobes = Array.from({ length: 5 }, () => [1 + (r() * 5 | 0), r() * TAU, .4 + r() * .6]);
    const reach = t => lobes.reduce((s, [f, p, w]) => s + Math.max(0, Math.sin(t * f + p)) * w, .25) / 2.2;
    ctx.lineWidth = 1;
    for (let i = 0; i < 2600; i++) {
      const t = r() * TAU, near = Math.abs(Math.atan2(Math.sin(t - flare), Math.cos(t - flare)));
      const hot = Math.exp(-near * near * 28);
      const len = rad * (.04 + Math.pow(r(), 3.2) * (.35 + reach(t) * 1.1 + hot * .8));
      const x0 = cx + Math.cos(t) * rad, y0 = cy + Math.sin(t) * rad, ux = Math.cos(t), uy = Math.sin(t);
      [[0, .3, "226,234,210", .55], [.3, .65, "181,255,65", .3], [.65, 1, "63,154,34", .16]].forEach(([s, e, col, al]) => {
        ctx.strokeStyle = `rgba(${col},${al + hot * .3})`;
        ctx.beginPath();
        ctx.moveTo(x0 + ux * len * s, y0 + uy * len * s);
        ctx.lineTo(x0 + ux * len * e, y0 + uy * len * e);
        ctx.stroke();
      });
    }
    // the disc, its hot edge, and one bead where the light breaks through
    ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#eef5de"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, TAU); ctx.stroke();
    const bx = cx + Math.cos(flare) * rad, by = cy + Math.sin(flare) * rad, glow = ctx.createRadialGradient(bx, by, 0, bx, by, rad * .34);
    glow.addColorStop(0, "rgba(255,255,240,.95)"); glow.addColorStop(.12, "rgba(214,255,140,.5)"); glow.addColorStop(1, "rgba(181,255,65,0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(bx, by, rad * .34, 0, TAU); ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.arc(cx, cy, rad - 1.5, 0, TAU); ctx.fill();
    // the logo inside the disc: the same 1-bit image as the ff7 box, in the page's bone
    if (logo.naturalWidth) {
      const inner = rad - 2, side = inner * 1.9;
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, inner, 0, TAU); ctx.clip();
      const n = logo.naturalWidth, off = document.createElement("canvas");
      off.width = off.height = n;
      const o = off.getContext("2d", { willReadFrequently: true });
      o.drawImage(logo, 0, 0);
      const img = o.getImageData(0, 0, n, n), d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const on = d[i + 1] > 128;
        d[i] = INK.bone[0]; d[i + 1] = INK.bone[1]; d[i + 2] = INK.bone[2];
        d[i + 3] = on ? 255 : 0;
      }
      o.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, Math.round(cx - side / 2), Math.round(cy - side / 2), Math.round(side), Math.round(side));
      const shade = ctx.createRadialGradient(cx, cy, inner * .62, cx, cy, inner);
      shade.addColorStop(0, "rgba(0,0,0,0)"); shade.addColorStop(1, "rgba(0,0,0,.9)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - inner, cy - inner, inner * 2, inner * 2);
      ctx.restore();
    }
  }

  function layout() {
    W = portal.clientWidth; H = portal.clientHeight;
    cx = W / 2; cy = H / 2 - 6;
    R = Math.min(W / 2 - 44, (H / 2 - 38) / TILT);
    ringsEl.setAttribute("viewBox", `0 0 ${W} ${H}`);
    ellipses.forEach((e, i) => {
      e.setAttribute("cx", cx); e.setAttribute("cy", cy);
      e.setAttribute("rx", RINGS[i] * R); e.setAttribute("ry", RINGS[i] * R * TILT);
    });
    if (!phone.matches) paintSky();
    place();
  }

  let phase = 0, speed = 1;
  function place() {
    if (phone.matches) {
      for (const b of bodies) { b.lbl.style.left = b.lbl.style.top = b.lbl.style.right = ""; b.el.style.zIndex = ""; }
      return;
    }
    for (const b of bodies) {
      const a = b.at + (b.ring === 3 ? -phase * .6 : phase), rr = RINGS[b.ring] * R;
      b.a = a;
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * TILT, front = Math.sin(a);
      b.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      b.el.style.zIndex = String(100 + Math.round(front * 50));
      const s = .88 + .12 * (front + 1) / 2;
      b.cv.style.transform = `translate(-50%,-50%) scale(${s.toFixed(3)})`;
      const off = b.size / 2 * s + 6, flip = x < cx ? x - off - 90 > 0 : x + off + 90 > W;
      b.lbl.style.top = "-9px";
      b.lbl.style.left = flip ? "auto" : off + "px";
      b.lbl.style.right = flip ? off + "px" : "auto";
    }
  }

  // touching a body lights its ring, slows the sky and locks the readout
  const lock = document.getElementById("lock");
  let held = 0;
  links.forEach((el, i) => {
    const b = bodies[i], name = b.lbl.textContent;
    const on = () => {
      held++;
      ellipses[b.ring].classList.add("on");
      lock.classList.add("on");
      lock.textContent = `lock // ${name} // ring ${b.ring + 1} // 0x${(0x14c * (i + 1)).toString(16)}`;
    };
    const off = () => {
      held = Math.max(0, held - 1);
      ellipses[b.ring].classList.remove("on");
      if (!held) { lock.classList.remove("on"); lock.textContent = "no lock"; }
    };
    el.addEventListener("pointerenter", on); el.addEventListener("pointerleave", off);
    el.addEventListener("focus", on); el.addEventListener("blur", off);
  });

  document.getElementById("hex").textContent = Array.from({ length: 70 }, (_, i) => (0x14c000 + i * 8).toString(16).padStart(6, "0") + " " + ((i * 2654435761) >>> 24).toString(16).padStart(2, "0")).join("\n");

  bodies.forEach(drawBody);
  layout();
  addEventListener("resize", layout);
  if (document.fonts) document.fonts.ready.then(place);
  if (still) return;

  let last = performance.now(), tick = 0, next = 0;
  const frame = now => {
    requestAnimationFrame(frame);
    const dt = Math.min(.1, (now - last) / 1000);
    last = now;
    if (body.classList.contains("paused") || body.classList.contains("off") || document.hidden) return;
    speed += ((held ? 0 : 1) - speed) * Math.min(1, dt * 6);
    phase += dt * .017 * speed;
    if (!phone.matches) place();
    if (now > next) {
      next = now + 90;
      const b = bodies[tick++ % bodies.length];
      b.spin = (b.spin + b.speed * speed) % 1;
      drawBody(b);
    }
  };
  requestAnimationFrame(frame);
})();
