// POST /api/auth/signup — create a new user with email + password and send verification code

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    
    // If account already exists and is verified, return conflict
    if (existing && existing.emailVerified) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    let userId: string;

    if (existing && !existing.emailVerified) {
      // Account exists but was never verified — update password & name
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: { name: name || existing.name, password: hashedPassword },
      });
      userId = updated.id;
    } else {
      // Create new unverified user
      const user = await prisma.user.create({
        data: { name, email: normalizedEmail, password: hashedPassword, emailVerified: null },
      });
      userId = user.id;
    }

    // Generate 6-digit numeric OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Clean up any old tokens for this email and save the new one
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

    // Send email
    const mailResult = await sendVerificationEmail({
      email: normalizedEmail,
      code,
      name,
    });

    if (!mailResult.success) {
      console.warn('[signup] Email send failed, but token was created:', mailResult.error);
    }

    return NextResponse.json(
      {
        id: userId,
        email: normalizedEmail,
        requiresVerification: true,
        message: 'Verification code sent to email',
      },
      { status: 201 }
    );
  } catch (e) {
    console.error('[POST /api/auth/signup]', e);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

