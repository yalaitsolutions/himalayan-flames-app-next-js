// ============================================================
//  User model — authentication accounts (NextAuth credentials)
// ============================================================
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // bcrypt hash — never the plain-text password
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

// Avoid "OverwriteModelError" during Next.js hot reloads.
export default mongoose.models.User || mongoose.model("User", UserSchema);
