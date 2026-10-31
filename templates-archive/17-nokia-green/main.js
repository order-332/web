"use strict";
(() => {
  const $ = (id) => document.getElementById(id);

  // phone clock
  const clock = $("clock");
  const tick = () => {
    const d = new Date();
    clock.textContent = d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
  };
  tick();
  setInterval(() => { if (!document.hidden) tick(); }, 15000);

  // templates dropdown
  const btn = document.querySelector(".dropbtn");
  const drop = $("drop");
  const setDrop = (open) => { drop.classList.toggle("show", open); btn.setAttribute("aria-expanded", String(open)); };
  btn.addEventListener("click", (e) => { e.stopPropagation(); setDrop(!drop.classList.contains("show")); });
  document.addEventListener("click", () => setDrop(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setDrop(false); });

  // fake music player: no audio files, just the ui
  const tracks = ["[artist] - [track title]", "[artist] - [another track]", "track 03 - coming soon"];
  const song = $("song"), prog = $("prog"), play = $("play");
  let i = 0, pos = 0, timer = 0;
  const LEN = 90; // seconds per fake track
  const draw = () => { prog.style.width = (pos / LEN) * 100 + "%"; };
  const load = (n) => { i = (n + tracks.length) % tracks.length; song.textContent = tracks[i]; pos = 0; draw(); };
  const stop = () => { clearInterval(timer); timer = 0; };
  const start = () => {
    stop();
    timer = setInterval(() => {
      if (document.hidden) return;
      pos += 0.5;
      if (pos >= LEN) load(i + 1);
      draw();
    }, 500);
  };
  play.addEventListener("click", () => {
    const on = play.getAttribute("aria-pressed") !== "true";
    play.setAttribute("aria-pressed", String(on));
    play.textContent = on ? "Pause" : "Play";
    on ? start() : stop();
  });
  $("prev").addEventListener("click", () => load(i - 1));
  $("next").addEventListener("click", () => load(i + 1));
  document.querySelector(".progresscontainer").addEventListener("click", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    pos = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * LEN;
    draw();
  });

  // menu: just mark the pressed tab
  document.querySelectorAll("#menu > button").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll("#menu > button").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
    })
  );
})();
