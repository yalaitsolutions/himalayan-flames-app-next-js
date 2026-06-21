// ============================================================
//  /api/uploads  ->  POST an image (admin only)
//  Accepts multipart/form-data (field name: "file"), validates
//  type + size, converts to base64 data URL for storage in menu item.
// ============================================================
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB per image (reasonable size)
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
      { ok: false, error: `Image too large (max ${MAX_BYTES / 1024 / 1024}MB). Compress and try again.` },
      { status: 400 }
    );
  }

  // --- Convert to base64 data URL ---
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const base64 = bytes.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ ok: true, url: dataUrl });
  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to upload image: " + err.message },
      { status: 500 }
    );
  }
}
