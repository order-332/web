"use strict";
(() => {
  const BW = 420, BH = 180, raw = atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACA//////////8fAAAAAAAAAOD//////////wcAAAAAAAAAAPz//////////wcAAAAAAAAAAP7//////////z8AAAAAAACA////////////HwAAAAAAAADw////////////DwAAAAAAAADw////////////PwAAAAAAAPz///////////8PAAAAAAAAgP////////////8PAAAAAAAAgP////////////8PAAAAAADA/////////////wcAAAAAAAD8/////////////wMAAAAAAAD4/////////////wMAAAAAAP7/////////////AQAAAAAAwP//////////////AQAAAAAAgP//////////////AAAAAADg/////////////z8AAAAAAAD+/////////////z8AAAAAAAD4/////////////x8AAAAAAP7/////////////DwAAAAAA4P//////////////DwAAAAAAwP//////////////BwAAAADg//////////////8BAAAAAAD+//////////////8BAAAAAAD8//////////////8AAAAAAP7/////////////PwAAAAAA4P//////////////PwAAAAAAwP//////////////HwAAAADg//////////////8HAAAAAAD+//////////////8HAAAAAAD8//////////////8DAAAAAP7//////////////wAAAAAA4P///////////////wAAAAAAwP//////////////PwAAAADg//////////////8fAAAAAAD+//////////////8fAAAAAAD8//////////////8HAAAAAP7//////////////wMAAAAA4P///////////////wMAAAAAwP///////////////wAAAADg//////////////8/AAAAAAD+//////////////9/AAAAAAD8//////////////8PAAAAAP7//////////////wcAAAAA4P///////////////w8AAAAAwP///////////////wEAAADg//////////////9/AAAAAAD+////////////////AAAAAAD8//////////////8fAAAAAP7//////////////w8AAAAA4P///////////////x8AAAAAwP///////////////wMAAADg////////////////AAAAAAD+////////////////AQAAAAD8//////////////8/AAAAAP7//////////////x8AAAAA4P///////////////z8AAAAAwP///////////////wcAAADg////////////////AQAAAAD+////////////////AwAAAAD8//////////////9/AAAAAP7//////////////x8AAAAA4P///////////////z8AAAAAwP///////////////wcAAADg////////////////AQAAAAD+////////////////BwAAAAD8//////////////9/AAAAAP7//////////////z8AAAAA4P///////////////38AAAAAwP///////////////w8AAADg////////////////AwAAAAD+////////////////BwAAAAD8////////////////AAAAAP7//////////////z8AAAAA4P////////////////8AAAAAwP///////////////w8AAADg////////////////AwAAAAD+////////////////DwAAAAD8////////////////AAAAAP7//////////////z8AAAAA4P////////////////8AAAAAwP///////////////w8AAADg////////////////AwAAAAD+////////////////DwAAAAD8////////////////AAAAAP7//////////////z8AAAAA4P////////////////8AAAAAwP///////////////w8AAADg////////////////BwAAAAD+////////////////DwAAAAD8////////////////AAAAAP7//////////////38AAAAA4P////////////////8AAAAAwP///////////////w8AAADg////////////////BwAAAAD+////////////////HwAAAAD8////////////////AAAAAP7//////////////38AAAAA4P////////////////8BAAAAwP///////////////w8AAADg////////////////BwAAAAD+////////////////HwAAAAD4////////////////AAAAAP7//////////////38AAAAA4P////////////////8BAAAAgP///////////////w8AAADg////////////////BwAAAAD+////////////////HwAAAAD4////////////////AAAAAP7//////////////38AAAAAwP////////////////8BAAAAgP///////////////w8AAADA////////////////BwAAAAD8////////////////HwAAAADw////////////////AAAAAPj//////////////38AAAAAgP////////////////8BAAAAAP7//////////////w8AAAAA////////////////BwAAAADg////////////////HwAAAAAA////////////////AAAAAMD//////////////38AAAAAAAAAAAAAAOD///////8BAAAAAAAAAAAAAPj//////w8AAAAAAAAAAAAA/v//////BwAAAAAAAAAAAAAA+P//////HwAAAAAAAAAAAAAA////////AAAAAAAAAAAAAMD//////38AAAAAAAAAAAAAAAD///////8BAAAAAAAAAAAAAPD//////w8AAAAAAAAAAAAA+P//////BwAAAAAAAAAAAAAA8P//////HwAAAAAAAAAAAAAA/v//////AAAAAAAAAAAAAID//////z8AAAAAAAAAAAAAAAD///////8BAAAAAAAAAAAAAOD//////w8AAAAAAAAAAAAA+P//////AwAAAAAAAAAAAAAA8P//////HwAAAAAAAAAAAAAA/v//////AAAAAAAAAAAAAAD//////z8AAAAAAAAAAAAAAAD///////8BAAAAAAAAAAAAAOD//////w8AAAAAAAAAAAAA8P//////AwAAAAAAAAAAAAAA8P//////HwAAAAAAAAAAAAAA/v//////AAAAAAAAAAAAAAD//////z8AAAAAAAAAAAAAAAD///////8BAAAAAAAAAAAAAOD//////w8AAAAAAAAAAAAA8P//////AwAAAAAAAAAAAAAA8P//////HwAAAAAAAAAAAAAA/v////9/AAAAAAAAAAAAAAD//////z8AAAAAAAAAAAAAAID///////8BAAAAAAAAAAAAAOD//////wcAAAAAAAAAAAAA+P//////AQAAAAAAAAAAAAAA/P//////HwAAAAAAAAAAAAAA/v////9/AAAAAAAAAAAAAID//////x8AAAAAAAAAAAAAAPD///////8BAAAAAAAAAAAAAPD//////wcAAAAAAAAAAAAA+P//////AQAAAAAAAAAAAADg////////HwAAAAAAAAAAAAAA//////8/AAAAAAAAAAAAAMD//////x8AAAAAAAAAAAAAwP////////8BAAAAAAAAAAAAAPz//////wMAAAAAAAAAAAAA////////AAAAAAAAAAAAAID/////////HwAAAAAAAAD///////////8fAAAAAAAAgP///////////w8AAAAAAAAAAACA//////////8BAAAAAAAA/P///////////wEAAAAAAAD+//////////9/AAAAAAAAAAAAAP//////////HwAAAAAAAOD///////////8PAAAAAAAA+P///////////wcAAAAAAAAAAAD+//////////8BAAAAAAAA/////////////wAAAAAAAID///////////8/AAAAAAAAAAAA/P//////////DwAAAAAAAPD///////////8HAAAAAAAA/P///////////wEAAAAAAAAAAPj///////////8AAAAAAAAA////////////PwAAAAAAAMD///////////8PAAAAAAAAAAD4////////////DwAAAAAAAPD///////////8BAAAAAAAA/P//////////fwAAAAAAAAAA8P////////////8AAAAAAAAA////////////BwAAAAAAAMD///////////8DAAAAAAAAAOD/////////////DwAAAAAAAPj//////////z8AAAAAAAAA/P//////////DwAAAAAAAACA//////////////8AAAAAAACA////////////AwAAAAAAAMD///////////8AAAAAAAAAAP7/////////////DwAAAAAAAPj///////////8HAAAAAAAA/P///////////wEAAAAAAAD8/////////////38AAAAAAACA/////////////wMAAAAAAMD/////////////AAAAAAAA8P//////////////BwAAAAAAAPj/////////////AQAAAAAA/P///////////38AAAAAAID//////////////38AAAAAAACA/////////////z8AAAAAAMD/////////////HwAAAAAA/v//////////////AwAAAAAAAPj/////////////DwAAAAAA/P////////////8DAAAAAPj//////////////z8AAAAAAACA//////////////8BAAAAAMD//////////////wAAAADA////////////////AQAAAAAAAPj/////////////fwAAAAAA/P////////////8fAAAAAP7//////////////x8AAAAAAACA//////////////8PAAAAAMD//////////////wMAAADw////////////////AAAAAAAAAPj//////////////wAAAAAA/P////////////9/AAAAgP///////////////w8AAAAAAACA//////////////8fAAAAAMD//////////////w8AAAD8//////////////9/AAAAAAAAAPj//////////////wMAAAAA/P//////////////AAAA4P///////////////wMAAAAAAACA//////////////8/AAAAAMD//////////////x8AAAD///////////////8/AAAAAAAAAPj//////////////wcAAAAA/P//////////////AQAA8P///////////////wEAAAAAAACA//////////////9/AAAAAMD//////////////z8AAID///////////////8PAAAAAAAAAPj//////////////w8AAAAA/P//////////////AwAA+P//////////////fwAAAAAAAACA////////////////AAAAAMD//////////////z8AAMD///////////////8BAAAAAAAAAPj//////////////w8AAAAA/P//////////////BwAA/v//////////////DwAAAAAAAACA////////////////AQAAAMD//////////////38AAOD//////////////38AAAAAAAAAAPj//////////////x8AAAAA/P//////////////BwAA/v//////////////AQAAAAAAAACA////////////////AQAAAMD///////////////8AAPD//////////////w8AAAAAAAAAAPj//////////////x8AAAAA/P//////////////DwAA//////////////8/AAAAAAAAAAAA////////////////AwAAAMD///////////////8AAPD//////////////wAAAAAAAAAAAPD//////////////z8AAAAA/P//////////////DwCA//////////////8DAAAAAAAAAAAA////////////////AwAAAMD///////////////8AAPj/////////////DwAAAAAAAAAAAPD//////////////z8AAAAA+P//////////////DwCA/////////////x8AAAAAAAAAAAAA/v//////////////AwAAAID///////////////8AAPj///////////9/AAAAAAAAAAAAAMD//////////////z8AAAAA8P//////////////HwDA/////////////wAAAAAAAAAAAAAA+P//////////////AwAAAAD8//////////////8BAPz///////////8BAAAAAAAAAAAAAAAAAAAAAPj//////z8AAAAAAAAAAAAA/v//////HwDA////////////AQAAAAAAAAAAAAAAAAAAAAAA/v//////AwAAAAAAAAAAAID///////8BAPz//////////wMAAAAAAAAAAAAAAAAAAAAAAMD//////z8AAAAAAAAAAAAA8P//////HwDA//////////8HAAAAAAAAAAAAAAAAAAAAAAAA+P//////AwAAAAAAAAAAAAD+//////8BAPz/////////DwAAAAAAAAAAAAAAAAAAAAAAAID//////z8AAAAAAAAAAAAA4P//////HwDg/////////x8AAAAAAAAAAAAAAAAAAAAAAAAA+P//////AwAAAAAAAAAAAAD+//////8BAP7///////8/AAAAAAAAAAAAAAAAAAAAAAAAAID//////z8AAAAAAAAAAAAA4P//////HwDg////////PwAAAAAAAAAAAAAAAAAAAAAAAAAA+P//////AwAAAAAAAAAAAAD+//////8BAP7//////38AAAAAAAAAAAAAAAAAAAAAAAAAAID//////z8AAAAAAAAAAAAA4P//////HwDg////////AAAAAAAAAAAAAAAAAAAAAAAAAAAA+P//////AwAAAAAAAAAAAAD+//////8BAP7//////wcAAAAAAAAAAAAAAAAAAAAAAAAAAID//////z8AAAAAAAAAAAAA4P//////HwDg//////8/AAAAAAAAAAAAAAAAAAAAAAAAAAAA+P//////AwAAAAAAAAAAAAD+//////8BAP7//////wMAAAAAAAAAAAAAAAAAAAAAAAAAAID//////z8AAAAAAAAAAAAA4P//////HwDg//////8/AAAAAAAAAAAAAAAAAAAAAAAAAAAA+P//////AwAAAAAAAAAAAAD+//////8BAP7//////wMAAAAAAAAAAAAAAAAAAAAAAAAAAID//////z8AAAAAAAAAAAAA4P//////HwDg//////8/AAAAAAAAAAAAAAAAAAAAAAAAAAAA/P//////AwAAAAAAAAAAAAD///////8BAP7//////wMAAAAAAAAAAAAAAAAAAAAAAAAAAOD//////z8AAAAAAAAAAAAA8P//////HwDg//////8/AAAAAAAAAAAAAAAAAAAAAAAAAACA////////AwAAAAAAAAAAAMD///////8BAP7//////wMAAAAAAAAAAAAAAACA/////////////////z8AAOD/////////////////HwDg/////////////////x8AAAAAAP7/////////////////AwCA//////////////////8BAP7/////////////////BwAAAADw/////////////////z8AAPz/////////////////HwDg//////////////////8AAAAAgP//////////////////AwDA//////////////////8BAP7/////////////////DwAAAAD4/////////////////z8AAP7/////////////////HwDg//////////////////8BAAAAgP//////////////////AwDg//////////////////8BAP7/////////////////HwAAAAD4/////////////////z8AAP7/////////////////HwDg//////////////////8BAAAAwP//////////////////AwDg//////////////////8BAP7/////////////////HwAAAAD8/////////////////z8AAP7/////////////////HwDg//////////////////8BAAAAwP//////////////////AwDg//////////////////8AAP7/////////////////HwAAAAD8/////////////////z8AAP7/////////////////DwDg//////////////////8BAAAAwP//////////////////AwDg//////////////////8AAP7/////////////////HwAAAAD8/////////////////z8AAP7/////////////////DwDg//////////////////8BAAAAwP//////////////////AQDg//////////////////8AAP7/////////////////HwAAAAD8/////////////////x8AAP7/////////////////DwDg//////////////////8BAAAAwP//////////////////AQDg/////////////////38AAP7/////////////////HwAAAAD8/////////////////x8AAP7/////////////////BwDg//////////////////8BAAAAwP//////////////////AADg/////////////////38AAP7/////////////////HwAAAAD8/////////////////w8AAP7/////////////////AwDg//////////////////8BAAAAwP//////////////////AADg/////////////////z8AAP7/////////////////HwAAAAD8/////////////////wcAAP7/////////////////AwDg//////////////////8BAAAAwP////////////////9/AADg/////////////////x8AAP7/////////////////HwAAAAD8/////////////////wMAAP7/////////////////AQDg//////////////////8BAAAAwP////////////////8/AADg/////////////////w8AAP7/////////////////HwAAAAD8/////////////////wEAAP7///////////////9/AADg//////////////////8BAAAAwP////////////////8PAADg/////////////////wcAAP7/////////////////HwAAAAD8/////////////////wAAAP7///////////////8/AADg//////////////////8BAAAAwP////////////////8HAADg/////////////////wEAAP7/////////////////HwAAAAD8////////////////PwAAAP7///////////////8PAADg//////////////////8BAAAAwP////////////////8BAADg////////////////fwAAAP7/////////////////HwAAAAD8////////////////DwAAAP7///////////////8DAADg//////////////////8BAAAAwP///////////////38AAADg////////////////HwAAAP7/////////////////HwAAAAD8////////////////AwAAAP7///////////////8AAADg//////////////////8BAAAAwP///////////////w8AAADg////////////////BwAAAP7/////////////////HwAAAAD4//////////////9/AAAAAP7//////////////x8AAADg//////////////////8BAAAAgP///////////////wEAAADg//////////////9/AAAAAP7/////////////////HwAAAAD4//////////////8HAAAAAPz//////////////wEAAADA//////////////////8AAAAAAP//////////////DwAAAADA//////////////8DAAAAAPz/////////////////DwAAAADg/////////////x8AAAAAAPj/////////////BwAAAACA/////////////////38AAAAAAPz///////////8HAAAAAAAA/v///////////wMAAAAAAOD/////////////////AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  const bits = new Uint8Array(raw.length); for (let i = 0; i < raw.length; i++) bits[i] = raw.charCodeAt(i);
  const solid = (u, v) => { const x = Math.round(u), y = Math.round(v); if (x < 0 || y < 0 || x >= BW || y >= BH) return false; const p = y * BW + x; return (bits[p >> 3] >> (p & 7)) & 1; };
  const $ = id => document.getElementById(id);
  const view = $("view"), back = $("back"), ring = $("ring"), hist = $("hist");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const RAMP = " .:-=+*#%@";
  let cols = 0, rows = 0, aspect = 2;
  const measure = () => {
    const p = document.createElement("span"); p.textContent = "M"; back.append(p);
    const m = p.getBoundingClientRect(); p.remove();
    aspect = m.height / m.width;
    const w = Math.min(innerWidth * 0.62, innerWidth - 520);
    cols = Math.max(48, Math.floor(Math.max(w, innerWidth * 0.5) / m.width));
    rows = Math.max(22, Math.floor(innerHeight * 0.8 / m.height));
    $("cells").textContent = cols + "x" + rows;
  };
  measure(); addEventListener("resize", measure);
  let px = 0, dir = 1;
  addEventListener("pointermove", e => { px = (e.clientX / innerWidth - 0.5) * 1.6; });
  addEventListener("click", () => { dir = -dir; });
  const D = 2.6, TH = 0.22, SL = 7, frameN = { n: 0 };
  let last = performance.now(), fr = 0, acc = 0;
  const frame = t => {
    frameN.n++; const dt = t - last; last = t; acc += dt; fr++;
    if (acc > 500) { $("fps").textContent = Math.round(fr * 1000 / acc); fr = 0; acc = 0; }
    const T = still ? 0 : t / 1000;
    const a = Math.max(-0.75, Math.min(0.75, (still ? 0.35 : Math.sin(t / 2400) * 0.5) + px * 0.45)), ca = Math.cos(a), sa = Math.sin(a);
    const tilt = -0.18, ct = Math.cos(tilt), st = Math.sin(tilt);
    const ys = 2 * (rows * aspect / cols);
    const txt = [], depth = [];
    for (let j = 0; j < rows; j++) {
      let s = ""; const drow = new Float32Array(cols);
      const y = ((j + 0.5) / rows - 0.5) * ys;
      for (let i = 0; i < cols; i++) {
        const xx = ((i + 0.5) / cols - 0.5) * 2;
        let dx = xx * 0.9, dy = y * 0.9, dz = 1, ox = 0, oy = 0, oz = -D;
        let ty = dy * ct - dz * st, tz = dy * st + dz * ct; dy = ty; dz = tz;
        ty = oy * ct - oz * st; tz = oy * st + oz * ct; oy = ty; oz = tz;
        let rx = dx * ca - dz * sa, rz = dx * sa + dz * ca; dx = rx; dz = rz;
        rx = ox * ca - oz * sa; rz = ox * sa + oz * ca; ox = rx; oz = rz;
        let ch = " ", dd = 1e9;
        for (let k = 0; k < SL; k++) {
          const zp = -TH + (2 * TH * k) / (SL - 1);
          const tt = (zp - oz) / dz, hx = ox + tt * dx, hy = oy + tt * dy;
          if (solid((hx / 2.2 + 0.5) * BW, (hy / (2.2 * BH / BW) + 0.5) * BH)) {
            const f = k === 0 ? Math.abs(ca) : 0.25 + 0.35 * (1 - k / SL);
            ch = RAMP[Math.min(9, 1 + Math.floor(f * 8.99))]; dd = tt; break;
          }
        }
        s += ch; drow[i] = dd;
      }
      txt.push(s); depth.push(drow);
    }
    // orbit: a torus around the 332, z-buffered against the text
    const rb = Array.from({ length: rows }, () => new Array(cols).fill(" "));
    const zb = Array.from({ length: rows }, () => new Float32Array(cols));
    const A = 1.32, B = T * 0.6 * dir, R1 = 1.42, R2 = 0.1;
    const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);
    for (let th = 0; th < 6.283; th += 0.22) {
      const ctt = Math.cos(th), stt = Math.sin(th);
      for (let ph = 0; ph < 6.283; ph += 0.012) {
        const cp = Math.cos(ph), sp = Math.sin(ph);
        const cx = R1 + R2 * ctt, cy = R2 * stt;
        let x = cx * cp, y = cy, z = cx * sp;
        let y2 = y * cA - z * sA, z2 = y * sA + z * cA; y = y2; z = z2;
        let x2 = x * cB - z * sB; z2 = x * sB + z * cB; x = x2; z = z2;
        const zc = z + D, inv = 1 / zc;
        const i = Math.floor(((x * inv) / 0.9 / 2 + 0.5) * cols);
        const j = Math.floor(((y * inv) / 0.9 / ys + 0.5) * rows - 0.5 + 0.5);
        if (i < 0 || j < 0 || i >= cols || j >= rows) continue;
        if (1 / zc > zb[j][i]) {
          zb[j][i] = 1 / zc;
          let nx = ctt * cp, ny = stt, nz = ctt * sp;
          y2 = ny * cA - nz * sA; z2 = ny * sA + nz * cA; ny = y2; nz = z2;
          x2 = nx * cB - nz * sB; nz = nx * sB + nz * cB; nx = x2;
          const L = Math.max(0, -0.5 * nx - 0.6 * ny - 0.62 * nz);
          rb[j][i] = zc < depth[j][i] ? RAMP[Math.max(1, Math.min(9, Math.round(1 + L * 8)))] : " ";
          if (zc < depth[j][i]) txt[j] = txt[j].slice(0, i) + " " + txt[j].slice(i + 1);
        }
      }
    }
    let bottom = 0; for (let j = 0; j < rows; j++) if (txt[j].trim()) bottom = j;
    const hz = Math.min(rows - 3, bottom + 1), bk = [];
    for (let j = 0; j < rows; j++) {
      let b = "";
      if (j < hz) for (let i = 0; i < cols; i++) {
        const h = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453, f = h - Math.floor(h);
        b += txt[j][i] !== " " || rb[j][i] !== " " ? " " : f > 0.992 ? (Math.sin(T * 2 + f * 90) > 0.2 ? "+" : ".") : f > 0.985 ? "." : " ";
      }
      else if (j === hz) b = "\u2500".repeat(cols);
      else {
        const m = hz - (j - hz), fade = (j - hz) / (rows - hz), sh = Math.round(Math.sin(j * 0.9 + T * 3) * 1.5);
        for (let i = 0; i < cols; i++) {
          const src = m >= 0 ? txt[m][i - sh] || " " : " ", lvl = RAMP.indexOf(src);
          b += lvl > 0 && Math.random() > fade * 0.9 ? RAMP[Math.max(1, Math.round(lvl * (1 - fade) * 0.6))] : " ";
        }
      }
      bk.push(b);
    }
    const NL = String.fromCharCode(10);
    const K = 6, lay = Array.from({ length: K }, () => []);
    for (let j = 0; j < rows; j++) {
      const parts = Array.from({ length: K }, () => "");
      const row = txt[j];
      for (let i = 0; i < cols; i++) {
        const c = row[i] || " ", band = Math.floor((((i / cols) * 1.6 + j / rows * 0.4 + T * 0.08) % 1 + 1) % 1 * K);
        for (let k = 0; k < K; k++) parts[k] += k === band ? c : " ";
      }
      for (let k = 0; k < K; k++) lay[k].push(parts[k]);
    }
    for (let k = 0; k < K; k++) document.getElementById("v" + k).textContent = lay[k].join(NL);
    ring.textContent = rb.map(r => r.join("")).join(NL);
    back.textContent = bk.join(NL);
    const counts = new Array(10).fill(0); let lit = 0;
    for (const s of txt) for (const c of s) { const k = RAMP.indexOf(c); if (k > 0) { counts[k]++; lit++; } }
    for (const r of rb) for (const c of r) { const k = RAMP.indexOf(c); if (k > 0) { counts[k]++; lit++; } }
    const mx = Math.max(...counts.slice(1), 1);
    hist.textContent = counts.slice(1).map((n, k) => RAMP[k + 1] + " " + "\u2588".repeat(Math.round(n / mx * 14)).padEnd(14, "\u00b7") + " " + n).join(NL);
    $("fr").textContent = frameN.n; $("yaw").textContent = Math.round(a * 57.3) + "\u00b0"; $("lit").textContent = lit;
    if (!still) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
