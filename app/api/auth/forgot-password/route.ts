import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email-utils";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Don't reveal if user exists or not for security reasons
    if (!user) {
      return NextResponse.json(
        { success: true, message: "If your email is registered, you will receive a password reset link" },
        { status: 200 }
      );
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Set expiration time to 1 hour from now
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 1);

    // Delete any existing reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    // Create a new reset token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires: tokenExpires,
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(
      email,
      resetToken,
      user.name
    );

    return NextResponse.json(
      { success: true, message: "If your email is registered, you will receive a password reset link" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
} 