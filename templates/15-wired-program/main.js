// 332 // wired.program — paints a 1-bit blue/black dithered "desk" collage
// behind the main panel. Drawn once (and again only when the panel resizes).
(() => {
  "use strict";
  const main = document.getElementById("main");
  const cv = document.getElementById("dither");
  if (!main || !cv || !cv.getContext) return;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const PX = 2; // screen px per dither dot

  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const g = (v) => `rgb(${v * 255 | 0},${v * 255 | 0},${v * 255 | 0})`;

  // one tile: W wide, 0.75W tall, original shapes only
  function scene(W, y0) {
    const H = W * 0.75, r = rng(332);
    ctx.save();
    ctx.translate(0, y0);
    ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
    const bgG = ctx.createLinearGradient(0, 0, W, H);
    bgG.addColorStop(0, g(.32)); bgG.addColorStop(.5, g(.16)); bgG.addColorStop(1, g(.1));
    ctx.fillStyle = bgG; ctx.fillRect(0, 0, W, H);

    // desk slab + keyboard, top-left, rotated
    ctx.save();
    ctx.translate(W * .02, H * .42); ctx.rotate(-0.5);
    const slab = ctx.createLinearGradient(0, 0, 0, W * .22);
    slab.addColorStop(0, g(.62)); slab.addColorStop(1, g(.28));
    ctx.fillStyle = slab; ctx.fillRect(-W * .1, -W * .02, W * .62, W * .2);
    const kw = W * .032, kh = W * .022;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 15; col++) {
        const x = -W * .08 + col * kw * 1.18 + (row % 2) * kw * .4, y = row * kh * 1.35;
        ctx.fillStyle = g(.55 + r() * .08); ctx.fillRect(x, y, kw, kh);
        ctx.fillStyle = g(.9); ctx.fillRect(x, y, kw, kh * .32);
        ctx.fillStyle = g(.05); ctx.fillRect(x, y + kh, kw, kh * .25);
      }
    }
    ctx.restore();
    // desk edge band
    ctx.strokeStyle = g(.02); ctx.lineWidth = W * .025;
    ctx.beginPath(); ctx.moveTo(-W * .05, H * .6); ctx.lineTo(W * .62, -H * .05); ctx.stroke();
    ctx.strokeStyle = g(.45); ctx.lineWidth = W * .006;
    ctx.beginPath(); ctx.moveTo(-W * .05, H * .56); ctx.lineTo(W * .58, -H * .05); ctx.stroke();

    // bright inset panel with a mouse + cord, lower-left
    ctx.fillStyle = g(.72); ctx.fillRect(W * .13, H * .62, W * .48, H * .38);
    const vg = ctx.createLinearGradient(0, H * .62, 0, H);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.75)");
    ctx.fillStyle = vg; ctx.fillRect(W * .13, H * .62, W * .48, H * .38);
    ctx.strokeStyle = g(.08); ctx.lineWidth = W * .012; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(W * .14, H * .8); ctx.bezierCurveTo(W * .2, H * .6, W * .34, H * .62, W * .4, H * .74); ctx.stroke();
    ctx.save(); ctx.translate(W * .44, H * .84); ctx.rotate(.35);
    const mg = ctx.createRadialGradient(-W * .03, -W * .03, 2, 0, 0, W * .12);
    mg.addColorStop(0, g(.95)); mg.addColorStop(1, g(.25));
    ctx.fillStyle = mg; ctx.beginPath(); ctx.ellipse(0, 0, W * .1, W * .065, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = g(.1); ctx.lineWidth = W * .003;
    ctx.beginPath(); ctx.moveTo(-W * .1, 0); ctx.lineTo(W * .02, 0); ctx.moveTo(-W * .04, 0); ctx.lineTo(-W * .04, -W * .06); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = g(.05); ctx.fillRect(0, H * .69, W * .13, H * .31);

    // disc, right
    const cx = W * .81, cy = H * .45, R = W * .12;
    const dg = ctx.createRadialGradient(cx - R * .3, cy - R * .4, R * .1, cx, cy, R);
    dg.addColorStop(0, g(.75)); dg.addColorStop(1, g(.28));
    ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 4; i++) {
      const a = i * 1.57 + .5;
      ctx.fillStyle = g(.95); ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R * 1.35, a, a + .16); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = g(.38); ctx.beginPath(); ctx.arc(cx, cy, R * .45, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = g(0); ctx.beginPath(); ctx.arc(cx, cy, R * .17, 0, Math.PI * 2); ctx.fill();

    // floppy-ish wedge panel, top right
    ctx.fillStyle = g(.85); ctx.fillRect(W * .7, H * .13, W * .23, H * .25);
    ctx.fillStyle = g(.2);
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(W * (.7 + i * .03), H * .38); ctx.lineTo(W * (.74 + i * .035), H * .16); ctx.lineTo(W * (.755 + i * .035), H * .17); ctx.lineTo(W * (.715 + i * .03), H * .38); ctx.fill(); }
    ctx.fillStyle = g(.95); ctx.beginPath(); ctx.moveTo(W * .54, H * .3); ctx.lineTo(W * .6, H * .3); ctx.lineTo(W * .54, H * .37); ctx.fill();
    ctx.beginPath(); ctx.moveTo(W * .68, H * .67); ctx.lineTo(W * .74, H * .72); ctx.lineTo(W * .69, H * .76); ctx.fill();

    // bokeh specks
    for (let i = 0; i < 60; i++) {
      const x = W * (.6 + r() * .4), y = H * r(), rad = W * (.004 + r() * .012);
      const bg = ctx.createRadialGradient(x, y, 0, x, y, rad);
      bg.addColorStop(0, g(.55 + r() * .3)); bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  let lastW = 0, lastH = 0;

  function paint() {
    const w = Math.max(1, Math.round(main.clientWidth / PX));
    const h = Math.max(1, Math.round(main.clientHeight / PX));
    if (w === lastW && h === lastH) return;
    lastW = w; lastH = h;
    cv.width = w; cv.height = h;
    const tileH = w * 0.75;
    for (let y = 0; y < h; y += tileH) scene(w, y);
    const img = ctx.getImageData(0, 0, w, h), d = img.data, r = rng(7);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const lum = Math.pow(d[i] / 255, .7) * 1.15 + .06;
        const t = (BAYER[(y & 3) * 4 + (x & 3)] + .5) / 16 * .9 + (r() - .5) * .25 + .05;
        const on = lum > t;
        d[i] = 0; d[i + 1] = 0; d[i + 2] = on ? 255 : 0; d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  let timer = 0;
  const schedule = () => { cancelAnimationFrame(timer); timer = requestAnimationFrame(paint); };
  paint();
  if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(main);
  else addEventListener("resize", schedule);
})();
