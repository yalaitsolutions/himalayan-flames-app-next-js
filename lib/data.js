// ============================================================
//  Server-side data access helpers.
//  Used directly by Server Components AND by the API route
//  handlers so there is a single source of truth for shaping
//  data (no HTTP round-trip from a Server Component).
// ============================================================
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Review from "@/models/Review";

// Assemble the nested { sections: [...] } shape the frontend menu
// expects, from the normalized Category + Product collections.
export async function getMenuSections() {
  await connectToDatabase();

  const [categories, products] = await Promise.all([
    Category.find().sort({ order: 1 }).lean(),
    Product.find().sort({ order: 1 }).lean(),
  ]);

  return categories.map((c) => ({
    id: c.slug,
    icon: c.icon || "fas fa-utensils",
    title: c.title,
    subtitle: c.subtitle || "",
    note: c.note || null,
    tab: c.tab || c.title,
    items: products
      .filter((p) => p.category === c.slug)
      .map((p) => ({
        name: p.name,
        desc: p.desc || "",
        price: p.price || "",
        img: p.img || "",
        spicy: !!p.spicy,
        vegan: !!p.vegan,
        label: p.label || null,
      })),
  }));
}

// Flat list of all dishes (used by GET /api/products).
export async function getProducts() {
  await connectToDatabase();
  return Product.find().sort({ category: 1, order: 1 }).lean();
}

export async function getReviews() {
  await connectToDatabase();
  return Review.find().sort({ order: 1 }).lean();
}

// Get chef's pick featured dishes
export async function getChefPickDishes() {
  await connectToDatabase();
  return Product.find({ chefPick: true }).sort({ order: 1 }).lean();
}
