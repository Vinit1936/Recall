// POST /api/auth/resend-code — resend 6-digit OTP code with 60s cooldown

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'This email is already verified. Please sign in directly.' },
        { status: 400 }
      );
    }

    // Check if a token was created in the last 60 seconds (10 min expiry = 600s, so > 540s remaining means < 60s since creation)
    const existingToken = await prisma.verificationToken.findFirst({
      where: { identifier: normalizedEmail },
    });

    if (existingToken) {
      const remainingMs = existingToken.expires.getTime() - Date.now();
      const elapsedMs = 10 * 60 * 1000 - remainingMs;
      if (elapsedMs < 60 * 1000 && elapsedMs >= 0) {
        const waitSec = Math.ceil((60 * 1000 - elapsedMs) / 1000);
        return NextResponse.json(
          { error: `Please wait ${waitSec}s before requesting a new code.` },
          { status: 429 }
        );
      }
    }

    // Generate fresh 6-digit numeric OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Upsert or replace token
    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: code,
        expires,
      },
    });

    const mailResult = await sendVerificationEmail({
      email: normalizedEmail,
      code,
      name: user.name,
    });

    if (!mailResult.success) {
      console.warn('[resend-code] Email send failed:', mailResult.error);
    }

    return NextResponse.json(
      { success: true, message: 'A new verification code has been sent to your email.' },
      { status: 200 }
    );
  } catch (e) {
    console.error('[POST /api/auth/resend-code]', e);
    return NextResponse.json(
      { error: 'Failed to resend verification code. Please try again.' },
      { status: 500 }
    );
  }
}
