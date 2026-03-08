import { generateRegistrationOptions } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const RP_ID = process.env.WEBAUTHN_RP_ID ?? "localhost";
const RP_NAME = process.env.WEBAUTHN_RP_NAME ?? "madebyluke.dev";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`register-options:${ip}`, 3, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const existingCredentials = await prisma.passkeyCredential.findMany({
    select: { credentialId: true },
  });

  // Lock registration once any passkey exists
  if (existingCredentials.length > 0) {
    return NextResponse.json({ error: "Registration is disabled" }, { status: 403 });
  }

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    // v9 types say string but runtime needs Uint8Array — cast to bypass
    userID: new TextEncoder().encode("admin-madebyluke") as unknown as string,
    userName: "admin@madebyluke.dev",
    userDisplayName: "Lukas Graf",
    attestationType: "none",
    excludeCredentials: existingCredentials.map((c) => ({
      id: c.credentialId,
      type: "public-key" as const,
    })),
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required",
    },
  });

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.challenge.create({
    data: { id: nanoid(), challenge: options.challenge, expiresAt },
  });

  return NextResponse.json(options);
}
