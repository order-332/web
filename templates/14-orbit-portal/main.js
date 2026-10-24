(() => {
  const body = document.body;
  const toggle = (id, cls) => {
    const b = document.getElementById(id);
    if (!b) return;
    b.addEventListener('click', () => {
      const on = body.classList.toggle(cls);
      b.setAttribute('aria-pressed', String(on));
    });
  };
  toggle('pause', 'paused');
  toggle('power', 'off');

  // "last updated" from the document's own timestamp
  const upd = document.getElementById('upd');
  const d = new Date(document.lastModified);
  if (upd && !isNaN(d)) {
    const p = n => String(n).padStart(2, '0');
    upd.textContent = `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  }
})();
