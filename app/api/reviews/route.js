// /api/reviews  ->  GET public list of customer testimonials
import { NextResponse } from "next/server";
import { getReviews } from "@/lib/data";

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("GET /api/reviews", err);
    return NextResponse.json({ reviews: [] }, { status: 500 });
  }
}
