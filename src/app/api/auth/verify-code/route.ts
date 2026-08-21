// POST /api/auth/verify-code — verify 6-digit OTP code and mark emailVerified

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanCode = String(code).trim();

    if (cleanCode.length !== 6) {
      return NextResponse.json(
        { error: 'Verification code must be 6 digits' },
        { status: 400 }
      );
    }

    // Look for matching valid token
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: normalizedEmail,
        token: cleanCode,
        expires: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please request a new one.' },
        { status: 400 }
      );
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { emailVerified: new Date() },
    });

    // Remove all tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    });

    return NextResponse.json(
      { success: true, message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (e) {
    console.error('[POST /api/auth/verify-code]', e);
    return NextResponse.json(
      { error: 'Something went wrong while verifying the code' },
      { status: 500 }
    );
  }
}
