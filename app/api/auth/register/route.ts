import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/server/auth-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash the password using the server-only utility
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });

    // Return the user without the password
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
} 