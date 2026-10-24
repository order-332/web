"use strict";
const frame = document.getElementById("v");
const bar = document.getElementById("bar");
const buttons = [...document.querySelectorAll("#list button")];
const ids = buttons.map(b => b.dataset.t);
let i = Math.max(0, ids.findIndex(id => id.startsWith(location.hash.slice(1) || "03")));
const show = n => {
  i = (n + ids.length) % ids.length;
  frame.src = ids[i] + "/";
  buttons.forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
  buttons[i].scrollIntoView({ block: "nearest", inline: "nearest" });
  history.replaceState(null, "", "#" + ids[i].slice(0, 2));
};
buttons.forEach((b, k) => b.addEventListener("click", () => show(k)));
document.getElementById("prev").addEventListener("click", () => show(i - 1));
document.getElementById("next").addEventListener("click", () => show(i + 1));
document.getElementById("hide").addEventListener("click", () => bar.classList.add("off"));
const keys = e => {
  if (e.key === "ArrowRight") show(i + 1);
  else if (e.key === "ArrowLeft") show(i - 1);
  else if (e.key === "h" || e.key === "H") bar.classList.toggle("off");
  else if (/^[1-9]$/.test(e.key) && Number(e.key) <= ids.length) show(Number(e.key) - 1);
};
addEventListener("keydown", keys);
frame.addEventListener("load", () => { try { frame.contentWindow.addEventListener("keydown", keys); } catch {} });
show(i);
