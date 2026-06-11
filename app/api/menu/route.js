// ============================================================
//  /api/menu
//    GET -> public nested menu ({ sections: [...] })
//    PUT -> replace the whole menu (admin only)
//
//  The admin dashboard saves the entire menu at once, so PUT
//  validates the payload then rewrites the Category + Product
//  collections to match.
// ============================================================
import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { getMenuSections } from "@/lib/data";
import { auth } from "@/lib/auth";

// ---- GET: public menu -------------------------------------------------------
export async function GET() {
  try {
    const sections = await getMenuSections();
    return NextResponse.json({ sections });
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
      productDocs.push({
        category: slug,
        name: String(it.name).trim(),
        desc: String(it.desc || "").trim(),
        price: String(it.price || "").trim(),
        img: String(it.img || "").trim(),
        spicy: !!it.spicy,
        vegan: !!it.vegan,
        label: it.label ? String(it.label).trim() : null,
        order: iIdx,
      });
    });
  });

  // Replace the collections atomically-ish: clear, then re-insert.
  await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);
  await Category.insertMany(categoryDocs);
  if (productDocs.length) await Product.insertMany(productDocs);

  return NextResponse.json({ ok: true, sections: categoryDocs.length });
}
