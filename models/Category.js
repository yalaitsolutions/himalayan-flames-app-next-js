// ============================================================
//  Category model — a menu section (Starters, Biryani, …)
//  Holds the section metadata; the dishes live in Product.
// ============================================================
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    // URL-friendly id used as the anchor / tab key (e.g. "starters")
    slug: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, default: "fas fa-utensils" },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    note: { type: String, default: null },
    tab: { type: String, default: "" },
    order: { type: Number, default: 0 }, // preserves section ordering
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
