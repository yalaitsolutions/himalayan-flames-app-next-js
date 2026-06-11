// /api/contact  ->  POST a message from the contact form (public)
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";

export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const entry = await Message.create({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone || "").trim(),
      subject: String(subject || "").trim(),
      message: String(message).trim(),
    });

    return NextResponse.json({ ok: true, id: entry._id.toString() }, { status: 201 });
  } catch (err) {
    console.error("POST /api/contact", err);
    return NextResponse.json(
      { ok: false, error: "Could not send your message." },
      { status: 500 }
    );
  }
}
