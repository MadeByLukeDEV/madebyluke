/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/auth/login-verify/route.ts
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";
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
    return NextResponse.json({ error: "Challenge expired" }, { status: 400 });
  }

  const credential = await prisma.passkeyCredential.findUnique({
    where: { credentialId: body.id },
  });

  console.log("Looking up credential:", body.id, "found:", !!credential);

  if (!credential) {
    return NextResponse.json({ error: "Credential not found" }, { status: 400 });
  }

  await prisma.challenge.delete({ where: { id: challengeRecord.id } });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const verification = await (verifyAuthenticationResponse as any)({
      response: body,
      expectedChallenge: challengeRecord.challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      authenticator: {
        credentialID: new Uint8Array(Buffer.from(credential.credentialId, "base64url")),
        credentialPublicKey: new Uint8Array(credential.publicKey),
        counter: Number(credential.counter),
        transports: (credential.transports as string[]) ?? [],
      },
      requireUserVerification: true,
    });

    if (!verification.verified) {
      return NextResponse.json({ error: "Verification failed" }, { status: 401 });
    }

    await prisma.passkeyCredential.update({
      where: { credentialId: credential.credentialId },
      data: {
        counter: BigInt(verification.authenticationInfo.newCounter),
        lastUsed: new Date(),
      },
    });

    const token = await createSession();
    await setSessionCookie(token);

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
