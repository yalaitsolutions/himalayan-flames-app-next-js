// ============================================================
//  /api/images/[id]  ->  GET the raw image bytes for an item.
//  Images are stored as a base64 data URI in the Image
//  collection; here we decode and stream them with a long
//  immutable cache (ids are never reused).
// ============================================================
import connectToDatabase from "@/lib/mongodb";
import Image from "@/models/Image";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!/^[0-9a-f]{24}$/.test(id)) {
      return new Response("Bad image id", { status: 400 });
    }

    await connectToDatabase();
    const doc = await Image.findById(id).lean();
    if (!doc?.data) {
      return new Response("Image not found", { status: 404 });
    }

    // doc.data looks like: data:image/jpeg;base64,<payload>
    const match = /^data:(.+?);base64,(.*)$/s.exec(doc.data);
    if (!match) {
      return new Response("Corrupt image data", { status: 500 });
    }
    const contentType = match[1];
    const buffer = Buffer.from(match[2], "base64");

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        // Immutable: a given id always maps to the same bytes.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("GET /api/images/[id]", err);
    return new Response("Failed to load image", { status: 500 });
  }
}
