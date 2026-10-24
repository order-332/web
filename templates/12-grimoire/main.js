// countdown to the next 3:32 (local time). pauses while the tab is hidden.
(() => {
  const out = document.getElementById('count');
  if (!out) return;
  const pl = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
  let timer = 0;
  function tick() {
    const now = new Date();
    const t = new Date(now);
    t.setHours(3, 32, 0, 0);
    if (t <= now) t.setTime(t.getTime() + 864e5);
    let s = Math.floor((t - now) / 1000);
    const h = Math.floor(s / 3600); s -= h * 3600;
    const m = Math.floor(s / 60); s -= m * 60;
    out.textContent = pl(h, 'hour') + ', ' + pl(m, 'minute') + ', and ' + pl(s, 'second') + ' until 3:32!';
  }
  function start() { if (!timer) { tick(); timer = setInterval(tick, 1000); } }
  function stop() { clearInterval(timer); timer = 0; }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
})();

// the book: click the cover to open it, the link under it (or Escape) to shut it
(() => {
  const tome = document.getElementById('tome');
  if (!tome) return;
  const front = tome.querySelector('.front'), shut = tome.querySelector('.shut');
  const links = tome.querySelectorAll('.page a');
  const set = open => {
    tome.classList.toggle('open', open);
    front.setAttribute('aria-expanded', String(open));
    front.tabIndex = open ? -1 : 0;
    links.forEach(a => { a.tabIndex = open ? 0 : -1; });
  };
  front.addEventListener('click', () => set(true));
  shut.addEventListener('click', () => { set(false); front.focus({ preventScroll: true }); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && tome.classList.contains('open')) { set(false); front.focus(); } });
  set(false);
})();
