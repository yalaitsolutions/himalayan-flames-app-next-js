import { NextResponse } from "next/server";
import { getChefPickDishes } from "@/lib/data";

export async function GET() {
  try {
    const dishes = await getChefPickDishes();
    return NextResponse.json(
      { dishes },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=3600",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/chef-picks", err);
    return NextResponse.json({ dishes: [] }, { status: 500 });
  }
}
