import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/server/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ detail: "Authorization header required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: number; email: string }

    const result = await db.query("SELECT id, email, full_name, company, phone, created_at, is_active FROM users WHERE id = $1", [decoded.sub])
    const user = result.rows[0]

    if (!user) {
      return NextResponse.json({ detail: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
  }
}
