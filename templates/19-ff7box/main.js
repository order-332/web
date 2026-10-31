"use strict";
// 332 // ff7 box: a shared room. Everyone is a number, a name if they pick one, and the server forgets it all after a day.
(() => {
  const POLL = 4000;
  const BAD_NAME = "name: 12 letters, numbers, _ or -";
  const log = document.getElementById("log");
  const form = document.getElementById("say");
  const input = document.getElementById("text");
  const status = document.getElementById("status");
  const list = document.getElementById("members");
  const count = document.getElementById("count");
  let last = 0, you = null, myName = null, timer = 0, shown = "", editing = false;

  const p = n => String(n).padStart(2, "0");
  const label = v => (v.name ? v.name : "") + "#" + v.n;
  const send = body => fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

  const show = msg => {
    const nearEnd = log.scrollHeight - log.scrollTop - log.clientHeight < 60;
    const at = new Date(msg.at);
    const m = document.createElement("p"), t = document.createElement("time"), line = document.createElement("div"), b = document.createElement("b"), s = document.createElement("span");
    m.className = msg.n === you ? "msg mine" : "msg";
    t.textContent = `${p(at.getHours())}:${p(at.getMinutes())}`;
    t.title = at.toLocaleString();
    b.dataset.n = msg.n;
    b.textContent = label(msg);
    s.textContent = msg.text;
    line.append(b, s);
    m.append(t, line);
    log.append(m);
    if (nearEnd) log.scrollTop = log.scrollHeight;
  };

  // your own name is the control: click it, and it becomes the field
  async function saveName(name) {
    try {
      const res = await send({ name });
      if (res.status === 429) { status.textContent = "slow down"; return false; }
      if (res.status === 400) { status.textContent = BAD_NAME; return false; }
      if (!res.ok) throw new Error(res.status);
      return true;
    } catch {
      status.textContent = "no carrier";
      return false;
    }
  }
  function editName() {
    const row = list.querySelector(".mine");
    if (editing || !row) return;
    editing = true;
    const field = document.createElement("input");
    field.className = "rename";
    field.maxLength = 12;
    field.value = myName || "";
    field.autocomplete = "off";
    field.spellcheck = false;
    field.setAttribute("aria-label", "your name");
    const done = () => { editing = false; shown = ""; status.textContent = ""; poll(); };
    field.addEventListener("keydown", async e => {
      e.stopPropagation();
      if (e.key === "Escape") return done();
      if (e.key !== "Enter") return;
      e.preventDefault();
      const name = field.value.trim();
      if (!name || name === myName) return done();
      if (await saveName(name)) done();
    });
    field.addEventListener("blur", () => { if (editing) done(); });
    const box = document.createElement("span");
    box.append(field, "#" + you);
    row.querySelector(".me").replaceWith(box);
    field.focus();
    field.select();
  }

  const showMembers = members => {
    const key = JSON.stringify([you, members]);
    if (editing || key === shown) return;
    shown = key;
    count.textContent = members.filter(m => m.online).length;
    list.replaceChildren(...members.map(m => {
      const li = document.createElement("li");
      li.className = (m.n === you ? "mine " : "") + (m.online ? "on" : "idle");
      const i = document.createElement("i");
      if (m.n === you) {
        myName = m.name;
        const me = document.createElement("button");
        me.type = "button";
        me.className = "me";
        me.title = "change your name";
        me.textContent = label(m);
        me.addEventListener("click", editName);
        i.textContent = "you";
        li.append(me, i);
      } else {
        li.textContent = label(m);
        if (!m.online) { i.textContent = "idle"; li.append(i); }
      }
      return li;
    }));
    // a new name reaches the lines already on screen too
    members.forEach(m => log.querySelectorAll(`b[data-n="${m.n}"]`).forEach(b => { b.textContent = label(m); }));
  };

  async function poll() {
    clearTimeout(timer);
    try {
      const res = await fetch("/api/chat?after=" + last);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      you = data.you;
      if (!editing) status.textContent = "";
      const first = !last;
      data.messages.forEach(m => { show(m); last = m.id; });
      showMembers(data.members);
      if (first) log.scrollTop = log.scrollHeight;
    } catch {
      status.textContent = "no carrier";
    }
    if (!document.hidden) timer = setTimeout(poll, POLL);
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const nick = text.match(/^\/nick\s+(.+)$/i);
    if (nick) {
      if (await saveName(nick[1])) { input.value = ""; await poll(); }
      return;
    }
    try {
      const res = await send({ text });
      if (res.status === 429) { status.textContent = "slow down"; return; }
      if (!res.ok) throw new Error(res.status);
      input.value = "";
      log.scrollTop = log.scrollHeight;
      await poll();
    } catch {
      status.textContent = "no carrier";
    }
  });

  log.addEventListener("click", e => { if (e.target.closest(".mine b")) editName(); });
  // typing here must not reach the template switcher's hotkeys
  input.addEventListener("keydown", e => e.stopPropagation());
  document.addEventListener("visibilitychange", () => { if (!document.hidden) poll(); });
  poll();
})();
