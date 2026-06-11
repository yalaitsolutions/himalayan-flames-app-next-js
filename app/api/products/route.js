// /api/products  ->  GET flat list of all menu items (dishes)
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ ok: true, products });
  } catch (err) {
    console.error("GET /api/products", err);
    return NextResponse.json({ ok: false, products: [] }, { status: 500 });
  }
}
