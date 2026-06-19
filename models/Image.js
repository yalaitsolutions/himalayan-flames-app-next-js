// ============================================================
//  Image model — stores base64 images separately to avoid
//  large document sizes and request payloads.
// ============================================================
import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    // Base64-encoded image data (e.g., "data:image/jpeg;base64,...")
    data: { type: String, required: true },
    // MIME type for reconstruction
    mimeType: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Image ||
  mongoose.model("Image", ImageSchema);
