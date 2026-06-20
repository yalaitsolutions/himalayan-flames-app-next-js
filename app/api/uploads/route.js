// ============================================================
//  /api/uploads  ->  POST an image (admin only)
//  Accepts multipart/form-data (field name: "file"), validates
//  type + size, converts to base64, saves to DB, and returns
//  the image ID (not the full data URL).
// ============================================================
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Image from "@/models/Image";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export async function POST(request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { ok: false, error: "No file uploaded (expected form field 'file')." },
      { status: 400 }
    );
  }

  // --- Validate type ---
  const mimeType = ALLOWED[file.type];
  if (!mimeType) {
    return NextResponse.json(
      { ok: false, error: "Unsupported file type. Use JPG, PNG, WEBP, GIF, AVIF or SVG." },
      { status: 400 }
    );
  }

  // --- Validate size ---
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Image too large (max 10 MB)." },
      { status: 400 }
    );
  }

  // --- Convert to base64 and save to database ---
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const base64 = bytes.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    await connectToDatabase();
    const doc = await Image.create({ data: dataUrl, mimeType: file.type });

    return NextResponse.json({ ok: true, imageId: doc._id.toString() });
  } catch (err) {
    console.error("Image save error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to save image: " + err.message },
      { status: 500 }
    );
  }
}
