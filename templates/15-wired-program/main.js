// 332 // wired.program — paints the logo's figures in 1-bit bone/black dither
// behind the main panel. Drawn once (and again only when the panel resizes).
(() => {
  "use strict";
  const main = document.getElementById("main");
  const cv = document.getElementById("dither");
  if (!main || !cv || !cv.getContext) return;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const PX = 2; // screen px per dither dot

  const rng = s => () => (s = s * 16807 % 2147483647) / 2147483647;
  const g = (v) => `rgb(${v * 255 | 0},${v * 255 | 0},${v * 255 | 0})`;

  // the three hooded figures, blown up across the top of the panel
  const logo = new Image();
  logo.src = "../shared/logo.jpg";
  function scene(W, H) {
    ctx.fillStyle = g(0);
    ctx.fillRect(0, 0, W, H);
    // the faces sit about 37% down the logo: keep them mid-way down the space above the log
    const hero = document.querySelector(".head").offsetTop / PX;
    if (logo.complete && logo.naturalWidth) ctx.drawImage(logo, 0, hero * .5 - W * .37, W, W);
  }

  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  let lastW = 0, lastH = 0;

  function paint() {
    const w = Math.max(1, Math.round(main.clientWidth / PX));
    const h = Math.max(1, Math.round(main.clientHeight / PX));
    if (w === lastW && h === lastH) return;
    lastW = w; lastH = h;
    cv.width = w; cv.height = h;
    scene(w, h);
    const img = ctx.getImageData(0, 0, w, h), d = img.data, r = rng(7);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const lum = Math.pow(d[i] / 255, .9) * 1.2;
        const t = (BAYER[(y & 3) * 4 + (x & 3)] + .5) / 16 * .9 + (r() - .5) * .25 + .05;
        const on = lum > t;
        d[i] = on ? 223 : 2; d[i + 1] = on ? 232 : 5; d[i + 2] = on ? 207 : 3; d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  let timer = 0;
  const schedule = () => { cancelAnimationFrame(timer); timer = requestAnimationFrame(paint); };
  paint();
  logo.addEventListener("load", () => { lastW = 0; paint(); });
  if (document.fonts) document.fonts.ready.then(() => { lastW = 0; paint(); });
  if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(main);
  else addEventListener("resize", schedule);
})();
