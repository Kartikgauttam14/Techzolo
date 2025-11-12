import { type NextRequest, NextResponse } from "next/server";
import { userStore } from "@/lib/server/user-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ detail: "Verification token is missing" }, { status: 400 });
    }

    const user = userStore.getAll().find(u => u.verification_token === token);

    if (!user) {
      return NextResponse.json({ detail: "Invalid or expired verification token" }, { status: 400 });
    }

    if (user.email_verified) {
      return NextResponse.json({ detail: "Email already verified" }, { status: 200 });
    }

    userStore.update(user.email, { email_verified: true, verification_token: undefined });

    return NextResponse.json({ detail: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 });
  }
}