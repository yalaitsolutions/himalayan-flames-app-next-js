// ============================================================
//  /api/menu
//    GET -> public nested menu ({ sections: [...] })
//    PUT -> replace the whole menu (admin only)
//
//  The admin dashboard saves the entire menu at once, so PUT
//  validates the payload then rewrites the Category + Product
//  collections to match. Image IDs are stored directly in
//  the database and loaded via /api/images/[id] on the client.
// ============================================================
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Image from "@/models/Image";
import { getMenuSections } from "@/lib/data";
import { auth } from "@/lib/auth";

// ---- GET: public menu -------------------------------------------------------
export async function GET() {
  try {
    await connectToDatabase();
    const sections = await getMenuSections();

    // Load any image IDs and replace with full data URLs
    for (const section of sections) {
      for (const item of section.items) {
        if (item.img && item.img.length === 24 && /^[0-9a-f]{24}$/.test(item.img)) {
          // Looks like a MongoDB ObjectId (image ID)
          try {
            const imgDoc = await Image.findById(item.img).lean();
            if (imgDoc) item.img = imgDoc.data;
          } catch (e) {
            console.warn(`Failed to load image ${item.img}:`, e.message);
            // Leave original img value if loading fails
          }
        }
      }
    }

    // Cache for 60 seconds on browsers/CDN, then revalidate
    return NextResponse.json(
      { sections },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=3600",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/menu", err);
    return NextResponse.json({ sections: [] }, { status: 500 });
  }
}

// ---- Validation (ported from the original Express server) -------------------
function validateMenu(menu) {
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
}

// ---- PUT: replace the menu (admin only) -------------------------------------
export async function PUT(request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Please log in as an admin." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const error = validateMenu(body);
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });

  await connectToDatabase();

  // Get existing products to preserve chefPick status and images
  const existingProducts = await Product.find({}).lean();
  const chefPickMap = {};
  const imageMap = {};
  existingProducts.forEach((p) => {
    const key = `${p.category}|${p.name}`;
    if (p.chefPick) {
      chefPickMap[key] = true;
    }
    if (p.img) {
      imageMap[key] = p.img;
    }
  });

  // Build normalized category + product documents from the sections payload.
  const categoryDocs = [];
  const productDocs = [];

  body.sections.forEach((s, sIdx) => {
    const slug = String(s.id).trim();
    categoryDocs.push({
      slug,
      icon: (s.icon && String(s.icon).trim()) || "fas fa-utensils",
      title: String(s.title).trim(),
      subtitle: String(s.subtitle || "").trim(),
      note: s.note ? String(s.note).trim() : null,
      tab: String(s.tab || s.title || "").trim(),
      order: sIdx,
    });

    (s.items || []).forEach((it, iIdx) => {
      const key = `${slug}|${String(it.name).trim()}`;
      const imgStr = String(it.img || "").trim();
      // If image is empty, preserve the existing image; otherwise use the new one
      const img = imgStr || imageMap[key] || "";

      productDocs.push({
        category: slug,
        name: String(it.name).trim(),
        desc: String(it.desc || "").trim(),
        price: String(it.price || "").trim(),
        img: img,
        spicy: !!it.spicy,
        vegan: !!it.vegan,
        label: it.label ? String(it.label).trim() : null,
        chefPick: it.chefPick || chefPickMap[key] || false,
        order: iIdx,
      });
    });
  });

  // Replace the collections atomically-ish: clear, then re-insert.
  await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);
  await Category.insertMany(categoryDocs);
  if (productDocs.length) await Product.insertMany(productDocs);

  // Revalidate the menu page and home page so changes appear immediately
  revalidatePath("/menu");
  revalidatePath("/");

  return NextResponse.json({ ok: true, sections: categoryDocs.length });
}
