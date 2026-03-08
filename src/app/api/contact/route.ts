// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";
import { prisma } from "@/lib/prisma";
import { corsHeaders } from "@/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  // Rate limit: 3 messages per 10 minutes per IP
  const limit = rateLimit(`contact:${ip}`, 3, 10 * 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before sending another message." },
      { status: 429, headers: corsHeaders(origin) }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422, headers: corsHeaders(origin) }
    );
  }

  const { name, email, message } = parsed.data;

  try {
    // Save to DB
    await prisma.message.create({ data: { name, email, message } });

    // Send email via Resend
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "business@madebyluke.dev",
      to: process.env.CONTACT_TO_EMAIL ?? "business@madebyluke.dev",
      subject: `New contact from ${name} — madebyluke.dev`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00FFA8;">New Contact Message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 3px solid #00FFA8; padding-left: 16px; color: #555;">
            ${escapeHtml(message).replace(/\n/g, "<br>")}
          </blockquote>
          <hr>
          <p style="color: #999; font-size: 12px;">Sent via madebyluke.dev contact form</p>
        </div>
      `,
      replyTo: email,
    });

    return NextResponse.json(
      { success: true },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
