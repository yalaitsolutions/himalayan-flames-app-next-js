// ============================================================
//  /api/uploads  ->  POST an image (admin only)
//  Accepts multipart/form-data (field name: "file"), validates
//  type + size, uploads to Vercel Blob Storage, and returns
//  the blob URL for storage in the menu item.
// ============================================================
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

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

  // --- Upload to Vercel Blob Storage ---
  try {
    const filename = `menu-item-${Date.now()}-${Math.random().toString(36).slice(2)}.${ALLOWED[file.type]}`;
    const blob = await put(filename, file, { access: "public" });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    console.error("Blob upload error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to upload image: " + err.message },
      { status: 500 }
    );
  }
}
