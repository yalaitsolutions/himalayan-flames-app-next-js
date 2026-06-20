// ============================================================
//  /api/images/[id]  ->  GET a stored image
//  Returns the full base64 data URL so it can be displayed
//  in <img> tags or previews.
// ============================================================
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Image from "@/models/Image";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    await connectToDatabase();
    const doc = await Image.findById(id).lean();

    if (!doc) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ data: doc.data });
  } catch (err) {
    console.error("GET /api/images/[id]", err);
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
