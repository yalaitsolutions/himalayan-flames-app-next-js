// ============================================================
//  Database seed / migration script.
//  Loads the legacy JSON files (server/data/*.json) into
//  MongoDB and creates the admin user.
//
//  Run with:  npm run seed
//  (which calls: node --env-file=.env.local scripts/seed.js)
// ============================================================
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

const DATA_DIR = join(process.cwd(), "server", "data");
const readJson = async (name) =>
  JSON.parse(await readFile(join(DATA_DIR, name), "utf-8"));

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Did you create .env.local?");

  console.log("→ Connecting to MongoDB…");
  await mongoose.connect(uri);

  // ---- Menu: split sections into Category + Product collections ----
  console.log("→ Seeding menu (categories + products)…");
  const menu = await readJson("menu.json");
  await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);

  const categories = [];
  const products = [];
  menu.sections.forEach((s, sIdx) => {
    categories.push({
      slug: String(s.id).trim(),
      icon: s.icon || "fas fa-utensils",
      title: s.title,
      subtitle: s.subtitle || "",
      note: s.note ?? null,
      tab: s.tab || s.title,
      order: sIdx,
    });
    (s.items || []).forEach((it, iIdx) => {
      products.push({
        category: String(s.id).trim(),
        name: it.name,
        desc: it.desc || "",
        price: it.price || "",
        img: it.img || "",
        spicy: !!it.spicy,
        vegan: !!it.vegan,
        label: it.label ?? null,
        order: iIdx,
      });
    });
  });
  await Category.insertMany(categories);
  await Product.insertMany(products);
  console.log(`   ✓ ${categories.length} categories, ${products.length} products`);

  // ---- Reviews ----
  console.log("→ Seeding reviews…");
  const { reviews } = await readJson("reviews.json");
  await Review.deleteMany({});
  await Review.insertMany(reviews.map((r, i) => ({ ...r, order: i })));
  console.log(`   ✓ ${reviews.length} reviews`);

  // ---- Admin user ----
  console.log("→ Creating / updating admin user…");
  const email = (process.env.ADMIN_EMAIL || "owner@himalayanflames.com").toLowerCase();
  const name = process.env.ADMIN_NAME || "Owner";
  const password = process.env.ADMIN_PASSWORD || "HimalayanFlames2024!";
  const hash = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate(
    { email },
    { name, email, password: hash, role: "admin" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`   ✓ admin: ${email}  (password: ${password})`);

  await mongoose.disconnect();
  console.log("✅ Seed complete.");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
