// ============================================================
//  /api/users
//    POST  -> register a new user (public)
//    GET   -> list users (admin only)
// ============================================================
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- Register a new account -------------------------------------------------
export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { ok: false, error: "Name, email and password are required." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (String(password).length < 8) {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(String(password), 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      role: "user", // new sign-ups are always regular users
    });

    return NextResponse.json(
      { ok: true, user: { id: user._id.toString(), name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/users", err);
    return NextResponse.json(
      { ok: false, error: "Could not create account." },
      { status: 500 }
    );
  }
}

// ---- List users (admin only) ------------------------------------------------
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  await connectToDatabase();
  const users = await User.find().select("name email role createdAt").lean();
  return NextResponse.json({ ok: true, users });
}
