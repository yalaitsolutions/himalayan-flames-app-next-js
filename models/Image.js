// ============================================================
//  Image model — stores uploaded base64 images separately
//  to avoid large document sizes in the menu save request.
// ============================================================
import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    // Base64-encoded image data (data:image/jpeg;base64,...)
    data: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Image ||
  mongoose.model("Image", ImageSchema);
