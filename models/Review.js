// ============================================================
//  Review model — customer testimonials shown on the home page
// ============================================================
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    initial: { type: String, default: "" },
    source: { type: String, default: "" },
    icon: { type: String, default: "fab fa-google" },
    stars: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);
