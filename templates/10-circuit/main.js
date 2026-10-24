"use strict";
(() => {
  const NS = "http://www.w3.org/2000/svg", svg = document.getElementById("pcb");
  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const CHIPS = [["03", "NFO"], ["04", "BBS"], ["06", "HEXDUMP"], ["08", "GLYPH"], ["09", "GLOBE"], ["10", "CIRCUIT"], ["11", "WEB"]];
  const GLYPH = { // 5x7 dot matrix
    "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
    "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"]
  };

  const build = () => {
    let seed = 332;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    while (svg.firstChild) svg.firstChild.remove();
    const W = innerWidth, H = innerHeight, portrait = H > W * 1.1;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    const G = 12; // routing grid
    const cols = Math.ceil(W / G), rowsN = Math.ceil(H / G), occ = new Uint8Array(cols * rowsN);
    const mark = (x0, y0, x1, y1, pad = 1) => {
      const a = Math.max(0, Math.floor(Math.min(x0, x1) / G) - pad), b = Math.min(cols - 1, Math.floor(Math.max(x0, x1) / G) + pad);
      const c = Math.max(0, Math.floor(Math.min(y0, y1) / G) - pad), d = Math.min(rowsN - 1, Math.floor(Math.max(y0, y1) / G) + pad);
      for (let y = c; y <= d; y++) for (let x = a; x <= b; x++) occ[y * cols + x] = 1;
    };
    const markPath = (pts, pad = 1) => {
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i], n = Math.ceil(Math.hypot(bx - ax, by - ay) / (G / 2));
        for (let k = 0; k <= n; k++) { const x = ax + (bx - ax) * k / n, y = ay + (by - ay) * k / n; mark(x, y, x, y, pad); }
      }
    };
    // keep the hud corners clear
    mark(0, 0, Math.min(W, 380), 90, 0); mark(W - 260, H - 50, W, H, 0);

    // core
    const S = Math.max(150, Math.min(W, H) * (portrait ? 0.34 : 0.27)), cx = W / 2, cy = portrait ? H * 0.5 : H * 0.53;
    const core = { x: cx - S / 2, y: cy - S / 2, w: S, h: S };
    mark(core.x, core.y, core.x + S, core.y + S, 2);

    // chip slots
    let cw = Math.max(118, Math.min(180, W * 0.12)), ch = Math.max(52, Math.min(66, H * 0.075));
    if (portrait) { cw = Math.min(150, (W - 24 - 3 * 8) / 4); ch = 54; }
    let slots;
    if (!portrait) {
      const lx = Math.max(40 + cw / 2, W * 0.13), rx = W - lx, ys = [0.26, 0.53, 0.8].map(f => H * f);
      slots = [[lx, ys[0]], [lx, ys[1]], [lx, ys[2]], [rx, ys[0]], [rx, ys[1]], [rx, ys[2]], [cx, Math.max(110 + ch / 2, H * 0.12)]];
    } else {
      // four across the top, three across the bottom
      const top = 120 + ch / 2, bot = H - 70 - ch / 2, gap = (W - 4 * cw) / 5;
      const x4 = k => gap + cw / 2 + k * (cw + gap), x3 = k => W / 2 + (k - 1) * (cw + gap * 1.6);
      slots = [[x4(0), top], [x4(1), top], [x4(2), top], [x3(0), bot], [x3(1), bot], [x3(2), bot], [x4(3), top]];
    }
    const chips = CHIPS.map((c, i) => ({ id: c[0], name: c[1], x: slots[i][0] - cw / 2, y: slots[i][1] - ch / 2, w: cw, h: ch, cxp: slots[i][0], cyp: slots[i][1] }));
    chips.forEach(c => mark(c.x, c.y, c.x + c.w, c.y + c.h, 2));

    // which side of the core each chip hangs off, then pin groups ordered along that side so buses don't cross
    const side = c => {
      const dx = c.cxp - cx, dy = c.cyp - cy;
      if (portrait) return dy < 0 ? "t" : "b";
      if (Math.abs(dx) > Math.abs(dy) * 0.55) return dx < 0 ? "l" : "r";
      return dy < 0 ? "t" : "b";
    };
    const groups = { l: [], r: [], t: [], b: [] };
    chips.forEach(c => { c.side = side(c); groups[c.side].push(c); });
    const LANES = 4, SP = 9;
    for (const s in groups) {
      const list = groups[s].sort((a, b) => (s === "l" || s === "r") ? a.cyp - b.cyp : a.cxp - b.cxp);
      list.forEach((c, k) => { c.slot = (k + 1) / (list.length + 1); });
    }

    // octilinear bus: straight out, 45 degrees, straight in
    const route = (c, lane) => {
      const off = (lane - (LANES - 1) / 2) * SP;
      if (c.side === "l" || c.side === "r") {
        const dir = c.side === "l" ? -1 : 1;
        const sx = dir < 0 ? core.x : core.x + S, sy = core.y + S * c.slot + off;
        const ex = dir < 0 ? c.x + c.w : c.x, ey = c.cyp + off;
        const dy = ey - sy, avail = Math.abs(ex - sx), diag = Math.abs(dy);
        if (avail > diag + 30) {
          const x1 = sx + dir * (avail - diag) / 2;
          return [[sx, sy], [x1, sy], [x1 + dir * diag, ey], [ex, ey]];
        }
        return [[sx, sy], [ex - dir * 20, sy], [ex - dir * 20, ey], [ex, ey]];
      }
      const dir = c.side === "t" ? -1 : 1;
      const sx = core.x + S * c.slot + off, sy = dir < 0 ? core.y : core.y + S;
      const ex = c.cxp + off, ey = dir < 0 ? c.y + c.h : c.y;
      const dx = ex - sx, avail = Math.abs(ey - sy), diag = Math.abs(dx);
      if (avail > diag + 30) {
        const y1 = sy + dir * (avail - diag) / 2;
        return [[sx, sy], [sx, y1], [ex, y1 + dir * diag], [ex, ey]];
      }
      // not enough room for a clean 45: dogleg sideways first
      const y1 = sy + dir * Math.min(avail / 2, 24);
      return [[sx, sy], [sx, y1], [ex, y1], [ex, ey]];
    };
    const d = pts => "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L");

    const gFill = el("g", {}, svg), gPk = el("g", { class: "glow" }, svg), gNets = el("g", {}, svg), gParts = el("g", {}, svg);
    const nets = new Map();
    chips.forEach(c => {
      const net = el("g", { class: "net" }, gNets);
      nets.set(c.id, net);
      for (let lane = 0; lane < LANES; lane++) {
        const pts = route(c, lane);
        markPath(pts, 0);
        el("path", { class: "bus", d: d(pts) }, net);
        const pk = el("path", { class: "pk m", d: d(pts), pathLength: 100 }, net);
        pk.style.setProperty("--d", (2.4 + rnd() * 1.6).toFixed(2) + "s");
        pk.style.setProperty("--o", (-rnd() * 4).toFixed(2) + "s");
        if (c.side === "l" || c.side === "t") pk.style.animationDirection = "reverse";
        el("rect", { class: "pin", x: pts[0][0] - 2.5, y: pts[0][1] - 2.5, width: 5, height: 5 }, gParts);
      }
    });

    // micro traces: random octilinear walkers through the free space
    const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    const free = (x, y) => x > 0 && y > 0 && x < cols - 1 && y < rowsN - 1 && !occ[y * cols + x];
    const walkers = Math.round(W * H / 2600);
    for (let n = 0; n < walkers; n++) {
      let x = 1 + Math.floor(rnd() * (cols - 2)), y = 1 + Math.floor(rnd() * (rowsN - 2));
      if (!free(x, y)) continue;
      let di = Math.floor(rnd() * 4) * 2 + (rnd() < 0.25 ? 1 : 0);
      const pts = [[x, y]], len = 3 + Math.floor(rnd() * 22);
      const used = [y * cols + x];
      for (let s = 0; s < len; s++) {
        if (s > 1 && rnd() < 0.22) di = (di + (rnd() < 0.5 ? 1 : 7)) % 8;
        const nx = x + DIRS[di][0], ny = y + DIRS[di][1];
        if (!free(nx, ny) || used.includes(ny * cols + nx)) break;
        x = nx; y = ny; used.push(y * cols + x);
        pts.push([x, y]);
      }
      if (pts.length < 4) continue;
      used.forEach(i => { occ[i] = 1; });
      // neighbours too, so traces keep a gap
      used.forEach(i => { const ux = i % cols, uy = i / cols | 0; for (const [ax, ay] of DIRS) if (free(ux + ax, uy + ay) && rnd() < 0.6) occ[(uy + ay) * cols + ux + ax] = 1; });
      const P = pts.map(([a, b]) => [a * G, b * G]);
      el("path", { class: "fill" + (rnd() < 0.3 ? " b" : ""), d: d(P) }, gFill);
      el("circle", { class: "via", cx: P[P.length - 1][0], cy: P[P.length - 1][1], r: 3.2 }, gFill);
      el("rect", { class: "pad", x: P[0][0] - 2.5, y: P[0][1] - 2.5, width: 5, height: 5 }, gFill);
      if (rnd() < 0.16) {
        const pk = el("path", { class: "pk f", d: d(P), pathLength: 100 }, gPk);
        pk.style.setProperty("--d", (3 + rnd() * 5).toFixed(2) + "s");
        pk.style.setProperty("--o", (-rnd() * 8).toFixed(2) + "s");
      }
    }

    // core: package, pin stubs, dot matrix 332
    el("rect", { class: "core-body", x: core.x, y: core.y, width: S, height: S, rx: 3 }, gParts);
    const stub = Math.max(5, S * 0.035);
    for (let k = 1; k < 16; k++) {
      const t = core.x + S * k / 16, u = core.y + S * k / 16;
      el("rect", { class: "pin", x: t - 1.5, y: core.y - stub, width: 3, height: stub }, gParts);
      el("rect", { class: "pin", x: t - 1.5, y: core.y + S, width: 3, height: stub }, gParts);
      el("rect", { class: "pin", x: core.x - stub, y: u - 1.5, width: stub, height: 3 }, gParts);
      el("rect", { class: "pin", x: core.x + S, y: u - 1.5, width: stub, height: 3 }, gParts);
    }
    const die = S * 0.72, dx0 = cx - die / 2, dy0 = cy - die / 2;
    el("rect", { class: "core-die", x: dx0, y: dy0, width: die, height: die }, gParts);
    const cell = die / 20, gx = cx - cell * 17 / 2, gy = cy - cell * 7 / 2;
    ["3", "3", "2"].forEach((chr, i) => GLYPH[chr].forEach((row, r) => [...row].forEach((b, c) => {
      el("rect", { class: b === "1" ? "dm" : "dm-off", x: gx + (i * 6 + c) * cell + cell * 0.12, y: gy + r * cell + cell * 0.12, width: cell * 0.76, height: cell * 0.76 }, gParts);
    })));
    const brackets = (x, y, w, h, l, cls, parent) => {
      el("path", { class: cls, d: `M${x} ${y + l}V${y}H${x + l}M${x + w - l} ${y}H${x + w}V${y + l}M${x + w} ${y + h - l}V${y + h}H${x + w - l}M${x + l} ${y + h}H${x}V${y + h - l}` }, parent);
    };
    brackets(core.x - stub - 10, core.y - stub - 10, S + 2 * stub + 20, S + 2 * stub + 20, 16, "brk hot", gParts);
    const lb = el("text", { class: "lbl", x: core.x - stub - 10, y: core.y + S + stub + 30 }, gParts);
    lb.textContent = "u0 · core · 332";
    const ln = el("text", { class: "lbl dim", x: core.x + S + stub + 10, y: core.y + S + stub + 30, "text-anchor": "end" }, gParts);
    ln.textContent = LANES * chips.length + " lanes";
    if (portrait) { lb.setAttribute("x", core.x + S + stub + 18); lb.setAttribute("y", cy); ln.setAttribute("x", core.x + S + stub + 18); ln.setAttribute("y", cy + 16); ln.removeAttribute("text-anchor"); lb.setAttribute("writing-mode", "tb"); ln.remove(); }

    // chips
    chips.forEach(c => {
      const a = el("a", { class: "chip", href: "../#" + c.id, target: "_top", "aria-label": "open " + c.name }, gParts);
      const vertical = c.side === "t" || c.side === "b";
      for (let k = 0; k < (vertical ? 10 : 6); k++) {
        if (vertical) { const t = c.x + c.w * (k + 0.5) / 10; el("rect", { class: "cpin", x: t - 1.5, y: c.y - 5, width: 3, height: 5 }, a); el("rect", { class: "cpin", x: t - 1.5, y: c.y + c.h, width: 3, height: 5 }, a); }
        else { const u = c.y + c.h * (k + 0.5) / 6; el("rect", { class: "cpin", x: c.x - 5, y: u - 1.5, width: 5, height: 3 }, a); el("rect", { class: "cpin", x: c.x + c.w, y: u - 1.5, width: 5, height: 3 }, a); }
      }
      el("rect", { class: "body", x: c.x, y: c.y, width: c.w, height: c.h, rx: 2 }, a);
      const nm = el("text", { class: "nm", x: c.cxp, y: c.cyp - 4 }, a);
      nm.textContent = c.name;
      nm.style.fontSize = Math.min(18, c.w / 6.2).toFixed(1) + "px";
      el("text", { class: "ad", x: c.cxp, y: c.y + c.h - 9 }, a).textContent = (c.w < 140 ? "" : "u" + c.id + " · ") + "0x" + (parseInt(c.id, 10) * 0x332).toString(16).toUpperCase();
      brackets(c.x - 9, c.y - 9, c.w + 18, c.h + 18, 9, "brk hot", a);
      const net = nets.get(c.id);
      const on = v => () => net.classList.toggle("on", v);
      a.addEventListener("pointerenter", on(true)); a.addEventListener("pointerleave", on(false));
      a.addEventListener("focus", on(true)); a.addEventListener("blur", on(false));
    });
  };

  // hud: hex column and a ticking clock line, cheap
  const hex = document.getElementById("hex");
  hex.textContent = Array.from({ length: 90 }, (_, i) => (0x14c000 + i * 8).toString(16).padStart(6, "0") + " " + ((i * 2654435761) >>> 24).toString(16).padStart(2, "0")).join("\n");
  const clk = document.getElementById("clk");
  let n = 0;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(() => { if (!document.hidden) clk.textContent = "clk 33.2mhz · 0x" + ((n += 0x332) & 0xffffff).toString(16).padStart(6, "0"); }, 120);

  let t = 0;
  addEventListener("resize", () => { clearTimeout(t); t = setTimeout(build, 150); });
  document.fonts.ready.then(build);
  build();
})();
