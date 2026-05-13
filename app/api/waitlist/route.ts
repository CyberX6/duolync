import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role } = body as { email: string; role: string };

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (role !== "brand" && role !== "creator") {
      return NextResponse.json({ error: "Role must be brand or creator." }, { status: 400 });
    }

    const entry = await db.waitlist.create({
      data: { email: email.toLowerCase().trim(), role },
    });

    return NextResponse.json({ success: true, id: entry.id }, { status: 201 });
  } catch (err: unknown) {
    const error = err as { code?: string };
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "This email is already on the waitlist!" },
        { status: 409 }
      );
    }
    console.error("[waitlist/POST]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
