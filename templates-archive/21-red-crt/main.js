(() => {
  "use strict";
  const box = document.getElementById("container");
  const psi = document.getElementById("psi");
  const title = document.querySelector(".title");
  const base = title.textContent;
  psi.addEventListener("click", () => {
    const on = box.classList.toggle("is-success");
    psi.setAttribute("aria-pressed", String(on));
    title.textContent = on ? "signal//acquired" : base;
  });
})();
