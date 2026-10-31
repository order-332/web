// 332 // the chat behind the ff7 box. Viewers are numbers and everything lasts a day.
// Each viewer's request details stay in the database: no response ever sends them to anyone.
const DAY = 86400000;
const MAX_LENGTH = 280;
const PER_VIEWER_GAP = 2000;
const ROOM_PER_MINUTE = 60;
const HISTORY = 200;
const MEMBERS = 100;
const ONLINE_FOR = 60000;
const SEEN_EVERY = 30000;
const NAME = /^[A-Za-z0-9_-]{1,12}$/;
const RESERVED = /^(332|order332|order_332|admin|mod|sysop|root)$/i;

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...headers } });

let ready = false;
async function open(db) {
  if (ready) return;
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS viewers (n INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT NOT NULL UNIQUE, seen_at INTEGER NOT NULL, said_at INTEGER NOT NULL DEFAULT 0, name TEXT, ip TEXT, country TEXT, timezone TEXT, os TEXT, language TEXT, user_agent TEXT)"),
    db.prepare("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, n INTEGER NOT NULL, text TEXT NOT NULL, at INTEGER NOT NULL)"),
    db.prepare("CREATE INDEX IF NOT EXISTS messages_at ON messages (at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS viewers_seen ON viewers (seen_at)"),
  ]);
  ready = true;
}

const cookie = token => ({ "set-cookie": `v=${token}; Path=/api; Max-Age=86400; HttpOnly; Secure; SameSite=Strict` });
const tokenOf = request => (request.headers.get("cookie") || "").match(/(?:^|;\s*)v=([0-9a-f-]{36})/)?.[1] || null;
const viewerOf = (db, token) => (token ? db.prepare("SELECT n, seen_at, said_at FROM viewers WHERE token = ?").bind(token).first() : null);
const osOf = ua => (/Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Mac OS X/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : null);
const addViewer = (db, token, now, request) => {
  const h = request.headers, ua = h.get("user-agent") || null;
  return db.prepare("INSERT INTO viewers (token, seen_at, ip, country, timezone, os, language, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING n, seen_at, said_at")
    .bind(token, now, h.get("cf-connecting-ip"), request.cf?.country ?? null, request.cf?.timezone ?? null, ua && osOf(ua), h.get("accept-language"), ua)
    .first();
};

export async function onRequestGet({ request, env }) {
  const db = env.CHAT;
  if (!db) return json({ error: "offline" }, 503);
  await open(db);
  const now = Date.now();
  const after = Number(new URL(request.url).searchParams.get("after")) || 0;

  // presence: the page itself joins the room, and stays online for as long as it keeps polling
  let token = tokenOf(request), headers = {};
  let viewer = await viewerOf(db, token);
  if (!viewer && request.headers.get("sec-fetch-site") === "same-origin") {
    token = crypto.randomUUID();
    viewer = await addViewer(db, token, now, request);
    headers = cookie(token);
  } else if (viewer && now - viewer.seen_at > SEEN_EVERY) {
    await db.prepare("UPDATE viewers SET seen_at = ? WHERE token = ?").bind(now, token).run();
    headers = cookie(token);
  }

  const [messages, members] = await db.batch([
    db.prepare("SELECT id, n, (SELECT name FROM viewers v WHERE v.n = m.n) AS name, text, at FROM (SELECT * FROM messages WHERE id > ? AND at > ? ORDER BY id DESC LIMIT ?) m ORDER BY id").bind(after, now - DAY, HISTORY),
    db.prepare("SELECT n, name, seen_at > ? AS online FROM viewers WHERE seen_at > ? ORDER BY online DESC, n LIMIT ?").bind(now - ONLINE_FOR, now - DAY, MEMBERS),
  ]);
  return json({ messages: messages.results, members: members.results, you: viewer?.n ?? null }, 200, headers);
}

export async function onRequestPost({ request, env }) {
  const db = env.CHAT;
  if (!db) return json({ error: "offline" }, 503);
  const url = new URL(request.url);
  if (request.headers.get("origin") !== url.origin) return json({ error: "forbidden" }, 403);
  const body = await request.json().catch(() => null);
  const name = body?.name;
  const text = typeof body?.text === "string" ? body.text.replace(/[\u0000-\u001f\u007f]+/g, " ").trim() : "";
  if (name !== undefined) {
    if (typeof name !== "string" || !NAME.test(name) || RESERVED.test(name)) return json({ error: "bad name" }, 400);
  } else if (!text || text.length > MAX_LENGTH) return json({ error: "bad message" }, 400);

  await open(db);
  const now = Date.now();
  const room = await db.prepare("SELECT COUNT(*) AS c FROM messages WHERE at > ?").bind(now - 60000).first("c");
  if (name === undefined && room >= ROOM_PER_MINUTE) return json({ error: "slow down" }, 429);

  let token = tokenOf(request);
  let viewer = await viewerOf(db, token);
  if (viewer && now - viewer.said_at < PER_VIEWER_GAP) return json({ error: "slow down" }, 429);
  if (!viewer) {
    token = crypto.randomUUID();
    viewer = await addViewer(db, token, now, request);
  }

  if (name !== undefined) {
    await db.prepare("UPDATE viewers SET name = ?1, seen_at = ?2, said_at = ?2 WHERE n = ?3").bind(name, now, viewer.n).run();
    return json({ you: viewer.n }, 200, cookie(token));
  }

  await db.batch([
    db.prepare("UPDATE viewers SET seen_at = ?1, said_at = ?1 WHERE n = ?2").bind(now, viewer.n),
    db.prepare("INSERT INTO messages (n, text, at) VALUES (?, ?, ?)").bind(viewer.n, text, now),
    db.prepare("DELETE FROM messages WHERE at <= ?").bind(now - DAY),
    db.prepare("DELETE FROM viewers WHERE seen_at <= ?").bind(now - DAY),
  ]);
  return json({ you: viewer.n }, 201, cookie(token));
}
