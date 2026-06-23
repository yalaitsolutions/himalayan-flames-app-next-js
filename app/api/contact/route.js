// /api/contact  ->  POST a message from the contact form (public)
//
// Saves the message to MongoDB (durable backup) and, if a Resend API key
// is configured, also emails it to the restaurant inbox. Email is best
// effort: a missing key or a send failure never fails the request, so the
// form keeps working even before email is set up.
import { NextResponse } from "next/server";
import { Resend } from "resend";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";

// Where contact-form messages are delivered, and who they're sent as.
const CONTACT_TO = process.env.CONTACT_TO || "thehimalayanflames@gmail.com";
const CONTACT_FROM = process.env.CONTACT_FROM || "Himalayan Flames <onboarding@resend.dev>";

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

async function sendEmail({ name, email, phone, subject, message }) {
  if (!process.env.RESEND_API_KEY) return; // email not configured yet — skip silently
  const resend = new Resend(process.env.RESEND_API_KEY);

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Subject", subject || "—"],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#555">${k}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  await resend.emails.send({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: email, // replying goes straight to the visitor
    subject: `New contact message${subject ? ` — ${subject}` : ""} from ${name}`,
    html: `
      <div style="font-family:system-ui,Arial,sans-serif;max-width:560px">
        <h2 style="margin:0 0 12px">New message from the website</h2>
        <table style="border-collapse:collapse;font-size:14px">${rows}</table>
        <p style="margin:16px 0 4px;font-weight:600;color:#555">Message</p>
        <p style="white-space:pre-wrap;margin:0;font-size:14px;line-height:1.5">${escapeHtml(message)}</p>
      </div>`,
    text: `New message from the website\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\nSubject: ${subject || "—"}\n\n${message}`,
  });
}

export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    const clean = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone || "").trim(),
      subject: String(subject || "").trim(),
      message: String(message).trim(),
    };

    // Durable record first.
    await connectToDatabase();
    const entry = await Message.create(clean);

    // Best-effort email delivery — never block the response on it.
    try {
      await sendEmail(clean);
    } catch (mailErr) {
      console.error("Contact email send failed (message still saved):", mailErr);
    }

    return NextResponse.json({ ok: true, id: entry._id.toString() }, { status: 201 });
  } catch (err) {
    console.error("POST /api/contact", err);
    return NextResponse.json(
      { ok: false, error: "Could not send your message." },
      { status: 500 }
    );
  }
}
