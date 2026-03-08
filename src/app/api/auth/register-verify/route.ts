// src/app/api/auth/register-verify/route.ts
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const RP_ID = process.env.WEBAUTHN_RP_ID ?? "localhost";
const ORIGIN = process.env.WEBAUTHN_ORIGIN ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const challengeRecord = await prisma.challenge.findFirst({
    where: { expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!challengeRecord) {
    return NextResponse.json({ error: "Challenge expired or not found" }, { status: 400 });
  }

  await prisma.challenge.delete({ where: { id: challengeRecord.id } });

  try {
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: challengeRecord.challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    // v9 registrationInfo shape
    const {
      credentialID,
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
    } = verification.registrationInfo;

    await prisma.passkeyCredential.create({
      data: {
        credentialId: Buffer.from(credentialID).toString("base64url"),
        publicKey: Buffer.from(credentialPublicKey),
        counter: BigInt(counter),
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports: body.response?.transports ?? [],
      },
    });

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
