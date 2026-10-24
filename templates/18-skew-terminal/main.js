"use strict";
(() => {
  // three palettes, swapped through css custom properties
  const themes = [
    { ind: "#f8c204", indh: "#d539d2", aud: "#d539d2", audh: "#f8c204", pix: "#f8c204", pixh: "#d539d2", lin: "#f8c204", linh: "#d539d2", met: "#d539d2", meth: "#f8c204", ink: "#000", nav: "#f8c204", fv: "#f8c204", big: "#f8c204" },
    { ind: "#7fe7ff", indh: "#2d5bff", aud: "#f2f6ff", audh: "#2d5bff", pix: "#7fe7ff", pixh: "#f2f6ff", lin: "#2d5bff", linh: "#f2f6ff", met: "#2d5bff", meth: "#7fe7ff", ink: "#000", nav: "#f2f6ff", fv: "#2d5bff", big: "#7fe7ff" },
    { ind: "#00f729", indh: "#fff", aud: "#00f729", audh: "#fff", pix: "#00f729", pixh: "#fff", lin: "#00f729", linh: "#fff", met: "#00f729", meth: "#fff", ink: "#000", nav: "#00f729", fv: "#00f729", big: "#00f729" },
  ];
  const map = { ind: "--ind", indh: "--ind-hover", aud: "--aud", audh: "--aud-hover", pix: "--pix", pixh: "--pix-hover", lin: "--lin", linh: "--lin-hover", met: "--met", meth: "--met-hover", ink: "--ink", nav: "--nav", fv: "--fv", big: "--big" };
  const root = document.documentElement.style;
  const pick = (n) => {
    const t = themes[n] || themes[0];
    for (const k in map) root.setProperty(map[k], t[k]);
    document.querySelectorAll(".themes").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.theme === n)));
  };
  document.querySelectorAll(".themes").forEach((b) => b.addEventListener("click", () => pick(+b.dataset.theme)));
  pick(0);
})();
