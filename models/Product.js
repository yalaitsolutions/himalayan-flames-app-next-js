// ============================================================
//  Product model — a single menu item / dish
//  Belongs to a Category via the `category` slug.
// ============================================================
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    // Category slug this dish belongs to (e.g. "starters")
    category: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },
    price: { type: String, default: "" }, // kept as string e.g. "$16.95", "From $16"
    img: { type: String, default: "" }, // path under /uploads or an external URL
    spicy: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    label: { type: String, default: null },
    order: { type: Number, default: 0 }, // preserves item ordering within a category
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
