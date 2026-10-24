"use strict";
const root = document.querySelector(".tr");
document.querySelectorAll(".pills button").forEach(b => b.addEventListener("click", () => {
  const on = b.getAttribute("aria-pressed") !== "true";
  b.setAttribute("aria-pressed", String(on));
  root.classList.toggle("no-" + b.dataset.k, !on);
}));
