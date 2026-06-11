// ============================================================
//  /api/uploads  ->  POST an image (admin only)
//  Accepts multipart/form-data (field name: "file"), validates
//  type + size, writes it to /public/uploads, and returns the
//  public path to store on the menu item.
// ============================================================
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

import { auth } from "@/lib/auth";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = {
  "image/jpeg": "jpg",
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
  const ext = ALLOWED[file.type];
  if (!ext) {
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

  // --- Build a safe, unique filename ---
  const stem = (file.name || "photo")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 60) || "photo";
  const filename = `${Date.now()}-${stem}.${ext}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(join(UPLOAD_DIR, filename), bytes);

  return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
}
