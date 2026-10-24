"use strict";
const root = document.querySelector(".wb");
const show = { threads: true, pulse: true };
document.querySelectorAll(".pills button").forEach(b => b.addEventListener("click", () => {
  const on = b.getAttribute("aria-pressed") !== "true";
  b.setAttribute("aria-pressed", String(on));
  root.classList.toggle("no-" + b.dataset.k, !on);
  show[b.dataset.k] = on; dirty = true; wake();
}));

// the original svg stays the source of truth. its backdrop (stars, rings, ticks) stays flat and still;
// the web itself (threads, ring, trace) is lifted into a 3D ball on canvas that you can turn.
const src = document.querySelector(".web");
const VB = src.getAttribute("viewBox").split(" ").map(Number), CX = 500, CY = 500;
const COL = { g0: "176,38,255", g1: "124,77,255", g2: "255,43,214", g3: "92,107,255", g4: "198,168,255", g5: "209,107,255" };
const colOf = el => COL[[...el.classList].find(c => COL[c])] || COL.g1;

let seed = 332;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
// lite: phones and small machines get less yarn and a 1x canvas; slow draws switch it on at runtime too
let LITE = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4 || matchMedia("(pointer: coarse)").matches;

const ring = [...src.querySelectorAll(".ringd circle")].map(c => ({ x: +c.getAttribute("cx") - CX, y: +c.getAttribute("cy") - CY, r: +c.getAttribute("r"), rgb: colOf(c) }));
const RB = ring.reduce((s, n) => s + Math.hypot(n.x, n.y), 0) / ring.length; // radius of the ball

// every string is an arc lying on the ball's surface: it leaves its ring node, rises over the front or the
// back of the ball, and lands on the other node. all arcs sit on one sphere, so from any angle it's round.
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const onBall = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l * RB, y / l * RB, 0]; };
const SS = 24;
// how round it is: RISE caps how far a string climbs off the ring (radians), DEPTH squashes front to back
const RISE = 1.5, DEPTH = 1, FUZZ = 0.03;
const arc = (A, B, tilt, lift = 0, fuzz = FUZZ) => {
  const p1 = rnd() * 6.3, p2 = rnd() * 6.3, f1 = 2 + rnd() * 3, f2 = 6 + rnd() * 6;
  // a point over the chord, tipped toward the viewer (+) or away (-), then the circle through A, P, B
  let m = unit([A[0] + B[0], A[1] + B[1], 0]);
  if (Math.hypot(A[0] + B[0], A[1] + B[1]) < 1e-3) m = unit([-A[1], A[0], 0]);
  const P = [m[0] * Math.cos(tilt) * RB, m[1] * Math.cos(tilt) * RB, Math.sin(tilt) * RB];
  const a = sub(A, P), b = sub(B, P), axb = crs(a, b), d = 2 * dot3(axb, axb) || 1;
  const t = crs([dot3(a, a) * b[0] - dot3(b, b) * a[0], dot3(a, a) * b[1] - dot3(b, b) * a[1], dot3(a, a) * b[2] - dot3(b, b) * a[2]], axb);
  const O = [P[0] + t[0] / d, P[1] + t[1] / d, P[2] + t[2] / d], r = Math.hypot(...sub(A, O));
  const u = unit(sub(A, O)), pv = sub(P, O), w = unit(sub(pv, u.map(x => x * dot3(pv, u))));
  const ang = v => { let q = Math.atan2(dot3(v, w), dot3(v, u)); return q < 0 ? q + 2 * Math.PI : q; };
  const tb = ang(sub(B, O)), tp = ang(pv), end = tp < tb ? tb : tb - 2 * Math.PI;
  const pts = new Float32Array((SS + 1) * 3);
  for (let s = 0; s <= SS; s++) {
    const e = Math.sin(Math.PI * s / SS); // wobble fades out at the nodes
    const th = end * s / SS, k = 1 + lift * e + fuzz * e * (0.6 * Math.sin(f1 * s / SS * 6.3 + p1) + 0.4 * Math.sin(f2 * s / SS * 6.3 + p2));
    for (let i = 0; i < 3; i++) pts[s * 3 + i] = (O[i] + r * (u[i] * Math.cos(th) + w[i] * Math.sin(th))) * k * (i === 2 ? DEPTH : 1);
  }
  return pts;
};
const ends = d => { const n = d.match(/-?\d+(\.\d+)?/g).map(Number); return [onBall(n[0] - CX, n[1] - CY), onBall(n[n.length - 2] - CX, n[n.length - 1] - CY)]; };
const tilt = () => (rnd() < 0.5 ? -1 : 1) * (0.25 + rnd() * (RISE - 0.25));

const strands = [];
src.querySelectorAll(".threads .t").forEach(p => {
  const [A, B] = ends(p.getAttribute("d"));
  strands.push({ pts: arc(A, B, tilt()), rgb: colOf(p), w: 0.75, a: 0.4 });
});
src.querySelectorAll(".bundles .b").forEach(p => {
  const [A, B] = ends(p.getAttribute("d"));
  strands.push({ pts: arc(A, B, tilt()), rgb: COL.g2, w: 1.6, a: 0.45 });
});
// yarn: loose fibres wound round the ball at random angles, drifting as they go, plus short fuzz
const FIB = [];
for (let n = 0, N = LITE ? 110 : 240; n < N; n++) {
  const ax = unit([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]), u = unit(crs(ax, Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])), v = crs(ax, u);
  const a0 = rnd() * 6.3, span = 1.2 + rnd() * 4.5, m = Math.ceil(span * 9), pts = new Float32Array((m + 1) * 3);
  const dr = 0.06 + rnd() * 0.12, df = 1 + rnd() * 3, ph = rnd() * 6.3, rr = 0.965 + rnd() * 0.06;
  for (let s = 0; s <= m; s++) {
    const t = a0 + span * s / m, c = Math.cos(t), sn = Math.sin(t), drift = Math.sin(t * df + ph) * dr;
    const p = unit([u[0] * c + v[0] * sn + ax[0] * drift, u[1] * c + v[1] * sn + ax[1] * drift, u[2] * c + v[2] * sn + ax[2] * drift]);
    const r = RB * rr * (1 + 0.012 * Math.sin(s * 1.7 + ph));
    pts[s * 3] = p[0] * r; pts[s * 3 + 1] = p[1] * r; pts[s * 3 + 2] = p[2] * r;
  }
  FIB.push({ pts, rgb: [COL.g0, COL.g1, COL.g2, COL.g3, COL.g4, COL.g5][n % 6], a: 0.1 + rnd() * 0.14 });
}
const NH = LITE ? 300 : 900, HAIRS = new Float32Array(NH * 6);
for (let n = 0; n < NH; n++) {
  const p = unit([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]), t = unit(crs(p, unit([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5])));
  const l = RB * (0.012 + rnd() * 0.03), out = RB * (0.004 + rnd() * 0.03), r0 = RB * (0.985 + rnd() * 0.02);
  HAIRS.set([p[0] * r0, p[1] * r0, p[2] * r0, p[0] * (r0 + out) + t[0] * l, p[1] * (r0 + out) + t[1] * l, p[2] * (r0 + out) + t[2] * l], n * 6);
}
const hopEls = [...src.querySelectorAll(".hop"), src.querySelector(".dst .core")];
const hops = hopEls.map(c => onBall(+c.getAttribute("cx") - CX, +c.getAttribute("cy") - CY));
const route = new Float32Array((hops.length - 1) * SS * 3 + 3);
for (let h = 0; h < hops.length - 1; h++) {
  const seg = arc(hops[h], hops[h + 1], h % 2 ? -0.9 : 0.9, 0.04, 0);
  route.set(h ? seg.subarray(3) : seg, h ? h * SS * 3 + 3 : 0);
}
src.querySelectorAll(".threads,.bundles,.ringd,.route,.hop,.dst,.train").forEach(el => el.remove());

// backdrop: everything left in the svg, in one group that only turns when the ball is spun sideways
const NS = "http://www.w3.org/2000/svg";
const back = document.createElementNS(NS, "g");
back.append(...[...src.children].filter(el => el.tagName !== "defs"));
src.appendChild(back);
src.setAttribute("aria-hidden", "true");

const mk = cls => { const c = document.createElement("canvas"); c.className = cls; src.after(c); return c; };
const fx = mk("fx"), cv = mk("net");
cv.setAttribute("role", "img");
cv.setAttribute("aria-label", "a ball of threads strung between a ring of nodes; one bright traceroute ends at 332. drag to turn it, hover a hop to read it");
const g = cv.getContext("2d"), f = fx.getContext("2d");

const tip = document.createElement("div");
tip.className = "tip"; tip.hidden = true;
// the destination opens a card with a way out to the ctf; set the address in index.html (data-ctf)
const CTF = root.dataset.ctf || "";
const meta = document.createElement("span"), about = document.createElement("p"), go = document.createElement("a");
about.className = "about"; about.textContent = "crew · handle · zine · project";
go.className = "go"; go.textContent = "enter the ctf →"; go.target = "_blank"; go.rel = "noopener";
if (CTF) go.href = CTF; else { go.setAttribute("aria-disabled", "true"); go.textContent = "ctf · link soon"; }
tip.append(Object.assign(document.createElement("b"), { textContent: "332" }), meta, about, go);
root.appendChild(tip);

// view: free trackball rotation with a little inertia; it never spins on its own
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
let M = [1, 0, 0, 0, 1, 0, 0, 0, 1], vx = 0, vy = 0, spin = 0, zoom = 1, drag = null, dirty = true;
let W = 0, H = 0, dpr = 1, sw = 0, sc = 1, P = 1;
const rotate = (ax, ay) => {
  const ca = Math.cos(ax), sa = Math.sin(ax), cb = Math.cos(ay), sb = Math.sin(ay);
  const R = [cb, 0, sb, -sa * sb, ca, sa * cb, -ca * sb, -sa, ca * cb]; // about screen Y by ay, then screen X by ax
  const o = new Array(9);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r * 3 + c] = R[r * 3] * M[c] + R[r * 3 + 1] * M[3 + c] + R[r * 3 + 2] * M[6 + c];
  M = o;
  spin += ay * 57.3 * 0.4; // the backdrop answers sideways turns only
  dirty = true;
};
const size = () => {
  dpr = Math.min(LITE ? 1 : 1.5, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
  for (const c of [cv, fx]) { c.width = W * dpr; c.height = H * dpr; }
  apply();
};
const apply = () => {
  const base = W >= H ? Math.max(1.58 * H, W) : 1.36 * W; // big like the original: the ring runs off the short edge
  sw = base * zoom; sc = sw / VB[2]; P = sw * 1.8;
  src.style.width = sw + "px";
  back.setAttribute("transform", "rotate(" + spin.toFixed(2) + " " + CX + " " + CY + ")");
  dirty = true;
};
const proj = (x, y, z, out, o) => {
  const X = M[0] * x + M[1] * y + M[2] * z, Y = M[3] * x + M[4] * y + M[5] * z, Z = M[6] * x + M[7] * y + M[8] * z;
  const k = P / (P - Z * sc);
  out[o] = W / 2 + X * sc * k; out[o + 1] = H / 2 + Y * sc * k; out[o + 2] = Z / RB;
};
strands.forEach(s => { s.scr = new Float32Array(s.pts.length); });
FIB.forEach(f => { f.scr = new Float32Array(f.pts.length); });
const hairScr = new Float32Array(HAIRS.length);
const routeScr = new Float32Array(route.length), ringScr = new Float32Array(ring.length * 3), hopScr = new Float32Array(hops.length * 3);
const projectAll = () => {
  for (const s of strands.concat(FIB)) for (let o = 0; o < s.pts.length; o += 3) proj(s.pts[o], s.pts[o + 1], s.pts[o + 2], s.scr, o);
  for (let o = 0; o < HAIRS.length; o += 3) proj(HAIRS[o], HAIRS[o + 1], HAIRS[o + 2], hairScr, o);
  for (let o = 0; o < route.length; o += 3) proj(route[o], route[o + 1], route[o + 2], routeScr, o);
  ring.forEach((n, k) => proj(n.x, n.y, 0, ringScr, k * 3));
  hops.forEach((h, k) => proj(h[0], h[1], h[2], hopScr, k * 3));
};

let hop = -1, heat = null; // heat: pointer position for the hover heatmap
const placeTip = () => {
  if (hop < 0) return;
  const x = hopScr[hop * 3], y = Math.max(70, Math.min(H - 70, hopScr[hop * 3 + 1]));
  tip.classList.toggle("left", x > W - 260);
  tip.style.left = x + "px"; tip.style.top = y + "px";
};

const path = (c, a) => { c.beginPath(); c.moveTo(a[0], a[1]); for (let o = 3; o < a.length; o += 3) c.lineTo(a[o], a[o + 1]); };
const draw = () => {
  projectAll();
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  g.lineCap = "round"; g.lineJoin = "round";
  const lw = Math.max(0.6, sc);
  const moving = !!drag || !!vx || !!vy; // while turning, skip the fine yarn; it comes back when you let go
  if (show.threads && !moving) {
    // fibres batched by colour and facing, behind the strings
    for (const face of [0, 1]) for (const rgb of new Set(FIB.map(f => f.rgb))) {
      g.beginPath();
      let a = 0, n = 0;
      for (const f of FIB) {
        if (f.rgb !== rgb) continue;
        const z = f.scr[(f.scr.length / 6 | 0) * 3 + 2];
        if ((z > 0) !== !!face) continue;
        const q = f.scr; g.moveTo(q[0], q[1]); for (let o = 3; o < q.length; o += 3) g.lineTo(q[o], q[o + 1]);
        a += f.a; n++;
      }
      if (!n) continue;
      g.strokeStyle = "rgba(" + rgb + "," + ((a / n) * (face ? 1.25 : 0.5)).toFixed(3) + ")"; g.lineWidth = 0.6 * lw; g.stroke();
    }
    // fuzz: short hairs, front side only
    g.beginPath();
    for (let o = 0; o < hairScr.length; o += 6) { if (hairScr[o + 2] < 0) continue; g.moveTo(hairScr[o], hairScr[o + 1]); g.lineTo(hairScr[o + 3], hairScr[o + 4]); }
    g.strokeStyle = "rgba(198,168,255,.22)"; g.lineWidth = 0.5 * lw; g.stroke();
  }
  if (show.threads) {
    for (const s of strands) {
      const zm = s.scr[(s.scr.length / 6 | 0) * 3 + 2]; // depth at the middle of the arc
      path(g, s.scr);
      g.strokeStyle = "rgba(" + s.rgb + "," + (s.a * (0.6 + 0.4 * zm)).toFixed(3) + ")"; g.lineWidth = s.w * lw; g.stroke();
    }
    // heatmap: only the bits of string near the pointer warm up, purple -> pink -> white-hot
    if (heat) {
      const [px, py] = heat, RH = 170 * Math.max(0.8, sc);
      const bins = [[], [], [], [], []];
      for (const s of strands.concat(FIB)) {
        const a = s.scr;
        for (let o = 0; o + 3 < a.length; o += 3) {
          const mx = (a[o] + a[o + 3]) / 2 - px, my = (a[o + 1] + a[o + 4]) / 2 - py, d = Math.sqrt(mx * mx + my * my);
          if (d < RH) bins[Math.min(4, (1 - d / RH) * 5 | 0)].push(o, a);
        }
      }
      const RAMP = ["124,77,255,.35", "176,38,255,.55", "255,43,214,.7", "255,120,230,.85", "255,235,255,1"];
      bins.forEach((b, i) => {
        if (!b.length) return;
        g.beginPath();
        for (let j = 0; j < b.length; j += 2) { const o = b[j], a = b[j + 1]; g.moveTo(a[o], a[o + 1]); g.lineTo(a[o + 3], a[o + 4]); }
        g.strokeStyle = "rgba(" + RAMP[i] + ")"; g.lineWidth = (0.9 + i * 0.35) * lw; g.stroke();
      });
    }
  }
  ring.forEach((n, k) => {
    g.fillStyle = "rgba(" + n.rgb + "," + (0.55 + 0.45 * ringScr[k * 3 + 2]).toFixed(3) + ")";
    g.beginPath(); g.arc(ringScr[k * 3], ringScr[k * 3 + 1], n.r * sc, 0, 7); g.fill();
  });
  // the trace as a glowing thread: soft falloff, then two thin plies twisted round each other
  const R2 = routeScr, n2 = R2.length / 3;
  g.globalCompositeOperation = "lighter";
  path(g, R2);
  g.strokeStyle = "rgba(255,43,214,.06)"; g.lineWidth = 22 * sc; g.stroke();
  g.strokeStyle = "rgba(255,43,214,.1)"; g.lineWidth = 11 * sc; g.stroke();
  g.strokeStyle = "rgba(255,90,220,.22)"; g.lineWidth = 5 * sc; g.stroke();
  const ply = (side, rgb, w) => {
    // short runs so the brightness can flicker along the thread
    for (let i0 = 0; i0 < n2 - 1; i0 += 6) {
      g.beginPath();
      for (let i = i0; i <= Math.min(n2 - 1, i0 + 6); i++) {
        const o = i * 3, p = Math.max(0, o - 3), q = Math.min(R2.length - 3, o + 3);
        const dx = R2[q] - R2[p], dy = R2[q + 1] - R2[p + 1], l = Math.hypot(dx, dy) || 1;
        const off = Math.sin(i * 0.9) * side * 1.5 * sc;
        const x = R2[o] - dy / l * off, y = R2[o + 1] + dx / l * off;
        i === i0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      const back = R2[i0 * 3 + 2] < -0.1, f = 0.7 + 0.3 * Math.sin(i0 * 0.37 + side);
      g.strokeStyle = "rgba(" + rgb + "," + ((back ? 0.3 : 0.9) * f).toFixed(3) + ")"; g.lineWidth = w * sc; g.stroke();
    }
  };
  ply(1, "255,214,245", 1.2); ply(-1, "255,150,230", 1.1);
  g.globalCompositeOperation = "source-over";
  g.font = "10px Departure, monospace"; g.textBaseline = "middle";
  hops.forEach((h, k) => {
    const x = hopScr[k * 3], y = hopScr[k * 3 + 1], dst = k === hops.length - 1, sel = k === hop;
    // small hop number beside each point
    g.fillStyle = hopScr[k * 3 + 2] < -0.1 ? "rgba(198,168,255,.25)" : sel ? "#ff2bd6" : "rgba(198,168,255,.8)";
    g.fillText(dst ? "332" : String(k + 1).padStart(2, "0"), x + 12 * sc + 6, y - 10 * sc - 4);
    g.lineWidth = 3 * sc;
    g.fillStyle = dst ? "#ff2bd6" : "#fff"; g.strokeStyle = dst ? "#fff" : sel ? "#ff2bd6" : "#7c4dff";
    g.beginPath(); g.arc(x, y, (dst ? 10 : 6) * sc * (sel ? 1.4 : 1), 0, 7); g.fill(); g.stroke();
    if (sel) {
      const b = 18 * sc + 6, l = 7;
      g.strokeStyle = "#ff2bd6"; g.lineWidth = 1.2; g.beginPath();
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.moveTo(x + sx * b, y + sy * (b - l)); g.lineTo(x + sx * b, y + sy * b); g.lineTo(x + sx * (b - l), y + sy * b); }
      g.stroke();
    }
  });
  placeTip();
  dirty = false;
};

// hover: a hop shows its tag; anywhere else the strings just warm up under the pointer
const MS = [1, 9, 18, 24, 41, 57, 63, 76];
const hex = n => "0x" + ((n + 7) * 2654435761 >>> 0).toString(16).slice(0, 4).toUpperCase();
const overTip = (px, py) => {
  if (tip.hidden || !tip.classList.contains("card") || px === undefined) return false;
  const r = tip.getBoundingClientRect();
  return px > r.left - 30 && px < r.right + 8 && py > r.top - 8 && py < r.bottom + 8; // includes the gap back to the point
};
const pick = (px, py) => {
  if (overTip(px, py)) return; // keep the card open while you reach for the link
  let nh = -1, best = 20;
  if (px !== undefined) hops.forEach((h, k) => { const d = Math.hypot(hopScr[k * 3] - px, hopScr[k * 3 + 1] - py); if (d < best && hopScr[k * 3 + 2] > -0.2) { best = d; nh = k; } });
  heat = px !== undefined && show.threads ? [px, py] : null;
  dirty = true;
  setHop(nh);
};
const setHop = nh => {
  if (nh === hop) return;
  hop = nh;
  logLines.forEach((li, k) => li.classList.toggle("on", k === hop));
  root.classList.toggle("over", hop >= 0);
  tip.hidden = hop < 0;
  if (hop >= 0) {
    const dst = hop === hops.length - 1;
    tip.classList.toggle("card", dst);
    meta.textContent = [
      dst ? "dest · reached" : "hop " + String(hop + 1).padStart(2, "0") + " / 08",
      "rtt " + MS[hop] + "ms · ttl " + (64 - hop),
      ip(hop) + " · " + hex(hop)
    ].join("\n");
    placeTip();
  }
  dirty = true; wake();
};
const ip = k => k === hops.length - 1 ? "0.0.1.76" : "10.33.2." + (k * 37 % 250);

// the trace log: types itself out once, and each line points at its hop on the ball
const log = document.getElementById("log"), logLines = [];
if (log) {
  const head = document.createElement("p");
  head.className = "lh"; log.before(head);
  hops.forEach((h, k) => {
    const li = document.createElement("li"), dst = k === hops.length - 1;
    li.dataset.t = String(k + 1).padStart(2, "0") + "  " + ip(k).padEnd(11) + String(MS[k]).padStart(3) + " ms" + (dst ? "  332" : "");
    li.addEventListener("pointerenter", () => setHop(k));
    li.addEventListener("pointerleave", () => { if (!tip.classList.contains("card")) setHop(-1); });
    li.addEventListener("click", () => setHop(k));
    log.appendChild(li); logLines.push(li);
  });
  const type = (el, txt, done) => {
    if (still) { el.textContent = txt; done(); return; }
    let i = 0;
    document.querySelectorAll(".cur").forEach(c => c.classList.remove("cur"));
    el.classList.add("cur");
    const step = () => { el.textContent = txt.slice(0, ++i); i < txt.length ? setTimeout(step, 14) : setTimeout(done, 120); };
    step();
  };
  let k = -1;
  const next = () => { k++; if (k < logLines.length) type(logLines[k], logLines[k].dataset.t, next); else log.classList.add("done"); };
  type(head, "traceroute to 332 (0.0.1.76), 8 hops max", next);
}

const touches = new Map();
let pinch = 0;
const K = 0.0055;
root.addEventListener("pointerdown", e => {
  if (e.target.closest(".pills, .tip, .log")) return;
  touches.set(e.pointerId, [e.clientX, e.clientY]);
  if (touches.size === 2) { const [a, b] = [...touches.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); drag = null; return; }
  drag = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
  root.setPointerCapture(e.pointerId); root.classList.add("grab"); vx = vy = 0;
});
root.addEventListener("pointermove", e => {
  if (touches.has(e.pointerId)) touches.set(e.pointerId, [e.clientX, e.clientY]);
  if (touches.size === 2 && pinch) {
    const [a, b] = [...touches.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    zoom = Math.max(0.35, Math.min(1.8, zoom * d / pinch)); pinch = d; apply(); wake(); return;
  }
  if (!drag) { pick(e.clientX, e.clientY); wake(); return; }
  const now = performance.now(), dx = e.clientX - drag.x, dy = e.clientY - drag.y, k = K / zoom;
  rotate(dy * k, dx * k);
  const dt = Math.max(8, now - drag.t), cap = v => Math.max(-0.004, Math.min(0.004, v));
  vx = cap(dy * k / dt); vy = cap(dx * k / dt);
  drag = { x: e.clientX, y: e.clientY, t: now, moved: drag.moved + Math.abs(dx) + Math.abs(dy) };
  if (drag.moved > 4) pick();
  apply(); wake();
});
const end = e => {
  touches.delete(e.pointerId); if (touches.size < 2) pinch = 0;
  if (!drag) return;
  const tap = drag.moved < 5;
  if (performance.now() - drag.t > 80) vx = vy = 0;
  drag = null; root.classList.remove("grab"); dirty = true;
  if (tap) pick(e.clientX, e.clientY); // touch has no hover: a tap selects
  wake();
};
root.addEventListener("pointerup", end); root.addEventListener("pointercancel", end);
root.addEventListener("pointerleave", e => { if (e.pointerType === "mouse" && !drag) { pick(); wake(); } });
tip.addEventListener("pointerleave", e => { if (e.pointerType === "mouse" && !drag) { pick(e.clientX, e.clientY); wake(); } });
root.addEventListener("wheel", e => { e.preventDefault(); zoom = Math.max(0.35, Math.min(1.8, zoom * Math.exp(-e.deltaY * 0.0012))); pick(); apply(); wake(); }, { passive: false });
root.addEventListener("dblclick", e => { if (!e.target.closest(".pills, .tip")) { M = [1, 0, 0, 0, 1, 0, 0, 0, 1]; spin = 0; zoom = 1; vx = vy = 0; apply(); wake(); } });
addEventListener("resize", () => { size(); wake(); });

// one loop: the ball redraws only when something changed; the pulse and pings are a few dots per frame
let raf = 0, last = 0, slow = 0;
const frame = now => {
  raf = 0;
  const dt = Math.min(50, now - (last || now)); last = now;
  if (!drag && (vx || vy)) {
    rotate(vx * dt, vy * dt);
    const k = Math.exp(-dt / 300); vx *= k; vy *= k;
    if (Math.abs(vx) + Math.abs(vy) < 0.00002) vx = vy = 0;
    apply();
  }
  if (dirty) {
    const t0 = performance.now();
    draw();
    // a device that can't keep up drops to lite: 1x canvas
    slow = slow * 0.9 + (performance.now() - t0) * 0.1;
    if (!LITE && slow > 16) { LITE = true; size(); }
  }
  f.setTransform(dpr, 0, 0, dpr, 0, 0);
  f.clearRect(0, 0, W, H);
  const anim = show.pulse && !still && !document.hidden;
  if (anim) {
    const n = hops.length - 1, x = hopScr[n * 3], y = hopScr[n * 3 + 1];
    for (const off of [0, 0.5]) {
      const ph = ((now / 2400) + off) % 1, e = 1 - Math.pow(1 - ph, 3);
      f.strokeStyle = "rgba(255,43,214," + (1 - ph).toFixed(3) + ")"; f.lineWidth = 2 * sc;
      f.beginPath(); f.arc(x, y, 10 * sc * (1 + e * 3), 0, 7); f.stroke();
    }
    const segs = route.length / 3 - 1, head = (now / 6500) % 1, t = head < 0.5 ? 2 * head * head : 1 - Math.pow(-2 * head + 2, 2) / 2;
    const fi = t * segs, i = Math.min(segs - 1, Math.floor(fi)), u = fi - i, o = i * 3;
    const px = routeScr[o] + (routeScr[o + 3] - routeScr[o]) * u, py = routeScr[o + 1] + (routeScr[o + 4] - routeScr[o + 1]) * u;
    f.shadowColor = "#ff2bd6"; f.shadowBlur = 8; f.fillStyle = "#fff";
    f.beginPath(); f.arc(px, py, 5 * sc, 0, 7); f.fill(); f.shadowBlur = 0;
  }
  if (anim || dirty || vx || vy) raf = requestAnimationFrame(frame);
};
const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };
document.addEventListener("visibilitychange", wake);
document.fonts.ready.then(() => { dirty = true; wake(); });
spin = 0;
size(); wake();
