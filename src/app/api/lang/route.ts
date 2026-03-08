// src/app/api/lang/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { lang } = await req.json();
  if (!["en", "de"].includes(lang)) {
    return NextResponse.json({ error: "Invalid lang" }, { status: 400 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set("lang", lang, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
    httpOnly: false,
  });
  return res;
}
