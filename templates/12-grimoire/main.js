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
