// ============================================================
//  Himalayan Flames — Node.js / Express API
//  Simple architecture: data is read from / written to local
//  JSON files in ./data (no database).
// ============================================================
import express from "express";
import cors from "cors";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data");
const CLIENT_DIST = join(__dirname, "..", "client", "dist");
const UPLOADS_DIR = join(__dirname, "uploads");

const app = express();
const PORT = process.env.PORT || 4000;

// --- Owner credentials & auth config (override via environment variables) ---
const ADMIN_USER = process.env.ADMIN_USER || "owner";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "HimalayanFlames2024!";
const AUTH_SECRET = process.env.AUTH_SECRET || "himalayan-flames-please-change-this-secret";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 8; // tokens are valid for 8 hours

app.use(cors());
app.use(express.json({ limit: "15mb" })); // large limit needed for base64 image uploads

// --- tiny JSON file helpers (local file storage) ---
const filePath = (name) => join(DATA_DIR, name);
const readJson = async (name) => JSON.parse(await readFile(filePath(name), "utf-8"));
const writeJson = async (name, data) =>
  writeFile(filePath(name), JSON.stringify(data, null, 2), "utf-8");

const asyncRoute = (fn) => (req, res) =>
  Promise.resolve(fn(req, res)).catch((err) => {
    console.error(err);
    res.status(500).json({ ok: false, error: "Internal server error" });
  });

// ---------------- AUTH (stateless HMAC-signed tokens) ----------------
const sign = (data) => createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");

const makeToken = (user) => {
  const payload = Buffer.from(JSON.stringify({ u: user, exp: Date.now() + TOKEN_TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
};

const verifyToken = (token) => {
  if (!token || typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const got = Buffer.from(sig);
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
};

// Constant-time string comparison (avoids leaking length via early return where possible)
const safeEqual = (a, b) => {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
};

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const data = verifyToken(token);
  if (!data) return res.status(401).json({ ok: false, error: "Unauthorized. Please log in again." });
  req.admin = data;
  next();
};

// Validate a full menu payload before it is written to disk.
const validateMenu = (menu) => {
  if (!menu || !Array.isArray(menu.sections)) return "Menu must contain a sections array.";
  const ids = [];
  for (const s of menu.sections) {
    if (!s || typeof s.id !== "string" || !s.id.trim()) return "Every category needs a non-empty id.";
    if (typeof s.title !== "string" || !s.title.trim()) return `Category "${s.id}" needs a title.`;
    if (!Array.isArray(s.items)) return `Category "${s.id}" must have an items array.`;
    for (const it of s.items) {
      if (!it || typeof it.name !== "string" || !it.name.trim())
        return `Every item in "${s.title}" needs a name.`;
    }
    ids.push(s.id.trim());
  }
  if (new Set(ids).size !== ids.length) return "Category ids must be unique.";
  return null;
};

// Normalise a menu payload so stored data always has the same shape.
const cleanMenu = (menu) => ({
  sections: menu.sections.map((s) => ({
    id: String(s.id).trim(),
    icon: (s.icon && String(s.icon).trim()) || "fas fa-utensils",
    title: String(s.title).trim(),
    subtitle: String(s.subtitle || "").trim(),
    note: s.note ? String(s.note).trim() : null,
    items: s.items.map((it) => ({
      name: String(it.name).trim(),
      desc: String(it.desc || "").trim(),
      price: String(it.price || "").trim(),
      img: String(it.img || "").trim(),
      spicy: !!it.spicy,
      vegan: !!it.vegan,
      label: it.label ? String(it.label).trim() : null,
    })),
    tab: String(s.tab || s.title || "").trim(),
  })),
});

// ---------------- API ROUTES ----------------
app.get("/api/health", (_req, res) => res.json({ ok: true, status: "up" }));

app.get("/api/menu", asyncRoute(async (_req, res) => {
  res.json(await readJson("menu.json"));
}));

app.get("/api/reviews", asyncRoute(async (_req, res) => {
  res.json(await readJson("reviews.json"));
}));

app.get("/api/site", asyncRoute(async (_req, res) => {
  res.json(await readJson("site.json"));
}));

// Contact form -> appended to data/messages.json
app.post("/api/contact", asyncRoute(async (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ ok: false, error: "Name, email and message are required." });
  }
  const store = await readJson("messages.json");
  const entry = {
    id: randomUUID(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone || "").trim(),
    subject: String(subject || "").trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  };
  store.messages.push(entry);
  await writeJson("messages.json", store);
  res.status(201).json({ ok: true, id: entry.id });
}));

// ---------------- OWNER / ADMIN ROUTES ----------------
// Owner logs in with username + password and receives a signed token.
app.post("/api/admin/login", asyncRoute(async (req, res) => {
  const { username, password } = req.body || {};
  const okUser = safeEqual(username || "", ADMIN_USER);
  const okPass = safeEqual(password || "", ADMIN_PASSWORD);
  if (!okUser || !okPass) {
    return res.status(401).json({ ok: false, error: "Invalid username or password." });
  }
  res.json({ ok: true, token: makeToken(ADMIN_USER), user: ADMIN_USER });
}));

// Lightweight check the client uses to confirm a stored token is still valid.
app.get("/api/admin/me", requireAuth, (req, res) => res.json({ ok: true, user: req.admin.u }));

// Save the full menu (add/remove items, change prices, move items, add categories).
app.put("/api/admin/menu", requireAuth, asyncRoute(async (req, res) => {
  const error = validateMenu(req.body);
  if (error) return res.status(400).json({ ok: false, error });
  const clean = cleanMenu(req.body);
  await writeJson("menu.json", clean);
  res.json({ ok: true, sections: clean.sections.length });
}));

// Upload an image from the admin dashboard (base64 data URL → saved to server/uploads/).
app.post("/api/admin/upload", requireAuth, asyncRoute(async (req, res) => {
  const { filename, data } = req.body || {};
  const match = (data || "").match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/s);
  if (!match) return res.status(400).json({ ok: false, error: "Invalid image data — must be a base64 data URL." });
  const [, mimeType, b64] = match;
  const buf = Buffer.from(b64, "base64");
  if (buf.length > 10 * 1024 * 1024)
    return res.status(400).json({ ok: false, error: "Image too large (max 10 MB)." });
  const extRaw = mimeType.split("/")[1] || "jpg";
  const ext = extRaw.replace("jpeg", "jpg").replace("svg+xml", "svg");
  const safeStem = (filename || "photo").replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.[^.]+$/, "");
  const fname = `${Date.now()}-${safeStem}.${ext}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(join(UPLOADS_DIR, fname), buf);
  res.json({ ok: true, url: `/uploads/${fname}` });
}));

// ---------------- STATIC FRONTEND ----------------
// Serve uploaded owner images.
app.use("/uploads", express.static(UPLOADS_DIR));

// Serve the built React app (run `npm run build` in ../client first).
if (existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get("*", (_req, res) => res.sendFile(join(CLIENT_DIST, "index.html")));
}

app.listen(PORT, () => {
  console.log(`Himalayan Flames API running at http://localhost:${PORT}`);
});
