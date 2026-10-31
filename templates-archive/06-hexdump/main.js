"use strict";
const insp = document.getElementById("insp");
const rows = [...document.querySelectorAll(".hex .r")];
const arows = [...document.querySelectorAll(".asc .r")];
const BASE = 320, COLS = 32;
let lit = null;
const show = (r, c) => {
  const cell = rows[r].querySelectorAll("i")[c], v = parseInt(cell.textContent, 16);
  const nxt = k => { const rr = r + Math.floor((c + k) / COLS), cc = (c + k) % COLS; return rows[rr] ? parseInt(rows[rr].querySelectorAll("i")[cc].textContent, 16) : 0; };
  const u16 = v | (nxt(1) << 8), u32 = (u16 | (nxt(2) << 16) | (nxt(3) << 24)) >>> 0;
  if (lit) lit.forEach(e => e.classList.remove("sel"));
  lit = [cell, arows[r].querySelectorAll("i")[c]]; lit.forEach(e => e.classList.add("sel"));
  const off = BASE + r * COLS + c;
  insp.textContent = "[ inspect ]\n" +
    "offset  0x" + off.toString(16).padStart(8, "0") + "\n" +
    "hex     " + v.toString(16).padStart(2, "0") + "\n" +
    "u8      " + v + "\n" +
    "i8      " + (v > 127 ? v - 256 : v) + "\n" +
    "u16le   " + u16 + "\n" +
    "u32le   0x" + u32.toString(16).padStart(8, "0") + "\n" +
    "oct     " + v.toString(8).padStart(3, "0") + "\n" +
    "bin     " + v.toString(2).padStart(8, "0") + "\n" +
    "char    " + (v >= 32 && v < 127 ? "'" + String.fromCharCode(v) + "'" : "--");
};
document.querySelector(".hex").addEventListener("pointerover", e => {
  const i = e.target.closest("i"); if (!i) return;
  const row = i.closest(".r"), r = rows.indexOf(row), c = [...row.querySelectorAll("i")].indexOf(i);
  if (r >= 0) show(r, c);
});
show(0, 12);
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const ks = [...document.querySelectorAll(".hex .k")];
  const ac = ks.map(k => { const row = k.closest(".r"), r = rows.indexOf(row), c = [...row.querySelectorAll("i")].indexOf(k); return arows[r].querySelectorAll("i")[c]; });
  const tick = () => {
    for (let n = 0; n < 3; n++) {
      const j = Math.floor(Math.random() * ks.length), v = Math.floor(Math.random() * 256);
      ks[j].textContent = v.toString(16).padStart(2, "0");
      ac[j].textContent = v >= 32 && v < 127 ? String.fromCharCode(v) : ".";
      ks[j].classList.remove("w"); void ks[j].offsetWidth; ks[j].classList.add("w");
    }
  };
  setInterval(tick, 90);
}
