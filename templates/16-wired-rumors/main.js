// 332 // wired.rumors — link cards can be dragged around the wall (mouse/pen only,
// so touch still scrolls). A click that ended a drag doesn't follow the link.
(() => {
  "use strict";
  let top = 10;
  for (const box of document.querySelectorAll(".linkbox")) {
    let sx = 0, sy = 0, ox = 0, oy = 0, moved = false, id = null;
    box.addEventListener("dragstart", (e) => e.preventDefault());
    box.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      id = e.pointerId; moved = false;
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(box.style.left) || 0; oy = parseFloat(box.style.top) || 0;
      box.setPointerCapture(id);
    });
    box.addEventListener("pointermove", (e) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      if (!moved) { moved = true; box.classList.add("drag"); box.style.zIndex = String(++top); }
      box.style.left = ox + dx + "px";
      box.style.top = oy + dy + "px";
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null; box.classList.remove("drag");
      if (box.hasPointerCapture(e.pointerId)) box.releasePointerCapture(e.pointerId);
    };
    box.addEventListener("pointerup", end);
    box.addEventListener("pointercancel", end);
    box.addEventListener("click", (e) => { if (moved) { e.preventDefault(); moved = false; } });
  }
})();
