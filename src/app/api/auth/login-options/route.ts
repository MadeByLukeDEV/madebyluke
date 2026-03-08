// src/app/api/auth/login-options/route.ts
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const RP_ID = process.env.WEBAUTHN_RP_ID ?? "localhost";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`login-options:${ip}`, 10, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const credentials = await prisma.passkeyCredential.findMany({
    select: { credentialId: true, transports: true },
  });

  console.log("Credentials from DB:", credentials); // debug

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials: credentials.map((c) => ({
      // credentialId is stored as base64url string, decode to Uint8Array for v9
      id: new Uint8Array(Buffer.from(c.credentialId, "base64url")),
      type: "public-key" as const,
      transports: (c.transports as AuthenticatorTransport[]) ?? [],
    })),
    userVerification: "required",
  });

  await prisma.challenge.create({
    data: {
      id: nanoid(),
      challenge: options.challenge,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  return NextResponse.json(options);
}
